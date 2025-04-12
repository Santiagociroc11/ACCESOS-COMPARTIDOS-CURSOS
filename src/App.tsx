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
    requiresDynamicPin: false
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
        requiresDynamicPin: false
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
    <div className="min-h-screen bg-gray-50">
      <Header onAddAccount={() => setShowAddModal(true)} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {accountsError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {accountsError}
          </div>
        )}

        {accountsLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Cargando cuentas...</p>
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
              requiresDynamicPin: false
            });
          }}
          onSave={editingAccount ? handleEditAccount : handleAddAccount}
          account={newAccount}
          setAccount={setNewAccount}
          isEditing={!!editingAccount}
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