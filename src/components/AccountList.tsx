import React from 'react';
import { Account } from '../types';
import { AccountCard } from './AccountCard';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { ExternalLink, Copy, Check, Key, Pencil, Trash2, Lock, Shield, Plus } from 'lucide-react';

interface AccountListProps {
  accounts: Account[];
  onPinRequest: () => void;
  onEdit: (account: Account) => void;
  onDelete: (id: string) => void;
  copiedField: string | null;
  onCopy: (text: string, field: string) => void;
}

export function AccountList({
  accounts,
  onPinRequest,
  onEdit,
  onDelete,
  copiedField,
  onCopy,
}: AccountListProps) {
  const getDisplayUrl = (url: string): string => {
    try {
      const urlObject = new URL(url);
      return urlObject.hostname.replace('www.', '');
    } catch (error) {
      return url;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'Fecha no disponible';
      const date = parseISO(dateString);
      return format(date, "dd MMM yyyy", { locale: es });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Fecha no válida';
    }
  };

  if (accounts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-3xl shadow-lg mb-6">
          <Shield className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
              ¡Bienvenido a tu Gestor!
            </h2>
            <p className="text-gray-600 mb-6 max-w-md">
              Comienza agregando tu primera cuenta para gestionar tus accesos de forma segura
            </p>
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
              <div className="flex items-center text-sm text-gray-500">
                <Lock className="w-4 h-4 mr-2" />
                Datos seguros y encriptados
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Key className="w-4 h-4 mr-2" />
                Soporte para PIN dinámico
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-gray-400 text-sm">
          <Plus className="w-5 h-5 inline mr-2" />
          Haz clic en "Agregar Cuenta" para empezar
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
              Mis Cuentas
            </h2>
            <p className="text-gray-600">
              {accounts.length} cuenta{accounts.length !== 1 ? 's' : ''} guardada{accounts.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {accounts.some(account => account.requiresDynamicPin) && (
              <span className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                <Key className="w-4 h-4 mr-1.5" />
                {accounts.filter(account => account.requiresDynamicPin).length} con PIN
              </span>
            )}
            <span className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              <Shield className="w-4 h-4 mr-1.5" />
              Seguras
            </span>
          </div>
        </div>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {accounts.map((account) => (
          <AccountCard
            key={account.id}
            account={account}
            onPinRequest={onPinRequest}
            onEdit={() => onEdit(account)}
            onDelete={() => onDelete(account.id)}
          />
        ))}
      </div>
    </div>
  );
}