import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
// Aggiungi la variabile per il dominio di Clerk
const CLERK_FRONTEND_API = import.meta.env.VITE_CLERK_FRONTEND_API || "https://clerk.curious-katydid-26.clerk.accounts.dev"; // Sostituisci con il tuo dominio Clerk se è diverso

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key for Clerk! Please set VITE_CLERK_PUBLISHABLE_KEY in your .env file.");
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider
    publishableKey={PUBLISHABLE_KEY}
    domain={CLERK_FRONTEND_API}
    // Specifica esplicitamente dove reindirizzare dopo il login/registrazione
    afterSignInUrl="/"
    afterSignUpUrl="/"
  >
    <App />
  </ClerkProvider>
);

