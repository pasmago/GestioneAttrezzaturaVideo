import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { Package, CheckCircle, Clock, Wrench } from 'lucide-react';

export function StatsDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/equipment/stats'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statsCards = [
    {
      title: 'Totale Attrezzature',
      value: stats?.total || 0,
      icon: Package,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
    },
    {
      title: 'Disponibili',
      value: stats?.available || 0,
      icon: CheckCircle,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100',
    },
    {
      title: 'In Uso',
      value: stats?.inUse || 0,
      icon: Clock,
      iconColor: 'text-orange-600',
      iconBg: 'bg-orange-100',
    },
    {
      title: 'Manutenzione',
      value: stats?.maintenance || 0,
      icon: Wrench,
      iconColor: 'text-red-600',
      iconBg: 'bg-red-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsCards.map((card, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
              </div>
              <div className={`w-12 h-12 ${card.iconBg} rounded-lg flex items-center justify-center`}>
                <card.icon className={`${card.iconColor} h-6 w-6`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
