import React from 'react';
import { ExternalLink, Key, Calendar, Copy, Check, Pencil, Trash2, Lock, Globe, User } from 'lucide-react';
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
      return 'URL inválida';
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
    <div className="bg-white rounded-2xl shadow-sm card-hover overflow-hidden border border-gray-100 hover:border-blue-100 transition-all duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-6 border-b border-gray-100">
        {/* Actions moved to top-right corner */}
        <div className="flex justify-end gap-2 mb-3">
          <button
            onClick={onEdit}
            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
            title="Editar cuenta"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
            title="Eliminar cuenta"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Title and content */}
        <div className="flex items-start gap-3">
          <div className="bg-white p-2 rounded-lg shadow-sm flex-shrink-0">
            <Globe className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            {/* Full title - no truncation */}
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 leading-tight">
              {account.name}
            </h3>
            
            {/* Tags and badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                {getDisplayUrl(account.url)}
              </span>
              {account.requiresDynamicPin && (
                <span className="inline-flex items-center px-2.5 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  <Lock className="w-3 h-3 mr-1" />
                  PIN Dinámico
                </span>
              )}
            </div>
            
            {/* Date */}
            <div className="flex items-center text-xs text-gray-500 gap-1">
              <Calendar className="w-3 h-3" />
              <span>Creado {formatDate(account.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 space-y-4">
        {/* URL */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Globe className="w-4 h-4 inline mr-2" />
            Sitio Web
          </label>
          <a 
            href={account.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl border border-transparent hover:border-blue-200 transition-all duration-200 group"
          >
            <span className="text-blue-600 font-medium truncate mr-2 group-hover:text-blue-700">
              {account.url}
            </span>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 flex-shrink-0" />
          </a>
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Usuario
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 p-3 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-gray-900 font-mono text-sm break-all">{account.username}</p>
            </div>
            <button
              onClick={() => copyToClipboard(account.username, `username-${account.id}`)}
              className="p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 flex-shrink-0"
              title="Copiar usuario"
            >
              {copiedField === `username-${account.id}` ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Lock className="w-4 h-4 inline mr-2" />
            Contraseña
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <p className="text-gray-900 font-mono text-sm break-all tracking-wider">{account.password}</p>
            </div>
            <button
              onClick={() => copyToClipboard(account.password, `password-${account.id}`)}
              className="p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 flex-shrink-0"
              title="Copiar contraseña"
            >
              {copiedField === `password-${account.id}` ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* PIN Button */}
        {account.requiresDynamicPin && (
          <button
            onClick={onPinRequest}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-xl 
                     hover:from-green-600 hover:to-emerald-700 transition-all duration-300 
                     flex items-center justify-center gap-3 shadow-lg hover:shadow-xl
                     transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Key className="w-5 h-5" /> 
            <span className="font-semibold">Obtener PIN Dinámico</span>
          </button>
        )}
      </div>
    </div>
  );
}