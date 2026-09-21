import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './hooks/useAuth';
import './App.css';

function LoginRoute() {
  const navigate = useNavigate();
  return <Login onSuccess={() => navigate('/dashboard', { replace: true })} />;
}

function RegisterRoute() {
  const navigate = useNavigate();
  return <Register onSuccess={() => navigate('/dashboard', { replace: true })} />;
}

function App() {
  const { user, loading } = useAuth();

  return (
    <div id="center">
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <LoginRoute />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/dashboard" replace /> : <RegisterRoute />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={<Navigate to={loading ? '/login' : user ? '/dashboard' : '/login'} replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
