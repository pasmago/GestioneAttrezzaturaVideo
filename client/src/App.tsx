import React, { useEffect } from 'react'; // Re-introduce useEffect
import { Router, Route, useLocation } from 'wouter'; // Re-introduce useLocation
import { useAuth } from './hooks/useAuth';
import Landing from './pages/landing';
import Dashboard from './pages/dashboard';
import NotFound from './pages/not-found'; 
import { UserButton, SignOutButton } from "@clerk/clerk-react";
import { Button } from '@/components/ui/button'; 

export default function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const [location, setLocation] = useLocation(); // Get location and setter

  // Effect to handle redirects based on authentication state
  useEffect(() => {
    if (!isLoading) { // Only act when Clerk's loading state is resolved
      if (isAuthenticated) {
        // If authenticated and not on dashboard, redirect to dashboard
        if (location !== "/dashboard") {
          setLocation("/dashboard");
        }
      } else {
        // If not authenticated and not on landing, redirect to landing
        if (location !== "/") {
          setLocation("/");
        }
      }
    }
  }, [isAuthenticated, isLoading, location, setLocation]);

  // Show a loading screen while authentication is in progress
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">Caricamento...</p>
      </div>
    );
  }

  // Render the main application layout
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
          {/* Routes for authenticated users */}
          {isAuthenticated && (
            <>
              <Route path="/dashboard" component={Dashboard} />
              {/* Other authenticated routes go here */}
            </>
          )}

          {/* Routes for unauthenticated users */}
          {!isAuthenticated && (
            <>
              <Route path="/" component={Landing} />
            </>
          )}

          {/* Fallback for any unmatched routes. 
              This should ideally only be hit for genuinely non-existent paths
              after the useEffect has handled auth-based redirects. */}
          <Route component={NotFound} />
        </Router>
      </main>
    </>
  );
}
