import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const CLERK_FRONTEND_API_URL = import.meta.env.VITE_CLERK_FRONTEND_API || "https://curious-katydid-26.clerk.accounts.dev"; 

// Aggiungi questo console.log per debug. Lo rimuoveremo dopo.
console.log("Clerk Publishable Key (frontend):", PUBLISHABLE_KEY);
console.log("Clerk Frontend API URL (frontend):", CLERK_FRONTEND_API_URL);

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key for Clerk! Please set VITE_CLERK_PUBLISHABLE_KEY in your .env file.");
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider
    publishableKey={PUBLISHABLE_KEY}
    clerkJSUrl={`${CLERK_FRONTEND_API_URL}/clerk.js`}
    domain={CLERK_FRONTEND_API_URL}
    afterSignInUrl="/"
    afterSignUpUrl="/"
  >
    <App />
  </ClerkProvider>
);


