import React from 'react';
// Importa Router e Route da 'wouter'
import { Router, Route } from 'wouter'; 
import { useAuth } from './hooks/useAuth';
import Landing from './pages/landing';
import Dashboard from './pages/dashboard';
import NotFound from './pages/not-found'; 
// Importa i componenti UserButton e SignOutButton da Clerk
import { UserButton, SignOutButton } from "@clerk/clerk-react";

export default function App() {
  const { isAuthenticated, isLoading } = useAuth();

  // Mostra una schermata di caricamento mentre l'autenticazione è in corso
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">Caricamento...</p>
      </div>
    );
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm p-4 flex justify-between items-center z-10">
        <h1 className="text-xl font-bold text-gray-800">VideoGear Pro</h1>
        <nav className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              {/* Mostra il UserButton se l'utente è autenticato */}
              <UserButton afterSignOutUrl="/" /> 
              {/* Mostra il SignOutButton per il logout */}
              <SignOutButton afterSignOutUrl="/">
                <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                  Logout
                </button>
              </SignOutButton>
            </>
          ) : (
            // Se non autenticato, puoi mostrare un login button se Landing non lo fa già
            // o lasciare che Landing gestisca il suo proprio login button
            <p className="text-gray-600">Non autenticato</p>
          )}
        </nav>
      </header>
      <main className="pt-20"> {/* Aggiungi padding per evitare che il contenuto sia sotto l'header */}
        {/* Usa il componente Router per definire le rotte */}
        <Router>
          {/* Rotta pubblica: Landing Page */}
          <Route path="/" component={Landing} />

          {/* Rotte autenticate */}
          {isAuthenticated && (
            <>
              <Route path="/dashboard" component={Dashboard} />
              {/* Aggiungi qui altre rotte autenticate */}
            </>
          )}

          {/* Rotta 404 (NotFound) - Gestisce tutte le rotte non corrispondenti */}
          {/* Se l'utente non è autenticato e tenta di accedere a una rotta autenticata,
              verrà reindirizzato alla Landing page dal controllo isAuthenticated sopra.
              Questo NotFound gestirà solo le rotte non esistenti. */}
          <Route component={NotFound} />
        </Router>
      </main>
    </>
  );
}
