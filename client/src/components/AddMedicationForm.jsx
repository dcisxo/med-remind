import { useState } from 'react';

export default function AddMedicationForm({ onAdd }) {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [instructions, setInstructions] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await onAdd({ name, dosage, frequency, instructions });
      setName('');
      setDosage('');
      setFrequency('');
      setInstructions('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="medication-form">
      <h3>Add Medication</h3>
      {error && <p className="form-error">{error}</p>}
      <label>
        Name
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <label>
        Dosage
        <input
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
          placeholder="e.g. 10mg"
          required
        />
      </label>
      <label>
        Frequency
        <input
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          placeholder="e.g. Twice daily"
          required
        />
      </label>
      <label>
        Instructions (optional)
        <input value={instructions} onChange={(e) => setInstructions(e.target.value)} />
      </label>
      <button type="submit" disabled={submitting}>
        {submitting ? 'Adding…' : 'Add Medication'}
      </button>
    </form>
  );
}
