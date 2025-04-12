import React from 'react';
import { Account } from '../types';
import { X } from 'lucide-react';

interface AddAccountModalProps {
  onClose: () => void;
  onSave: (account: Account | Partial<Account>) => void;
  account: Partial<Account>;
  setAccount: (account: Partial<Account>) => void;
  isEditing?: boolean;
}

export function AddAccountModal({ onClose, onSave, account, setAccount, isEditing }: AddAccountModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditing ? 'Editar Cuenta' : 'Agregar Nueva Cuenta'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              value={account.name}
              onChange={(e) => setAccount({ ...account, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 input-focus"
              placeholder="Nombre de la cuenta"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
            <input
              type="text"
              value={account.url}
              onChange={(e) => setAccount({ ...account, url: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 input-focus"
              placeholder="https://ejemplo.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
            <input
              type="text"
              value={account.username}
              onChange={(e) => setAccount({ ...account, username: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 input-focus"
              placeholder="usuario@ejemplo.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              value={account.password}
              onChange={(e) => setAccount({ ...account, password: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 input-focus"
              placeholder="••••••••"
            />
          </div>
          <div className="flex items-center bg-gray-50 p-3 rounded-lg">
            <input
              type="checkbox"
              id="requiresPin"
              checked={account.requiresDynamicPin}
              onChange={(e) => setAccount({ ...account, requiresDynamicPin: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="requiresPin" className="ml-2 text-sm text-gray-700">
              Requiere PIN Dinámico
            </label>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="button-secondary px-4 py-2 rounded-lg"
            >
              Cancelar
            </button>
            <button
              onClick={() => onSave(account)}
              className="button-primary px-4 py-2 rounded-lg"
            >
              {isEditing ? 'Guardar Cambios' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}