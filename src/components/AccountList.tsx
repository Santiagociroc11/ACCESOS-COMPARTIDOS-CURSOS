import React, { useState, useMemo } from 'react';
import { Account } from '../types';
import { AccountCard } from './AccountCard';
import { useCategories } from '../hooks/useCategories';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { ExternalLink, Copy, Check, Key, Pencil, Trash2, Lock, Shield, Plus, Search, Hash, X } from 'lucide-react';

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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { existingCategories, getCategoryStats, getMostUsedCategories } = useCategories(accounts);

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

  // Filter accounts based on category and search term
  const filteredAccounts = useMemo(() => {
    let filtered = accounts;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(account => account.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(account =>
        account.name.toLowerCase().includes(searchLower) ||
        account.url.toLowerCase().includes(searchLower) ||
        account.username.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [accounts, selectedCategory, searchTerm]);

  // Get statistics
  const stats = useMemo(() => {
    const totalAccounts = accounts.length;
    const accountsWithPin = accounts.filter(account => account.requiresDynamicPin).length;
    const categoriesUsed = new Set(accounts.map(account => account.category || '').filter(cat => cat.trim() !== '')).size;
    
    return {
      total: totalAccounts,
      withPin: accountsWithPin,
      categories: categoriesUsed,
      filtered: filteredAccounts.length
    };
  }, [accounts, filteredAccounts]);

  const getCategoryColor = (category: string) => {
    // Generar colores consistentes basados en el hash del nombre
    const hash = category.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    const colors = [
      { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', hover: 'hover:bg-blue-200' },
      { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', hover: 'hover:bg-green-200' },
      { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200', hover: 'hover:bg-purple-200' },
      { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-200', hover: 'hover:bg-pink-200' },
      { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200', hover: 'hover:bg-indigo-200' },
      { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', hover: 'hover:bg-orange-200' },
      { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-200', hover: 'hover:bg-teal-200' },
      { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', hover: 'hover:bg-red-200' },
    ];
    
    return colors[Math.abs(hash) % colors.length];
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
              Mis Cuentas
            </h2>
            <p className="text-gray-600">
              {stats.filtered === stats.total 
                ? `${stats.total} cuenta${stats.total !== 1 ? 's' : ''} guardada${stats.total !== 1 ? 's' : ''}`
                : `${stats.filtered} de ${stats.total} cuenta${stats.total !== 1 ? 's' : ''}`
              }
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              <Shield className="w-4 h-4 mr-1.5" />
              {stats.categories} categoría{stats.categories !== 1 ? 's' : ''}
            </span>
            {stats.withPin > 0 && (
              <span className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                <Key className="w-4 h-4 mr-1.5" />
                {stats.withPin} con PIN
              </span>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar cuentas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 input-focus"
          />
        </div>

        {/* Category Filters - Visible as chips */}
        {existingCategories.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Hash className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filtrar por categoría:</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {/* Todas las categorías */}
              <button
                onClick={() => setSelectedCategory(null)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                  ${selectedCategory === null 
                    ? 'bg-gray-800 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                  }
                `}
              >
                <span>Todas</span>
                <span className={`
                  text-xs px-1.5 py-0.5 rounded-full
                  ${selectedCategory === null 
                    ? 'bg-white/20 text-white' 
                    : 'bg-gray-200 text-gray-600'
                  }
                `}>
                  {stats.total}
                </span>
              </button>

              {/* Categorías existentes */}
              {existingCategories.map((category) => {
                const colors = getCategoryColor(category);
                const isSelected = selectedCategory === category;
                const count = getCategoryStats(category);
                
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`
                      flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border
                      ${isSelected 
                        ? `${colors.bg} ${colors.text} ${colors.border} shadow-md ring-2 ring-offset-1 ring-current/20` 
                        : `bg-white ${colors.text} ${colors.border} ${colors.hover}`
                      }
                    `}
                  >
                    <span className="capitalize">{category}</span>
                    <span className={`
                      text-xs px-1.5 py-0.5 rounded-full
                      ${isSelected 
                        ? 'bg-white/80 text-current' 
                        : 'bg-gray-100 text-gray-600'
                      }
                    `}>
                      {count}
                    </span>
                  </button>
                );
              })}

              {/* Clear filter button */}
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="flex items-center gap-1 px-2 py-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                  title="Limpiar filtro"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Accounts Grid */}
      <div>
        {filteredAccounts.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {filteredAccounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                onPinRequest={onPinRequest}
                onEdit={() => onEdit(account)}
                onDelete={() => onDelete(account.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No se encontraron cuentas
            </h3>
            <p className="text-gray-500 mb-4">
              Intenta cambiar los filtros o el término de búsqueda
            </p>
            {(selectedCategory || searchTerm) && (
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchTerm('');
                }}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}