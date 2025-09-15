import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
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
const ProtectedRoute = ({ 
  children, 
  requiredRole 
}: { 
  children: React.ReactElement, 
  requiredRole?: 'student' | 'professor' 
}) => {
  const { isAuthenticated, user } = useAuthStore();
  const checkAuth = useAuthStore((state) => state.checkAuth);
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && user?.role !== requiredRole) {
    const redirectPath = user?.role === 'student' ? '/student/dashboard' : '/professor/dashboard';
    return <Navigate to={redirectPath} replace />;
  }
  
  return children;
};

// Initial route handler
const InitialRoute = () => {
  const { isAuthenticated, user } = useAuthStore();
  const checkAuth = useAuthStore((state) => state.checkAuth);
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  const redirectPath = user?.role === 'student' ? '/student/dashboard' : '/professor/dashboard';
  return <Navigate to={redirectPath} replace />;
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
              
              {/* Professor Routes */}
              <Route path="/professor/dashboard" element={
                <ProtectedRoute requiredRole="professor">
                  <ProfessorDashboard />
                </ProtectedRoute>
              } />
              <Route path="/professor/courses" element={
                <ProtectedRoute requiredRole="professor">
                  <ProfessorAttendance />
                </ProtectedRoute>
              } />
              
              {/* Student Routes */}
              <Route path="/student/dashboard" element={
                <ProtectedRoute requiredRole="student">
                  <StudentDashboard />
                </ProtectedRoute>
              } />
              <Route path="/student/courses" element={
                <ProtectedRoute requiredRole="student">
                  <StudentAttendance />
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
