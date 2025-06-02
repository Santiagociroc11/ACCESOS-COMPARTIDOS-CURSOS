import React, { useState } from 'react';
import { Account } from './types';
import { LoginForm } from './components/LoginForm';
import { Header } from './components/Header';
import { AccountList } from './components/AccountList';
import { AddAccountModal } from './components/AddAccountModal';
import { PinModal } from './components/PinModal';
import { useAuth } from './hooks/useAuth';
import { useAccounts } from './hooks/useAccounts';
import { usePin } from './hooks/usePin';

function App() {
  const { isAuthenticated, login, logout } = useAuth();
  const { accounts, loading: accountsLoading, error: accountsError, addAccount, updateAccount, deleteAccount } = useAccounts(isAuthenticated);
  const { pinData, loading: pinLoading, error: pinError, fetchPin } = usePin();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [newAccount, setNewAccount] = useState<Partial<Account>>({
    name: "",
    url: "",
    username: "",
    password: "",
    requiresDynamicPin: false,
    category: ""
  });

  const handleLogin = (password: string) => {
    if (!login(password)) {
      alert("Contraseña incorrecta");
    }
  };

  const handleLogout = () => {
    logout();
    setShowPinModal(false);
  };

  const handleAddAccount = async () => {
    if (!newAccount.name || !newAccount.url || !newAccount.username || !newAccount.password) {
      alert("Por favor complete todos los campos");
      return;
    }

    const success = await addAccount(newAccount);
    if (success) {
      setShowAddModal(false);
      setNewAccount({
        name: "",
        url: "",
        username: "",
        password: "",
        requiresDynamicPin: false,
        category: ""
      });
    }
  };

  const handleEditAccount = async (account: Account) => {
    const success = await updateAccount(account);
    if (success) {
      setShowAddModal(false);
      setEditingAccount(null);
    }
  };

  const handleDeleteAccount = async (id: string) => {
    if (!confirm('¿Está seguro de que desea eliminar esta cuenta?')) {
      return;
    }
    await deleteAccount(id);
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-indigo-50/30">
      <Header onAddAccount={() => setShowAddModal(true)} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {accountsError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 shadow-sm animate-slide-in-from-top">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {accountsError}
            </div>
          </div>
        )}

        {accountsLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 font-medium">Cargando cuentas...</p>
          </div>
        ) : (
          <AccountList
            accounts={accounts}
            onPinRequest={() => setShowPinModal(true)}
            onEdit={(account) => {
              setEditingAccount(account);
              setNewAccount(account);
              setShowAddModal(true);
            }}
            onDelete={handleDeleteAccount}
            copiedField={copiedField}
            onCopy={copyToClipboard}
          />
        )}
      </main>

      {showAddModal && (
        <AddAccountModal
          onClose={() => {
            setShowAddModal(false);
            setEditingAccount(null);
            setNewAccount({
              name: "",
              url: "",
              username: "",
              password: "",
              requiresDynamicPin: false,
              category: ""
            });
          }}
          onSave={editingAccount ? handleEditAccount : handleAddAccount}
          account={newAccount}
          setAccount={setNewAccount}
          isEditing={!!editingAccount}
          accounts={accounts}
        />
      )}

      {showPinModal && (
        <PinModal
          onClose={() => setShowPinModal(false)}
          onFetchPin={fetchPin}
          pinData={pinData}
          loading={pinLoading}
        />
      )}
    </div>
  );
}

export default App;