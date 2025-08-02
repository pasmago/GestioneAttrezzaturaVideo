import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Video, Shield, Clock, BarChart } from 'lucide-react';
import { SignInButton } from "@clerk/clerk-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="pt-16 pb-20 text-center">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
              <Video className="text-primary-foreground h-10 w-10" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            VideoGear Pro
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Sistema professionale per la gestione dell'attrezzatura video con tracciabilità 
            in tempo reale, controllo degli accessi e manutenzione programmata.
          </p>
          
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-3" asChild>
            {/* AGGIORNAMENTO QUI: Usa mode="modal" e le nuove proprietà di reindirizzamento */}
            <SignInButton 
              mode="modal" 
              fallbackRedirectUrl="/" 
              forceRedirectUrl="/"
            >
              Accedi al Sistema
            </SignInButton>
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Controllo Accessi</h3>
              <p className="text-sm text-gray-600">
                Gestione ruoli amministratore e operatore con permessi differenziati
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Tracciamento Real-time</h3>
              <p className="text-sm text-gray-600">
                Monitoraggio in tempo reale dello stato e utilizzo dell'attrezzatura
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Analytics Avanzate</h3>
              <p className="text-sm text-gray-600">
                Statistiche dettagliate sull'utilizzo e costi di manutenzione
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Video className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Specializzato Video</h3>
              <p className="text-sm text-gray-600">
                Progettato specificamente per l'industria dell'audiovisivo
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Benefits */}
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl p-8 md:p-12 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Perché Scegliere VideoGear Pro?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Una soluzione completa per ottimizzare la gestione delle tue risorse video
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 font-bold text-sm">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Tracciabilità Completa</h4>
                  <p className="text-gray-600">Storico dettagliato di ogni prelievo e riconsegna con firme digitali</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 font-bold text-sm">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Prevenzione Frodi</h4>
                  <p className="text-gray-600">Sistema di audit log per prevenire utilizzi non autorizzati</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 font-bold text-sm">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Manutenzione Programmata</h4>
                  <p className="text-gray-600">Gestione automatica degli interventi di manutenzione</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 font-bold text-sm">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Interfaccia Moderna</h4>
                  <p className="text-gray-600">Design responsive e intuitivo per tutti i dispositivi</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 font-bold text-sm">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Calcolo Ore Utilizzo</h4>
                  <p className="text-gray-600">Monitoraggio automatico delle ore di utilizzo per attrezzatura</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 font-bold text-sm">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Gestione Ruoli</h4>
                  <p className="text-gray-600">Controllo granulare degli accessi e delle funzionalità</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Pronto per Iniziare?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Accedi al sistema e inizia a gestire la tua attrezzatura video in modo professionale
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-3" asChild>
            {/* AGGIORNAMENTO QUI: Usa mode="modal" e le nuove proprietà di reindirizzamento */}
            <SignInButton 
              mode="modal" 
              fallbackRedirectUrl="/" 
              forceRedirectUrl="/"
            >
              Accedi Ora
            </SignInButton>
          </Button>
        </div>
      </div>
    </div>
  );
}
