import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useMedications } from '../hooks/useMedications';
import { useDoseLogs } from '../hooks/useDoseLogs';
import { useCaregiverPatients } from '../hooks/useCaregiverPatients';
import { useCaregiverInvites } from '../hooks/useCaregiverInvites';
import AddMedicationForm from '../components/AddMedicationForm';
import MedicationList from '../components/MedicationList';
import DoseHistory from '../components/DoseHistory';
import InvitePatientForm from '../components/InvitePatientForm';
import PendingInvites from '../components/PendingInvites';

function PatientPanel({ patientId, canEdit }) {
  const { medications, error: medError, addMedication, deleteMedication } =
    useMedications(patientId);
  const { doseLogs, error: doseError, logDose } = useDoseLogs(patientId);

  async function handleLogDose(medicationId) {
    await logDose(medicationId);
  }

  return (
    <>
      {canEdit && <AddMedicationForm onAdd={addMedication} />}

      <section>
        <h3>Medications</h3>
        {medError && <p className="form-error">{medError}</p>}
        <MedicationList
          medications={medications}
          canEdit={canEdit}
          onLogDose={handleLogDose}
          onDelete={deleteMedication}
        />
      </section>

      <section>
        <h3>Recent Activity</h3>
        {doseError && <p className="form-error">{doseError}</p>}
        <DoseHistory doseLogs={doseLogs} />
      </section>
    </>
  );
}

function CaregiverView() {
  const { links, loading, error, invitePatient } = useCaregiverPatients();
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  if (loading) return <p>Loading your patients…</p>;

  const selectedLink = links.find((link) => link.patient._id === selectedPatientId) || links[0];

  return (
    <>
      <InvitePatientForm onInvite={invitePatient} />

      {error && <p className="form-error">{error}</p>}
      {links.length === 0 ? (
        <p>No linked patients yet. Invite a patient to get started.</p>
      ) : (
        <>
          <section>
            <h3>Your Patients</h3>
            <ul className="patient-list">
              {links.map((link) => (
                <li key={link._id}>
                  <button
                    type="button"
                    className={link.patient._id === selectedLink.patient._id ? 'active' : ''}
                    onClick={() => setSelectedPatientId(link.patient._id)}
                  >
                    {link.patient.name} ({link.permission})
                  </button>
                </li>
              ))}
            </ul>
          </section>
          <PatientPanel
            patientId={selectedLink.patient._id}
            canEdit={selectedLink.permission === 'edit'}
          />
        </>
      )}
    </>
  );
}

function PatientDashboard({ patientId }) {
  const { invites, error, acceptInvite } = useCaregiverInvites();

  return (
    <>
      {error && <p className="form-error">{error}</p>}
      <PendingInvites invites={invites} onAccept={acceptInvite} />
      <PatientPanel patientId={patientId} canEdit />
    </>
  );
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="brand">
          <img src="/favicon.svg" alt="" />
          <h1>Hi, {user.name}</h1>
        </div>
        <button type="button" onClick={handleLogout}>
          Log Out
        </button>
      </header>

      {user.role === 'patient' ? (
        <PatientDashboard patientId={user.id} />
      ) : (
        <CaregiverView />
      )}
    </div>
  );
}
