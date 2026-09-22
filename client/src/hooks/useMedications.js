import { useEffect, useState } from 'react';
import { apiFetch } from '../api/http';
import { useAuth } from './useAuth';

export function useMedications(patientId) {
  const { token } = useAuth();
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadMedications() {
      if (!patientId) {
        setMedications([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError('');
      try {
        const data = await apiFetch(`/medications?patientId=${patientId}`, token);
        setMedications(data.medications);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadMedications();
  }, [patientId, token]);

  async function addMedication({ name, dosage, frequency, instructions }) {
    const data = await apiFetch('/medications', token, {
      method: 'POST',
      body: { patientId, name, dosage, frequency, instructions },
    });
    setMedications((prev) => [data.medication, ...prev]);
  }

  async function deleteMedication(medicationId) {
    await apiFetch(`/medications/${medicationId}`, token, { method: 'DELETE' });
    setMedications((prev) => prev.filter((m) => m._id !== medicationId));
  }

  return { medications, loading, error, addMedication, deleteMedication };
}
