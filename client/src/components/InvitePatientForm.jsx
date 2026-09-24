import { useState } from 'react';

export default function InvitePatientForm({ onInvite }) {
  const [patientEmail, setPatientEmail] = useState('');
  const [permission, setPermission] = useState('view');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    setSubmitting(true);
    try {
      await onInvite(patientEmail, permission);
      setMessage(`Invite sent to ${patientEmail}`);
      setPatientEmail('');
      setPermission('view');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="medication-form">
      <h3>Invite a Patient</h3>
      {error && <p className="form-error">{error}</p>}
      {message && <p className="form-success">{message}</p>}
      <label>
        Patient Email
        <input
          type="email"
          value={patientEmail}
          onChange={(e) => setPatientEmail(e.target.value)}
          required
        />
      </label>
      <label>
        Permission
        <select value={permission} onChange={(e) => setPermission(e.target.value)}>
          <option value="view">View only</option>
          <option value="edit">Can edit</option>
        </select>
      </label>
      <button type="submit" disabled={submitting}>
        {submitting ? 'Sending…' : 'Send Invite'}
      </button>
    </form>
  );
}
