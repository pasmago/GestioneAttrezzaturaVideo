import React from 'react';
import { NavigationHeader } from '@/components/navigation-header';

export default function Inventory() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Inventario Completo</h2>
          <p className="text-gray-600">Gestione completa dell'inventario attrezzature - In sviluppo</p>
        </div>
      </div>
    </div>
  );
}
