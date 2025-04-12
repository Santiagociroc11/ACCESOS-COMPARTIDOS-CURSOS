import React from 'react';
import { ExternalLink, Key, Calendar, Copy, Check, Pencil, Trash2, Lock } from 'lucide-react';
import { Account } from '../types';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface AccountCardProps {
  account: Account;
  onPinRequest: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function AccountCard({ account, onPinRequest, onEdit, onDelete }: AccountCardProps) {
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getDisplayUrl = (url: string): string => {
    try {
      const urlObject = new URL(url);
      return urlObject.hostname.replace('www.', '');
    } catch (error) {
      return 'Invalid URL';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, "dd MMM yyyy", { locale: es });
    } catch (error) {
      return 'Fecha no válida';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm card-hover overflow-hidden border border-gray-100">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            {account.name}
            {account.requiresDynamicPin && (
              <Lock className="w-4 h-4 text-blue-500" />
            )}
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
              {getDisplayUrl(account.url)}
            </span>
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="text-blue-600 hover:text-blue-700 p-1"
              title="Editar cuenta"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="text-red-600 hover:text-red-700 p-1"
              title="Eliminar cuenta"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="text-xs text-gray-500 flex items-center gap-1 mb-4">
          <Calendar className="w-3 h-3" />
          {formatDate(account.createdAt)}
        </div>
        <div className="space-y-4">
          <div className="group">
            <label className="text-sm font-medium text-gray-600">URL</label>
            <a 
              href={account.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:text-blue-700 mt-1 flex items-center gap-1 group-hover:underline"
            >
              {account.url} <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Usuario</label>
            <div className="mt-1 flex items-center gap-2">
              <p className="text-gray-800">{account.username}</p>
              <button
                onClick={() => copyToClipboard(account.username, `username-${account.id}`)}
                className="text-gray-400 hover:text-gray-600"
                title="Copiar usuario"
              >
                {copiedField === `username-${account.id}` ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Contraseña</label>
            <div className="mt-1 flex items-center gap-2">
              <p className="font-mono bg-gray-50 py-1.5 px-3 rounded-md flex-1">{account.password}</p>
              <button
                onClick={() => copyToClipboard(account.password, `password-${account.id}`)}
                className="text-gray-400 hover:text-gray-600"
                title="Copiar contraseña"
              >
                {copiedField === `password-${account.id}` ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          {account.requiresDynamicPin && (
            <button
              onClick={onPinRequest}
              className="mt-4 w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-2 px-4 rounded-lg 
                       hover:from-green-700 hover:to-green-800 transition duration-200 
                       flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
            >
              <Key className="w-4 h-4" /> Obtener PIN Dinámico
            </button>
          )}
        </div>
      </div>
    </div>
  );
}