import { useMemo } from 'react';
import { Account } from '../types';

export function useCategories(accounts: Account[]) {
  const existingCategories = useMemo(() => {
    // Obtener categorías únicas de las cuentas existentes
    const categories = new Set(
      accounts
        .map(account => account.category)
        .filter(category => category && category.trim() !== '')
    );
    
    return Array.from(categories).sort();
  }, [accounts]);

  const getCategoryStats = (categoryName: string) => {
    return accounts.filter(account => account.category === categoryName).length;
  };

  const getMostUsedCategories = (limit: number = 5) => {
    const categoryCount = existingCategories.map(category => ({
      name: category,
      count: getCategoryStats(category)
    }));

    return categoryCount
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  };

  return {
    existingCategories,
    getCategoryStats,
    getMostUsedCategories
  };
} 