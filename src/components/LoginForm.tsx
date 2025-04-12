import React, { useState } from 'react';
import { Lock, Shield } from 'lucide-react';

interface LoginFormProps {
  onLogin: (password: string) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 flex items-center justify-center p-4">
      <div className="glass-effect p-8 rounded-2xl shadow-2xl max-w-md w-full">
        <div className="flex justify-center mb-8">
          <div className="bg-blue-100/80 p-6 rounded-full shadow-inner">
            <Shield className="w-20 h-20 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Gestor de Accesos
        </h1>
        <p className="text-center text-gray-600 mb-8">Ingrese sus credenciales para continuar</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña Maestra</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 input-focus"
                placeholder="••••••••"
              />
              <Lock className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <button
            type="submit"
            className="w-full button-primary py-3 px-4 rounded-lg font-medium text-lg"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}