import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";
// Importa QueryClient e QueryClientProvider
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const CLERK_FRONTEND_API_URL = import.meta.env.VITE_CLERK_FRONTEND_API || "https://curious-katydid-26.clerk.accounts.dev"; 

// Rimuovi questi console.log dopo aver verificato che tutto funziona
console.log("Clerk Publishable Key (frontend):", PUBLISHABLE_KEY);
console.log("Clerk Frontend API URL (frontend):", CLERK_FRONTEND_API_URL);

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key for Clerk! Please set VITE_CLERK_PUBLISHABLE_KEY in your .env file.");
}

// Crea un'istanza di QueryClient
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  // Avvolgi tutto con QueryClientProvider
  <QueryClientProvider client={queryClient}>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      domain={CLERK_FRONTEND_API_URL}
      afterSignInUrl="/"
      afterSignUpUrl="/"
    >
      <App />
    </ClerkProvider>
  </QueryClientProvider>
);
