import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div>
      <header className="dashboard-header">
        <h1>Welcome, {user.name}</h1>
        <button type="button" onClick={handleLogout}>
          Log Out
        </button>
      </header>
      <p>
        Signed in as <strong>{user.email}</strong> ({user.role})
      </p>
    </div>
  );
}
