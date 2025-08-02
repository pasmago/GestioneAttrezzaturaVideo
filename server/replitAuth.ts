import { ClerkExpressRequireAuth, ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import type { Express, Request, Response, NextFunction, RequestHandler } from "express";
// Rimuovi l'import di session e connectPg se non usi express-session altrove
// import session from "express-session";
// import connectPg from "connect-pg-simple";
import { storage } from "./storage";

if (!process.env.CLERK_SECRET_KEY || !process.env.CLERK_ISSUER_URL || !process.env.PUBLIC_FRONTEND_URL) {
  throw new Error("Missing Clerk environment variables: CLERK_SECRET_KEY, CLERK_ISSUER_URL, or PUBLIC_FRONTEND_URL");
}

// Rimuovi completamente la funzione getSession() se non usi express-session
/*
export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl,
      sameSite: "lax",
    },
  });
}
*/

async function upsertUser(claims: any) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  // Rimuovi l'uso di getSession()
  // app.use(getSession());

  console.log("CLERK_ISSUER_URL (backend):", process.env.CLERK_ISSUER_URL);

  // Modifica qui: usa jwksUri e il percorso completo
  app.use(ClerkExpressWithAuth({
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.CLERK_SECRET_KEY,
    // jwtKey è deprecato, usa jwksUri
    jwksUri: `${process.env.CLERK_ISSUER_URL}/.well-known/jwks.json`, // <-- CORREZIONE CRUCIALE
  }));

  app.use(async (req: Request & { auth?: any; user?: any; session?: any }, res: Response, next: NextFunction) => {
    console.log("req.auth (from ClerkExpressWithAuth):", req.auth);

    if (req.auth && req.auth.userId) {
      try {
        const claims = req.auth.sessionClaims;
        if (claims && claims.sub) {
          req.user = {
            claims: {
              sub: claims.sub,
              email: claims.email,
              first_name: claims.first_name,
              last_name: claims.last_name,
            },
          };
          await upsertUser(req.user.claims);
        } else {
          req.user = undefined;
        }
      } catch (error) {
        console.error("Error upserting user from Clerk claims:", error);
        req.user = undefined;
      }
    } else {
      req.user = undefined;
    }
    next();
  });

  app.get('/api/auth/user', isAuthenticated, async (req: any, res: Response) => {
    try {
      if (!req.user || !req.user.claims || !req.user.claims.sub) {
        console.error("User not authenticated or claims missing in /api/auth/user route.");
        return res.status(401).json({ message: "Unauthenticated" });
      }
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.get("/api/logout", (req: Request, res: Response) => {
    const clerkLogoutUrl = `https://accounts.clerk.com/sign-out?redirect_url=${encodeURIComponent(process.env.PUBLIC_FRONTEND_URL || req.protocol + '://' + req.hostname)}`;
    res.redirect(clerkLogoutUrl);
  });
}

export const isAuthenticated: RequestHandler = ClerkExpressRequireAuth();
