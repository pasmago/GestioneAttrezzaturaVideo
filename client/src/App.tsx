import React, { useEffect } from 'react';
import { useLocation } from 'wouter'; // Manteniamo useLocation
import { useAuth } from './hooks/useAuth';
import Landing from './pages/landing';
import Dashboard from './pages/dashboard';
import NotFound from './pages/not-found'; 
import { UserButton, SignOutButton } from "@clerk/clerk-react";
import { Button } from '@/components/ui/button'; 

export default function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const [location, setLocation] = useLocation(); // Ottieni location e setter

  // Mostra una schermata di caricamento mentre l'autenticazione è in corso
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">Caricamento...</p>
      </div>
    );
  }

  // --- Logica di Routing Principale ---
  // Se autenticato, reindirizza sempre alla dashboard.
  // Se non autenticato, reindirizza sempre alla landing.
  if (isAuthenticated) {
    if (location !== "/dashboard") {
      setLocation("/dashboard");
      return null; // Impedisce il rendering di qualsiasi cosa durante il reindirizzamento
    }
    // Se già sulla dashboard e autenticato, renderizza la dashboard
    return (
      <>
        <header className="fixed top-0 left-0 right-0 bg-white shadow-sm p-4 flex justify-between items-center z-10">
          <h1 className="text-xl font-bold text-gray-800">VideoGear Pro</h1>
          <nav className="flex items-center space-x-4">
            <UserButton afterSignOutUrl="/" /> 
            <SignOutButton afterSignOutUrl="/">
              <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                Logout
              </button>
            </SignOutButton>
          </nav>
        </header>
        <main className="pt-20">
          <Dashboard />
        </main>
      </>
    );
  } else { // Non autenticato
    if (location !== "/") {
      setLocation("/");
      return null; // Impedisce il rendering di qualsiasi cosa durante il reindirizzamento
    }
    // Se già sulla landing e non autenticato, renderizza la landing
    return (
      <>
        <header className="fixed top-0 left-0 right-0 bg-white shadow-sm p-4 flex justify-between items-center z-10">
          <h1 className="text-xl font-bold text-gray-800">VideoGear Pro</h1>
          <nav className="flex items-center space-x-4">
            <p className="text-gray-600">Non autenticato</p>
          </nav>
        </header>
        <main className="pt-20">
          <Landing />
        </main>
      </>
    );
  }

  // Questo codice non dovrebbe mai essere raggiunto se la logica sopra copre tutti gli stati.
  // Se per qualche motivo ci arriviamo, mostriamo un NotFound.
  // return <NotFound />; // Rimosso in quanto gestito dai reindirizzamenti espliciti.
}
