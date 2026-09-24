export default function MedicationList({ medications, canEdit, onLogDose, onDelete }) {
  if (medications.length === 0) {
    return <p>No medications added yet.</p>;
  }

  return (
    <ul className="medication-list">
      {medications.map((med) => (
        <li key={med._id} className="medication-card">
          <div className="medication-info">
            <strong>{med.name}</strong> — {med.dosage}, {med.frequency}
            {med.instructions && <p className="medication-instructions">{med.instructions}</p>}
            {med.sideEffects && (
              <p className="medication-side-effects">
                <span className="side-effects-label">May cause:</span> {med.sideEffects}
              </p>
            )}
          </div>
          {canEdit && (
            <div className="medication-actions">
              <button type="button" onClick={() => onLogDose(med._id)}>
                Log Dose
              </button>
              <button type="button" className="danger" onClick={() => onDelete(med._id)}>
                Delete
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
