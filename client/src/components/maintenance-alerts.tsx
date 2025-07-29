import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { Calendar, AlertCircle } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { it } from 'date-fns/locale';

export function MaintenanceAlerts() {
  const { data: maintenance, isLoading } = useQuery({
    queryKey: ['/api/maintenance/upcoming'],
    refetchInterval: 60000, // Refresh every minute
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Avvisi Manutenzione</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="p-3 bg-gray-100 rounded-lg border">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getMaintenanceAlert = (scheduledDate: string, status: string) => {
    const now = new Date();
    const scheduled = new Date(scheduledDate);
    const daysUntil = differenceInDays(scheduled, now);

    if (status === 'overdue' || daysUntil < 0) {
      return {
        color: 'border-red-200 bg-red-50',
        icon: AlertCircle,
        iconColor: 'text-red-600',
        message: 'Richiede manutenzione urgente',
      };
    } else if (daysUntil <= 7) {
      return {
        color: 'border-yellow-200 bg-yellow-50',
        icon: Calendar,
        iconColor: 'text-yellow-600',
        message: `Manutenzione programmata in ${daysUntil} giorni`,
      };
    } else {
      return {
        color: 'border-blue-200 bg-blue-50',
        icon: Calendar,
        iconColor: 'text-blue-600',
        message: `Manutenzione programmata il ${format(scheduled, 'dd MMM', { locale: it })}`,
      };
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Avvisi Manutenzione</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {maintenance && maintenance.length > 0 ? (
            maintenance.map((item: any) => {
              const alert = getMaintenanceAlert(item.scheduledDate, item.status);
              return (
                <div key={item.id} className={`flex items-center space-x-3 p-3 rounded-lg border ${alert.color}`}>
                  <alert.icon className={`h-5 w-5 ${alert.iconColor}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {item.equipment?.name || 'Attrezzatura Sconosciuta'}
                    </p>
                    <p className="text-xs text-gray-600">{alert.message}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              Nessuna manutenzione programmata
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
