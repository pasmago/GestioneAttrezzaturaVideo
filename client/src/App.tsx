import React from 'react';
import { Router, Route } from 'wouter'; 
import { useAuth } from './hooks/useAuth';
import Landing from './pages/landing';
import Dashboard from './pages/dashboard';
import NotFound from './pages/not-found'; 
import { UserButton, SignOutButton } from "@clerk/clerk-react";
import { Button } from '@/components/ui/button'; // Assicurati che Button sia importato

export default function App() {
  const { isAuthenticated, isLoading } = useAuth();

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
              {/* afterSignOutUrl è ancora valido per UserButton */}
              <UserButton afterSignOutUrl="/" /> 
              {/* afterSignOutUrl è ancora valido per SignOutButton */}
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
          <Route path="/" component={Landing} />

          {isAuthenticated && (
            <>
              <Route path="/dashboard" component={Dashboard} />
            </>
          )}

          <Route component={NotFound} />
        </Router>
      </main>
    </>
  );
}
