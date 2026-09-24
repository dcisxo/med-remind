import { useEffect, useState } from 'react';
import { apiFetch } from '../api/http';
import { useAuth } from './useAuth';

export function useCaregiverInvites() {
  const { token, user } = useAuth();
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadInvites() {
      if (user?.role !== 'patient') {
        setLoading(false);
        return;
      }
      try {
        const data = await apiFetch('/caregiver/invites', token);
        setInvites(data.links);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadInvites();
  }, [token, user]);

  async function acceptInvite(linkId) {
    await apiFetch(`/caregiver/links/${linkId}/accept`, token, { method: 'POST' });
    setInvites((prev) => prev.filter((link) => link._id !== linkId));
  }

  return { invites, loading, error, acceptInvite };
}
