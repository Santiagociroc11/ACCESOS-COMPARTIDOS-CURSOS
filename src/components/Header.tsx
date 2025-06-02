import React, { useState } from 'react';
import { Plus, LogOut, Shield, Menu, X } from 'lucide-react';

interface HeaderProps {
  onAddAccount: () => void;
  onLogout: () => void;
}

export function Header({ onAddAccount, onLogout }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-40 glass-effect">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo y título */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-xl shadow-lg">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Gestor de Accesos
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">by AutomSCC</p>
            </div>
          </div>

          {/* Botones Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={onAddAccount}
              className="button-primary py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-4 h-4" /> 
              <span className="hidden lg:inline">Agregar Cuenta</span>
              <span className="lg:hidden">Agregar</span>
            </button>
            <button
              onClick={onLogout}
              className="button-secondary py-2.5 px-4 rounded-xl flex items-center gap-2 border border-gray-200 hover:border-gray-300 transition-all duration-300"
            >
              <LogOut className="w-4 h-4" /> 
              <span className="hidden lg:inline">Cerrar Sesión</span>
            </button>
          </div>

          {/* Botón Mobile Menu */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-100 animate-in slide-in-from-top duration-200">
            <div className="flex flex-col space-y-3 pt-4">
              <button
                onClick={() => {
                  onAddAccount();
                  setIsMenuOpen(false);
                }}
                className="button-primary py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg"
              >
                <Plus className="w-5 h-5" /> Agregar Cuenta
              </button>
              <button
                onClick={() => {
                  onLogout();
                  setIsMenuOpen(false);
                }}
                className="button-secondary py-3 px-4 rounded-xl flex items-center justify-center gap-2 border border-gray-200"
              >
                <LogOut className="w-5 h-5" /> Cerrar Sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}