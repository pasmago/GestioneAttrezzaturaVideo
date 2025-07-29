import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Equipment } from '@shared/schema';
import { Search, Eye, Edit, LogOut, LogIn } from 'lucide-react';
import { EquipmentCheckoutModal } from './equipment-checkout-modal';
import { EquipmentCheckinModal } from './equipment-checkin-modal';

interface EquipmentTableProps {
  equipment: Equipment[];
  onSearch: (query: string, category?: string) => void;
}

export function EquipmentTable({ equipment, onSearch }: EquipmentTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [checkoutEquipment, setCheckoutEquipment] = useState<Equipment | null>(null);
  const [checkinEquipment, setCheckinEquipment] = useState<Equipment | null>(null);

  const categories = Array.from(new Set(equipment.map(item => item.category)));

  const handleSearch = (query: string, category?: string) => {
    setSearchQuery(query);
    onSearch(query, category);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    onSearch(searchQuery, category === 'all' ? undefined : category);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Disponibile</Badge>;
      case 'in_use':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">In Uso</Badge>;
      case 'maintenance':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Manutenzione</Badge>;
      case 'damaged':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Danneggiata</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Inventario Attrezzature</h3>
          <div className="mt-3 sm:mt-0 flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Cerca attrezzatura..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value, selectedCategory || undefined)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tutte le categorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutte le categorie</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Attrezzatura</TableHead>
              <TableHead>Stato</TableHead>
              <TableHead>Utilizzatore</TableHead>
              <TableHead>Ore Totali</TableHead>
              <TableHead>Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {equipment.map((item) => (
              <TableRow key={item.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="flex items-center space-x-4">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-12 rounded-lg object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-16 h-12 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                        <span className="text-xs text-gray-400">No img</span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">SN: {item.code}</p>
                      <p className="text-xs text-gray-400">{item.category}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(item.status)}
                </TableCell>
                <TableCell>
                  {item.currentUserId ? (
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                          {getUserInitials("Current User")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-900">Utente Corrente</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-900">{item.totalUsageHours || 0}h</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {item.status === 'available' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCheckoutEquipment(item)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    )}
                    {item.status === 'in_use' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCheckinEquipment(item)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <LogIn className="h-4 w-4" />
                      </Button>
                    )}
                    {item.status === 'maintenance' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled
                        className="text-gray-300 cursor-not-allowed"
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Mostrando <strong>1-{equipment.length}</strong> di <strong>{equipment.length}</strong> attrezzature
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            Precedente
          </Button>
          <Button size="sm">1</Button>
          <Button variant="outline" size="sm" disabled>
            Successivo
          </Button>
        </div>
      </div>

      {/* Modals */}
      <EquipmentCheckoutModal
        equipment={checkoutEquipment}
        isOpen={!!checkoutEquipment}
        onClose={() => setCheckoutEquipment(null)}
      />
      <EquipmentCheckinModal
        equipment={checkinEquipment}
        isOpen={!!checkinEquipment}
        onClose={() => setCheckinEquipment(null)}
      />
    </div>
  );
}
