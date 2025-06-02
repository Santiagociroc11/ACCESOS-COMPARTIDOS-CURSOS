import { useState, useEffect } from 'react';
import { Account } from '../types';
import { postgrest } from '../lib/postgrest';

export function useAccounts(isAuthenticated: boolean) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAccounts();
    } else {
      setAccounts([]);
    }
  }, [isAuthenticated]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: postgrestError } = await postgrest
        .from('accounts')
        .select('*')
        .order('created_at', { ascending: false })
        .execute();

      if (postgrestError) {
        throw new Error(postgrestError.message);
      }

      // Transform the data to match our Account type
      const transformedAccounts = (data || []).map((account: any) => ({
        id: account.id,
        name: account.name,
        url: account.url,
        username: account.username,
        password: account.password,
        requiresDynamicPin: account.requires_dynamic_pin,
        createdAt: account.created_at
      }));

      setAccounts(transformedAccounts);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      setError('Error al cargar las cuentas');
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  const addAccount = async (newAccount: Partial<Account>) => {
    try {
      setLoading(true);
      setError(null);

      const { error: postgrestError } = await postgrest
        .from('accounts')
        .insert([{
          name: newAccount.name,
          url: newAccount.url,
          username: newAccount.username,
          password: newAccount.password,
          requires_dynamic_pin: newAccount.requiresDynamicPin
        }])
        .execute();

      if (postgrestError) {
        throw new Error(postgrestError.message);
      }

      await fetchAccounts();
      return true;
    } catch (error) {
      console.error('Error adding account:', error);
      setError('Error al guardar la cuenta');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateAccount = async (account: Account) => {
    try {
      setLoading(true);
      setError(null);

      const { error: postgrestError } = await postgrest
        .from('accounts')
        .update({
          name: account.name,
          url: account.url,
          username: account.username,
          password: account.password,
          requires_dynamic_pin: account.requiresDynamicPin
        })
        .eq('id', account.id)
        .execute();

      if (postgrestError) {
        throw new Error(postgrestError.message);
      }

      await fetchAccounts();
      return true;
    } catch (error) {
      console.error('Error updating account:', error);
      setError('Error al actualizar la cuenta');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error: postgrestError } = await postgrest
        .from('accounts')
        .delete()
        .eq('id', id)
        .execute();

      if (postgrestError) {
        throw new Error(postgrestError.message);
      }

      await fetchAccounts();
      return true;
    } catch (error) {
      console.error('Error deleting account:', error);
      setError('Error al eliminar la cuenta');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    accounts,
    loading,
    error,
    addAccount,
    updateAccount,
    deleteAccount,
  };
}