import React, { useEffect } from 'react';
import { Router, Route, useLocation } from 'wouter'; // Importa useLocation
import { useAuth } from './hooks/useAuth';
import Landing from './pages/landing';
import Dashboard from './pages/dashboard';
import NotFound from './pages/not-found'; 
import { UserButton, SignOutButton } from "@clerk/clerk-react";
import { Button } from '@/components/ui/button'; 

export default function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const [location, setLocation] = useLocation(); // Ottieni la funzione per cambiare rotta

  // Effetto per reindirizzare dopo l'autenticazione
  useEffect(() => {
    if (!isLoading && isAuthenticated && location === "/") {
      // Se l'utente è autenticato e si trova sulla landing page, reindirizza alla dashboard
      setLocation("/dashboard");
    } else if (!isLoading && !isAuthenticated && location !== "/") {
      // Se l'utente non è autenticato e non è sulla landing page, reindirizza alla landing
      // Questo gestisce il caso in cui un utente non loggato tenta di accedere a /dashboard
      setLocation("/");
    }
  }, [isAuthenticated, isLoading, location, setLocation]);

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
          {/* Rotta pubblica: Landing Page */}
          <Route path="/" component={Landing} />

          {/* Rotta Dashboard (solo se autenticato) */}
          <Route path="/dashboard">
            {isAuthenticated ? <Dashboard /> : <Landing />} {/* Se non autenticato, mostra Landing */}
          </Route>

          {/* Rotta 404 (NotFound) - Gestisce tutte le rotte non corrispondenti */}
          <Route component={NotFound} />
        </Router>
      </main>
    </>
  );
}
