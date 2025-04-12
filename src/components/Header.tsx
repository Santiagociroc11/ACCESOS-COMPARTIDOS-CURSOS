import React from 'react';
import { Plus, LogOut, Shield } from 'lucide-react';

interface HeaderProps {
  onAddAccount: () => void;
  onLogout: () => void;
}

export function Header({ onAddAccount, onLogout }: HeaderProps) {
  return (
    <header className="bg-white shadow-md sticky top-0 z-40 glass-effect">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100/50 p-2 rounded-lg">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Gestor de Accesos - by AutomSCC
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={onAddAccount}
              className="button-primary py-2 px-4 rounded-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Agregar Cuenta
            </button>
            <button
              onClick={onLogout}
              className="button-secondary py-2 px-4 rounded-lg flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}