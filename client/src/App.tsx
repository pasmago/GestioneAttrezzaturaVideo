import React from 'react';
import { useRoutes } from 'wouter';
import { useAuth } from './hooks/useAuth';
import Landing from './pages/landing';
import Dashboard from './pages/dashboard';
// CORREZIONE QUI: Cambia 'NotFound' in 'not-found' per corrispondere al nome del file
import NotFound from './pages/not-found'; 
// Importa i componenti UserButton e SignOutButton da Clerk
import { UserButton, SignOutButton } from "@clerk/clerk-react";

// Definisci le rotte dell'applicazione
const publicRoutes = {
  '/': () => <Landing />,
};

const authenticatedRoutes = {
  '/dashboard': () => <Dashboard />,
  // Aggiungi qui altre rotte autenticate
};

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

  // Se l'utente non è autenticato, usa solo le rotte pubbliche
  const routeResult = useRoutes(isAuthenticated ? { ...publicRoutes, ...authenticatedRoutes } : publicRoutes);

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
        {routeResult || <NotFound />}
      </main>
    </>
  );
}


