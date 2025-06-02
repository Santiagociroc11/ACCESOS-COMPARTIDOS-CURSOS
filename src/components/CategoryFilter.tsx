import React from 'react';
import { Account } from '../types';
import { useCategories } from '../hooks/useCategories';
import { Filter, X, Grid3X3, Hash, TrendingUp } from 'lucide-react';

interface CategoryFilterProps {
  accounts: Account[];
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}

export function CategoryFilter({ accounts, selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const { existingCategories, getCategoryStats, getMostUsedCategories } = useCategories(accounts);
  
  const getTotalCount = () => {
    return accounts.length;
  };

  const mostUsed = getMostUsedCategories(5);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-600" />
          Filtrar por Categoría
        </h3>
        {selectedCategory && (
          <button
            onClick={() => onCategoryChange(null)}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            Limpiar
          </button>
        )}
      </div>

      <div className="space-y-2">
        {/* Todas las categorías */}
        <button
          onClick={() => onCategoryChange(null)}
          className={`
            w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group
            ${selectedCategory === null 
              ? 'bg-blue-100 text-blue-700 border-2 border-blue-200 shadow-sm' 
              : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100 hover:border-gray-200'
            }
          `}
        >
          <div className="flex items-center gap-3">
            <div className={`
              p-2 rounded-lg transition-colors
              ${selectedCategory === null ? 'bg-white/80' : 'bg-white group-hover:bg-white'}
            `}>
              <Grid3X3 className="w-4 h-4" />
            </div>
            <span className="font-medium">Todas las categorías</span>
          </div>
          <span className={`
            px-2.5 py-1 rounded-full text-xs font-semibold
            ${selectedCategory === null 
              ? 'bg-blue-200 text-blue-800' 
              : 'bg-white text-gray-600 group-hover:bg-gray-200'
            }
          `}>
            {getTotalCount()}
          </span>
        </button>

        {/* Más usadas */}
        {mostUsed.length > 0 && (
          <>
            <div className="pt-2 pb-1">
              <h4 className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Más usadas
              </h4>
            </div>
            {mostUsed.map((category) => (
              <button
                key={category.name}
                onClick={() => onCategoryChange(category.name)}
                className={`
                  w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group
                  ${selectedCategory === category.name 
                    ? 'bg-green-100 text-green-700 border-2 border-green-200 shadow-sm' 
                    : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100 hover:border-gray-200'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    p-2 rounded-lg transition-colors
                    ${selectedCategory === category.name ? 'bg-white/80' : 'bg-white group-hover:bg-white'}
                  `}>
                    <Hash className="w-4 h-4" />
                  </div>
                  <span className="font-medium capitalize">{category.name}</span>
                </div>
                <span className={`
                  px-2.5 py-1 rounded-full text-xs font-semibold
                  ${selectedCategory === category.name 
                    ? 'bg-white/80 text-current' 
                    : 'bg-white text-gray-600 group-hover:bg-gray-200'
                  }
                `}>
                  {category.count}
                </span>
              </button>
            ))}
          </>
        )}

        {/* Otras categorías */}
        {existingCategories.filter(cat => !mostUsed.some(mu => mu.name === cat)).length > 0 && (
          <>
            <div className="pt-2 pb-1">
              <h4 className="text-xs font-semibold text-gray-500 uppercase">
                Otras categorías
              </h4>
            </div>
            {existingCategories
              .filter(category => !mostUsed.some(mu => mu.name === category))
              .map((category) => (
                <button
                  key={category}
                  onClick={() => onCategoryChange(category)}
                  className={`
                    w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group
                    ${selectedCategory === category 
                      ? 'bg-purple-100 text-purple-700 border-2 border-purple-200 shadow-sm' 
                      : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100 hover:border-gray-200'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      p-2 rounded-lg transition-colors
                      ${selectedCategory === category ? 'bg-white/80' : 'bg-white group-hover:bg-white'}
                    `}>
                      <Hash className="w-4 h-4" />
                    </div>
                    <span className="font-medium capitalize">{category}</span>
                  </div>
                  <span className={`
                    px-2.5 py-1 rounded-full text-xs font-semibold
                    ${selectedCategory === category 
                      ? 'bg-white/80 text-current' 
                      : 'bg-white text-gray-600 group-hover:bg-gray-200'
                    }
                  `}>
                    {getCategoryStats(category)}
                  </span>
                </button>
              ))}
          </>
        )}
      </div>

      {existingCategories.length === 0 && (
        <div className="text-center py-6">
          <Hash className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">
            No hay categorías creadas aún
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Las categorías aparecerán cuando agregues cuentas
          </p>
        </div>
      )}
    </div>
  );
} 