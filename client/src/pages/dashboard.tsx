import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { NavigationHeader } from '@/components/navigation-header';
import { StatsDashboard } from '@/components/stats-dashboard';
import { EquipmentTable } from '@/components/equipment-table';
import { RecentActivity } from '@/components/recent-activity';
import { MaintenanceAlerts } from '@/components/maintenance-alerts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, FileText } from 'lucide-react';
import { Equipment } from '@shared/schema';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const { data: equipment = [], isLoading } = useQuery<Equipment[]>({
    queryKey: ['/api/equipment', searchQuery, selectedCategory].filter(Boolean),
    enabled: true,
  });

  const handleSearch = (query: string, category?: string) => {
    setSearchQuery(query);
    setSelectedCategory(category || '');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Dashboard Panoramica</h2>
              <p className="text-gray-600 mt-1">Monitoraggio in tempo reale dell'attrezzatura video</p>
            </div>
          </div>

          {/* Stats Dashboard */}
          <StatsDashboard />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Equipment Table */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-16 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <EquipmentTable equipment={equipment} onSearch={handleSearch} />
            )}
          </div>

          {/* Sidebar Widgets */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <RecentActivity />

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Azioni Rapide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <QrCode className="h-4 w-4 mr-2" />
                  Scansiona QR
                </Button>
                <Button variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Esporta Report
                </Button>
              </CardContent>
            </Card>

            {/* Maintenance Alerts */}
            <MaintenanceAlerts />
          </div>
        </div>
      </div>
    </div>
  );
}
