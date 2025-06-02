import React from 'react';
import { PREDEFINED_CATEGORIES, Category } from '../types';
import * as Icons from 'lucide-react';

interface CategorySelectorProps {
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  className?: string;
}

export function CategorySelector({ selectedCategory, onCategoryChange, className = '' }: CategorySelectorProps) {
  const getIcon = (iconName: string) => {
    const IconComponent = Icons[iconName as keyof typeof Icons] as React.ElementType;
    return IconComponent ? <IconComponent className="w-5 h-5" /> : <Icons.Tag className="w-5 h-5" />;
  };

  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        <Icons.Tag className="w-4 h-4 inline mr-2" />
        Categoría
      </label>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {PREDEFINED_CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category.id;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onCategoryChange(category.id)}
              className={`
                group relative p-3 rounded-xl border-2 transition-all duration-200
                hover:shadow-md hover:scale-105 transform
                ${isSelected 
                  ? `${category.bgColor} ${category.color} border-current shadow-lg scale-105` 
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                }
              `}
              title={category.description}
            >
              <div className="flex flex-col items-center gap-1.5">
                <div className={`
                  p-2 rounded-lg transition-colors duration-200
                  ${isSelected 
                    ? 'bg-white/80' 
                    : 'bg-gray-50 group-hover:bg-gray-100'
                  }
                `}>
                  {getIcon(category.icon)}
                </div>
                <span className="text-xs font-medium text-center leading-tight">
                  {category.name}
                </span>
              </div>

              {isSelected && (
                <div className="absolute -top-1 -right-1">
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <Icons.Check className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      {selectedCategory && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700">
            <Icons.Info className="w-4 h-4 inline mr-1" />
            {PREDEFINED_CATEGORIES.find(c => c.id === selectedCategory)?.description}
          </p>
        </div>
      )}
    </div>
  );
} 