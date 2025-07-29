import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { SignaturePad } from '@/components/ui/signature-pad';
import { Equipment } from '@shared/schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Info } from 'lucide-react';

interface EquipmentCheckoutModalProps {
  equipment: Equipment | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EquipmentCheckoutModal({ equipment, isOpen, onClose }: EquipmentCheckoutModalProps) {
  const [purpose, setPurpose] = useState('');
  const [signature, setSignature] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const checkoutMutation = useMutation({
    mutationFn: async (data: { equipmentId: string; purpose: string; signature: string }) => {
      await apiRequest('POST', '/api/transactions/checkout', data);
    },
    onSuccess: () => {
      toast({
        title: "Successo",
        description: "Attrezzatura prelevata con successo",
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
        description: error.message || "Errore durante il prelievo",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setPurpose('');
    setSignature('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!equipment || !purpose.trim() || !signature) {
      toast({
        title: "Campi obbligatori",
        description: "Compila tutti i campi richiesti e apponi la firma",
        variant: "destructive",
      });
      return;
    }

    checkoutMutation.mutate({
      equipmentId: equipment.id,
      purpose: purpose.trim(),
      signature,
    });
  };

  const handleClose = () => {
    if (!checkoutMutation.isPending) {
      onClose();
      resetForm();
    }
  };

  if (!equipment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Prelievo Attrezzatura</DialogTitle>
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
              <Badge variant="outline" className="mt-1">
                {equipment.status === 'available' ? 'Disponibile' : equipment.status}
              </Badge>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Purpose */}
            <div>
              <Label htmlFor="purpose">Scopo Utilizzo *</Label>
              <Textarea
                id="purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Descrivi brevemente l'uso previsto dell'attrezzatura..."
                rows={3}
                required
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Data Prelievo</Label>
                <Input
                  id="date"
                  type="date"
                  value={format(new Date(), 'yyyy-MM-dd')}
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="time">Ora Prelievo</Label>
                <Input
                  id="time"
                  type="time"
                  value={format(new Date(), 'HH:mm')}
                  readOnly
                />
              </div>
            </div>

            {/* Responsibility Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Conferma Responsabilità</p>
                  <p className="mt-1">
                    Confermando il prelievo, ti assumi la responsabilità per l'uso corretto
                    e la restituzione dell'attrezzatura in buone condizioni.
                  </p>
                </div>
              </div>
            </div>

            {/* Digital Signature */}
            <div>
              <Label>Firma Digitale *</Label>
              <div className="mt-2">
                <SignaturePad
                  onSignatureChange={setSignature}
                  width={400}
                  height={120}
                  className="w-full"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={checkoutMutation.isPending}
                className="flex-1"
              >
                Annulla
              </Button>
              <Button
                type="submit"
                disabled={checkoutMutation.isPending || !purpose.trim() || !signature}
                className="flex-1"
              >
                {checkoutMutation.isPending ? "Elaborazione..." : "Conferma Prelievo"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
