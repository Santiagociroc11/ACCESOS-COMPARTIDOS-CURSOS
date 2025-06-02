import React, { useState, useRef, useEffect } from 'react';
import { Account } from '../types';
import { useCategories } from '../hooks/useCategories';
import { Tag, Plus, Check, Hash, TrendingUp } from 'lucide-react';

interface CategoryInputProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  accounts: Account[];
  className?: string;
}

export function CategoryInput({ selectedCategory, onCategoryChange, accounts, className = '' }: CategoryInputProps) {
  const { existingCategories, getCategoryStats, getMostUsedCategories } = useCategories(accounts);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const mostUsed = getMostUsedCategories(3);
  const isExistingCategory = existingCategories.includes(selectedCategory);

  useEffect(() => {
    if (isCreatingNew && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCreatingNew]);

  const handleCreateNew = () => {
    if (newCategoryName.trim()) {
      onCategoryChange(newCategoryName.trim().toLowerCase());
      setNewCategoryName('');
      setIsCreatingNew(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateNew();
    } else if (e.key === 'Escape') {
      setIsCreatingNew(false);
      setNewCategoryName('');
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        <Tag className="w-4 h-4 inline mr-2" />
        Categoría
      </label>

      {/* Input principal */}
      <div className="relative">
        <div 
          className="w-full p-3 border-2 border-gray-300 rounded-xl bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all cursor-pointer"
          onClick={() => setShowSuggestions(!showSuggestions)}
        >
          <div className="flex items-center justify-between">
            <span className={`${selectedCategory ? 'text-gray-900' : 'text-gray-500'}`}>
              {selectedCategory || 'Seleccionar categoría...'}
            </span>
            <div className="flex items-center gap-2">
              {selectedCategory && isExistingCategory && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  {getCategoryStats(selectedCategory)} cuenta{getCategoryStats(selectedCategory) !== 1 ? 's' : ''}
                </span>
              )}
              <Hash className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Dropdown de sugerencias */}
        {showSuggestions && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
            
            {/* Más usadas */}
            {mostUsed.length > 0 && (
              <div className="p-3 border-b border-gray-100">
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Más usadas
                </h4>
                <div className="space-y-1">
                  {mostUsed.map((category) => (
                    <button
                      key={category.name}
                      type="button"
                      onClick={() => {
                        onCategoryChange(category.name);
                        setShowSuggestions(false);
                      }}
                      className={`
                        w-full text-left p-2 rounded-lg transition-colors flex items-center justify-between
                        ${selectedCategory === category.name 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'hover:bg-gray-50 text-gray-700'
                        }
                      `}
                    >
                      <span className="capitalize">{category.name}</span>
                      <span className="text-xs text-gray-500">
                        {category.count} cuenta{category.count !== 1 ? 's' : ''}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Todas las categorías existentes */}
            {existingCategories.length > 0 && (
              <div className="p-3">
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  Todas las categorías ({existingCategories.length})
                </h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {existingCategories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => {
                        onCategoryChange(category);
                        setShowSuggestions(false);
                      }}
                      className={`
                        w-full text-left p-2 rounded-lg transition-colors flex items-center justify-between
                        ${selectedCategory === category 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'hover:bg-gray-50 text-gray-700'
                        }
                      `}
                    >
                      <span className="capitalize">{category}</span>
                      <span className="text-xs text-gray-500">
                        {getCategoryStats(category)} cuenta{getCategoryStats(category) !== 1 ? 's' : ''}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Crear nueva categoría */}
            <div className="p-3 border-t border-gray-100">
              {!isCreatingNew ? (
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(true)}
                  className="w-full p-2 text-left text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Crear nueva categoría
                </button>
              ) : (
                <div className="space-y-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Nombre de la nueva categoría..."
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleCreateNew}
                      disabled={!newCategoryName.trim()}
                      className="flex-1 bg-blue-600 text-white py-1.5 px-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center justify-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      Crear
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingNew(false);
                        setNewCategoryName('');
                      }}
                      className="px-3 py-1.5 text-gray-600 hover:text-gray-700 text-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Información de la categoría seleccionada */}
      {selectedCategory && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-blue-700 capitalize">
                {selectedCategory}
              </span>
              {isExistingCategory && (
                <span className="text-xs text-blue-600 ml-2">
                  ({getCategoryStats(selectedCategory)} cuenta{getCategoryStats(selectedCategory) !== 1 ? 's' : ''} existente{getCategoryStats(selectedCategory) !== 1 ? 's' : ''})
                </span>
              )}
              {!isExistingCategory && (
                <span className="text-xs text-green-600 ml-2">
                  (Nueva categoría)
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 