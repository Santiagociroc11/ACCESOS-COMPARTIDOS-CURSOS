import React from 'react';
import { Clock, X, AlertTriangle } from 'lucide-react';
import { PinResponse } from '../types';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface PinModalProps {
  onClose: () => void;
  onFetchPin: () => void;
  pinData: PinResponse | null;
  loading: boolean;
}

export function PinModal({ onClose, onFetchPin, pinData, loading }: PinModalProps) {
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return format(date, "dd/MM/yyyy HH:mm:ss", { locale: es });
  };

  const isPinExpired = (timestamp: number) => {
    const now = Date.now();
    return (now - timestamp) > 10 * 60 * 1000; // 10 minutes
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">PIN Dinámico</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="font-semibold text-blue-800 mb-2">Instrucciones</h3>
            <ol className="text-blue-900 space-y-2">
              <li className="flex items-center gap-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-sm font-medium">
                  1
                </span>
                Intente iniciar sesión en la plataforma
              </li>
              <li className="flex items-center gap-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-sm font-medium">
                  2
                </span>
                Cuando solicite el código, presione el botón "Obtener último código"
              </li>
            </ol>
          </div>
          
          {pinData && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600 mb-1">Código</p>
                <p className="text-4xl font-bold text-gray-800 font-mono tracking-wider">
                  {pinData.CODIGO}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Generado: {formatTimestamp(pinData.TIMESTAMP)}
                </p>
                <p className="text-sm text-gray-600">
                  ({formatDistanceToNow(pinData.TIMESTAMP, { locale: es, addSuffix: true })})
                </p>
              </div>
              {isPinExpired(pinData.TIMESTAMP) && (
                <div className="mt-3 bg-red-50 p-3 rounded-lg border border-red-100">
                  <p className="text-red-600 text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Este código fue generado hace más de 10 minutos y podría no ser válido
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="button-secondary px-4 py-2 rounded-lg"
            >
              Cerrar
            </button>
            <button
              onClick={onFetchPin}
              disabled={loading}
              className="button-primary px-4 py-2 rounded-lg flex items-center gap-2"
            >
              {loading ? 'Cargando...' : 'Obtener último código'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}