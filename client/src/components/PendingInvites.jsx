import { useState } from 'react';

export default function PendingInvites({ invites, onAccept }) {
  const [error, setError] = useState('');
  const [acceptingId, setAcceptingId] = useState(null);

  if (invites.length === 0) return null;

  async function handleAccept(linkId) {
    setError('');
    setAcceptingId(linkId);
    try {
      await onAccept(linkId);
    } catch (err) {
      setError(err.message);
    } finally {
      setAcceptingId(null);
    }
  }

  return (
    <section>
      <h3>Pending Caregiver Invites</h3>
      {error && <p className="form-error">{error}</p>}
      <ul className="invite-list">
        {invites.map((link) => (
          <li key={link._id}>
            <span>
              <strong>{link.caregiver.name}</strong> ({link.caregiver.email}) wants{' '}
              {link.permission} access
            </span>
            <button
              type="button"
              onClick={() => handleAccept(link._id)}
              disabled={acceptingId === link._id}
            >
              {acceptingId === link._id ? 'Accepting…' : 'Accept'}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
