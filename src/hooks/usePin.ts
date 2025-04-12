import { useState } from 'react';
import { PinResponse } from '../types';

export function usePin() {
  const [pinData, setPinData] = useState<PinResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPin = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://n8n.automscc.com/webhook/codigos-jsd');
      const data: PinResponse = await response.json();
      setPinData(data);
    } catch (error) {
      setError('Error al obtener el PIN');
    } finally {
      setLoading(false);
    }
  };

  return {
    pinData,
    loading,
    error,
    fetchPin,
  };
}