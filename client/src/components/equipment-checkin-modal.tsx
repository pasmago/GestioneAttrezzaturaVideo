import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Equipment } from '@shared/schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface EquipmentCheckinModalProps {
  equipment: Equipment | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EquipmentCheckinModal({ equipment, isOpen, onClose }: EquipmentCheckinModalProps) {
  const [conditionOnReturn, setConditionOnReturn] = useState('');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const checkinMutation = useMutation({
    mutationFn: async (data: { equipmentId: string; conditionOnReturn: string; notes?: string }) => {
      await apiRequest('POST', '/api/transactions/checkin', data);
    },
    onSuccess: () => {
      toast({
        title: "Successo",
        description: "Attrezzatura riconsegnata con successo",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/equipment'] });
      queryClient.invalidateQueries({ queryKey: ['/api/equipment/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions/recent'] });
      onClose();
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: error.message || "Errore durante la riconsegna",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setConditionOnReturn('');
    setNotes('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!equipment || !conditionOnReturn) {
      toast({
        title: "Campo obbligatorio",
        description: "Seleziona lo stato dell'attrezzatura alla riconsegna",
        variant: "destructive",
      });
      return;
    }

    checkinMutation.mutate({
      equipmentId: equipment.id,
      conditionOnReturn,
      notes: notes.trim() || undefined,
    });
  };

  const handleClose = () => {
    if (!checkinMutation.isPending) {
      onClose();
      resetForm();
    }
  };

  if (!equipment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Riconsegna Attrezzatura</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Equipment Info */}
          <div className="flex items-center space-x-4">
            {equipment.imageUrl && (
              <img
                src={equipment.imageUrl}
                alt={equipment.name}
                className="w-16 h-16 rounded-lg object-cover border border-gray-200"
              />
            )}
            <div>
              <h4 className="font-medium text-gray-900">{equipment.name}</h4>
              <p className="text-sm text-gray-500">SN: {equipment.code}</p>
              <Badge variant="outline" className="mt-1 bg-orange-100 text-orange-800">
                In Uso
              </Badge>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Condition on Return */}
            <div>
              <Label htmlFor="condition">Stato Attrezzatura alla Riconsegna *</Label>
              <Select value={conditionOnReturn} onValueChange={setConditionOnReturn}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona lo stato..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Perfette condizioni</SelectItem>
                  <SelectItem value="good">Buone condizioni</SelectItem>
                  <SelectItem value="fair">Condizioni discrete</SelectItem>
                  <SelectItem value="damaged">Danneggiata</SelectItem>
                  <SelectItem value="malfunction">Malfunzionamento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Note Aggiuntive</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Eventuali problemi riscontrati, danni o osservazioni..."
                rows={3}
              />
            </div>

            {/* Warning for damages */}
            {(conditionOnReturn === 'damaged' || conditionOnReturn === 'malfunction') && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium">Attenzione</p>
                    <p className="mt-1">
                      Hai segnalato un problema con l'attrezzatura. Descrivi dettagliatamente
                      la situazione nelle note per facilitare la manutenzione.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={checkinMutation.isPending}
                className="flex-1"
              >
                Annulla
              </Button>
              <Button
                type="submit"
                disabled={checkinMutation.isPending || !conditionOnReturn}
                className="flex-1"
              >
                {checkinMutation.isPending ? "Elaborazione..." : "Conferma Riconsegna"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
