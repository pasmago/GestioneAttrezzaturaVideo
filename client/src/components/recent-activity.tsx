import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { LogIn, LogOut, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

export function RecentActivity() {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['/api/transactions/recent'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Attività Recenti</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3 animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'checkout':
        return {
          icon: LogOut,
          color: 'text-orange-600',
          bg: 'bg-orange-100',
        };
      case 'checkin':
        return {
          icon: LogIn,
          color: 'text-green-600',
          bg: 'bg-green-100',
        };
      default:
        return {
          icon: AlertTriangle,
          color: 'text-red-600',
          bg: 'bg-red-100',
        };
    }
  };

  const getActivityText = (transaction: any) => {
    const userName = transaction.user ? 
      `${transaction.user.firstName || ''} ${transaction.user.lastName || ''}`.trim() || 
      transaction.user.email || 
      'Utente Sconosciuto' 
      : 'Utente Sconosciuto';
    
    const equipmentName = transaction.equipment?.name || 'Attrezzatura Sconosciuta';

    switch (transaction.type) {
      case 'checkout':
        return `${userName} ha prelevato ${equipmentName}`;
      case 'checkin':
        return `${userName} ha riconsegnato ${equipmentName}`;
      default:
        return `Azione sconosciuta su ${equipmentName}`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attività Recenti</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions && (transactions as any)?.length > 0 ? (
            (transactions as any)?.map((transaction: any) => {
              const activity = getActivityIcon(transaction.type);
              return (
                <div key={transaction.id} className="flex items-start space-x-3">
                  <div className={`w-8 h-8 ${activity.bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <activity.icon className={`${activity.color} h-4 w-4`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      {getActivityText(transaction)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(transaction.createdAt), 'dd MMM yyyy HH:mm', { locale: it })}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              Nessuna attività recente
            </p>
          )}
        </div>
        
        <Button variant="ghost" className="w-full mt-4 text-blue-600 hover:text-blue-700">
          Visualizza tutto lo storico
        </Button>
      </CardContent>
    </Card>
  );
}
