import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "..", "dist", "public"); 
  const indexPath = path.resolve(distPath, "index.html"); // Percorso completo a index.html

  log(`Attempting to serve static files from: ${distPath}`);

  if (!fs.existsSync(distPath)) {
    log(`ERROR: Build directory not found: ${distPath}`, "static-server");
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // 1. Servire esplicitamente index.html per la rotta radice "/"
  app.get("/", (req, res) => {
    if (fs.existsSync(indexPath)) {
      log(`Serving index.html for root request: ${req.originalUrl}`, "static-server");
      res.sendFile(indexPath);
    } else {
      log(`ERROR: index.html not found at ${indexPath} for root request`, "static-server");
      res.status(404).send("404 Not Found: index.html missing for root");
    }
  });

  // 2. Servire tutti gli altri file statici dalla cartella dist/public
  app.use(express.static(distPath));

  // 3. Fallback per tutte le altre rotte (per il routing lato client)
  app.use("*", (req, res) => {
    if (fs.existsSync(indexPath)) {
      log(`Serving index.html for fallback request: ${req.originalUrl}`, "static-server");
      res.sendFile(indexPath);
    } else {
      log(`ERROR: index.html not found at ${indexPath} for fallback`, "static-server");
      res.status(404).send("404 Not Found: index.html missing for fallback");
    }
  });
}
