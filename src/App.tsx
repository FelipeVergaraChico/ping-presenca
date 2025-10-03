import { useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import { mapKeycloakToUser } from './utils/auth';
import { ThemeProvider } from './contexts/ThemeContext';
import ToastProvider from './components/ui/ToastProvider';
import ThemedConfigProvider from './components/ui/ThemedConfigProvider';

// Importar estilos do tema
import './styles/theme.css';
import './styles/responsive.css';

// Pages
import LoginPage from './pages/auth/LoginPage';
import ProfessorDashboard from './pages/professor/DashboardPage';
import ProfessorAttendance from './pages/professor/AttendancePage';
import StudentDashboard from './pages/student/DashboardPage';
import StudentAttendance from './pages/student/AttendancePage';

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated, isInitialized } = useAuth();
  if (!isInitialized) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Carregando autenticação...</div>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Role-aware components
const RoleDashboard = () => {
  const { keycloak } = useAuth();
  const { user } = useMemo(() => mapKeycloakToUser(keycloak), [keycloak]);
  if (user?.role === 'student') return <StudentDashboard />;
  return <ProfessorDashboard />;
};

const RoleCourses = () => {
  const { keycloak } = useAuth();
  const { user } = useMemo(() => mapKeycloakToUser(keycloak), [keycloak]);
  if (user?.role === 'student') return <StudentAttendance />;
  return <ProfessorAttendance />;
};

// Initial route handler
const InitialRoute = () => {
  const { isAuthenticated, isInitialized } = useAuth();
  if (!isInitialized) return <div style={{ padding: 40, textAlign: 'center' }}>Inicializando...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <ThemeProvider>
      <ThemedConfigProvider>
        <Router>
          <div className="app">
            <ToastProvider />
            <Routes>
              {/* Initial Route */}
              <Route path="/" element={<InitialRoute />} />
              
              {/* Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* Unified Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <RoleDashboard />
                </ProtectedRoute>
              } />
              <Route path="/courses" element={
                <ProtectedRoute>
                  <RoleCourses />
                </ProtectedRoute>
              } />
              
              {/* Fallback Route */}
              <Route path="*" element={<InitialRoute />} />
            </Routes>
          </div>
        </Router>
      </ThemedConfigProvider>
    </ThemeProvider>
  );
}

export default App;
