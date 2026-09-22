import { useEffect, useState } from 'react';
import { apiFetch } from '../api/http';
import { useAuth } from './useAuth';

export function useDoseLogs(patientId) {
  const { token } = useAuth();
  const [doseLogs, setDoseLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDoseLogs() {
      if (!patientId) {
        setDoseLogs([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError('');
      try {
        const data = await apiFetch(`/doselogs?patientId=${patientId}&limit=20`, token);
        setDoseLogs(data.doseLogs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadDoseLogs();
  }, [patientId, token]);

  async function logDose(medicationId, status = 'taken') {
    const data = await apiFetch('/doselogs', token, {
      method: 'POST',
      body: { medicationId, status },
    });
    setDoseLogs((prev) => [data.doseLog, ...prev]);
  }

  return { doseLogs, loading, error, logDose };
}
