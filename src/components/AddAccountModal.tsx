import React from 'react';
import { Account } from '../types';
import { X } from 'lucide-react';
import { CategoryInput } from './CategoryInput';

interface AddAccountModalProps {
  onClose: () => void;
  onSave: (account: Account | Partial<Account>) => void;
  account: Partial<Account>;
  setAccount: (account: Partial<Account>) => void;
  isEditing?: boolean;
  accounts: Account[]; // Para obtener categorías existentes
}

export function AddAccountModal({ onClose, onSave, account, setAccount, isEditing, accounts }: AddAccountModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Editar Cuenta' : 'Agregar Nueva Cuenta'}
            </h2>
            <button 
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Category Selection - Dinámico */}
          <CategoryInput
            selectedCategory={account.category || ''}
            onCategoryChange={(category) => setAccount({ ...account, category })}
            accounts={accounts}
          />

          {/* Basic Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre de la cuenta</label>
              <input
                type="text"
                value={account.name || ''}
                onChange={(e) => setAccount({ ...account, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 input-focus"
                placeholder="Ej: Netflix, Gmail, GitHub..."
              />
            </div>
            
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">URL del sitio web</label>
              <input
                type="url"
                value={account.url || ''}
                onChange={(e) => setAccount({ ...account, url: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 input-focus"
                placeholder="https://ejemplo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Usuario o Email</label>
              <input
                type="text"
                value={account.username || ''}
                onChange={(e) => setAccount({ ...account, username: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 input-focus"
                placeholder="usuario@ejemplo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Contraseña</label>
              <input
                type="password"
                value={account.password || ''}
                onChange={(e) => setAccount({ ...account, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 input-focus"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Options */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="requiresPin"
                checked={account.requiresDynamicPin || false}
                onChange={(e) => setAccount({ ...account, requiresDynamicPin: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
              />
              <label htmlFor="requiresPin" className="ml-3 flex flex-col">
                <span className="text-sm font-medium text-gray-900">Requiere PIN Dinámico</span>
                <span className="text-xs text-gray-600">Esta cuenta necesita un código de verificación adicional</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-100 p-6 rounded-b-2xl">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="button-secondary px-6 py-3 rounded-xl font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={() => onSave(account)}
              className="button-primary px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl"
            >
              {isEditing ? 'Guardar Cambios' : 'Crear Cuenta'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}