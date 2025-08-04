import React from 'react';
import { Router, Route } from 'wouter'; 
import { useAuth } from './hooks/useAuth';
import Landing from './pages/landing';
import Dashboard from './pages/dashboard';
import NotFound from './pages/not-found'; 
import { UserButton, SignOutButton } from "@clerk/clerk-react";
import { Button } from '@/components/ui/button'; 

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

  // Renderizza il layout generale dell'applicazione
  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm p-4 flex justify-between items-center z-10">
        <h1 className="text-xl font-bold text-gray-800">VideoGear Pro</h1>
        <nav className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <UserButton afterSignOutUrl="/" /> 
              <SignOutButton afterSignOutUrl="/">
                <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                  Logout
                </button>
              </SignOutButton>
            </>
          ) : (
            <p className="text-gray-600">Non autenticato</p>
          )}
        </nav>
      </header>
      <main className="pt-20">
        <Router>
          {/* Se l'utente è autenticato, renderizza solo le rotte autenticate */}
          {isAuthenticated ? (
            <>
              <Route path="/" component={Dashboard} /> {/* La radice per l'utente autenticato è la Dashboard */}
              <Route path="/dashboard" component={Dashboard} /> {/* Rotta esplicita per la Dashboard */}
              {/* Aggiungi qui altre rotte autenticate */}
              <Route component={NotFound} /> {/* 404 per rotte non autenticate */}
            </>
          ) : (
            <>
              {/* Se l'utente NON è autenticato, renderizza solo le rotte pubbliche */}
              <Route path="/" component={Landing} /> {/* La radice per l'utente non autenticato è la Landing */}
              {/* Tutte le altre rotte per utenti non autenticati portano al 404 */}
              <Route component={NotFound} /> 
            </>
          )}
        </Router>
      </main>
    </>
  );
}

