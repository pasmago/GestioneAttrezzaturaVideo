import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
// Importa ClerkProvider dalla libreria client-side di Clerk
import { ClerkProvider } from "@clerk/clerk-react";

// Assicurati che la chiave pubblicabile di Clerk sia disponibile.
// In un'applicazione Vite, le variabili d'ambiente client-side
// devono iniziare con VITE_.
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  // Se la chiave non è definita, lancia un errore per avvisare
  throw new Error("Missing Publishable Key for Clerk! Please set VITE_CLERK_PUBLISHABLE_KEY in your .env file.");
}

createRoot(document.getElementById("root")!).render(
  // Avvolgi la tua App con il ClerkProvider
  // Questo inizializza Clerk e rende l'autenticazione disponibile
  // a tutti i componenti figli.
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <App />
  </ClerkProvider>
);
