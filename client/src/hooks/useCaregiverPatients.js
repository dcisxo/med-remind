import { useEffect, useState } from 'react';
import { apiFetch } from '../api/http';
import { useAuth } from './useAuth';

export function useCaregiverPatients() {
  const { token, user } = useAuth();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPatients() {
      if (user?.role !== 'caregiver') {
        setLoading(false);
        return;
      }
      try {
        const data = await apiFetch('/caregiver/patients', token);
        setLinks(data.links);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadPatients();
  }, [token, user]);

  return { links, loading, error };
}
