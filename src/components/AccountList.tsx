import React from 'react';
import { Account } from '../types';
import { AccountCard } from './AccountCard';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { ExternalLink, Copy, Check, Key, Pencil, Trash2, Lock } from 'lucide-react';

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
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">No hay cuentas guardadas</h2>
        <p className="text-gray-500 mb-6">Comience agregando una nueva cuenta</p>
      </div>
    );
  }

  return (
    <>
      {/* Table view (desktop) */}
      <div className="hidden lg:block overflow-hidden bg-white rounded-xl shadow-sm border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                URL
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contraseña
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {accounts.map((account) => (
              <tr key={account.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium text-gray-900">{account.name}</div>
                    {account.requiresDynamicPin && (
                      <Lock className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <a
                    href={account.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    {getDisplayUrl(account.url)}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 flex items-center gap-2">
                    {account.username}
                    <button
                      onClick={() => onCopy(account.username, `username-${account.id}`)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {copiedField === `username-${account.id}` ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 flex items-center gap-2">
                    <code className="bg-gray-50 px-2 py-1 rounded">{account.password}</code>
                    <button
                      onClick={() => onCopy(account.password, `password-${account.id}`)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {copiedField === `password-${account.id}` ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center gap-2">
                    {account.requiresDynamicPin && (
                      <button
                        onClick={onPinRequest}
                        className="text-green-600 hover:text-green-700"
                        title="Obtener PIN"
                      >
                        <Key className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onEdit(account)}
                      className="text-blue-600 hover:text-blue-700"
                      title="Editar cuenta"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(account.id)}
                      className="text-red-600 hover:text-red-700"
                      title="Eliminar cuenta"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card view (mobile) */}
      <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6">
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
    </>
  );
}