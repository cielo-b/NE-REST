import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAppSelector } from './hooks/hooks';
import ParkingManagement from './components/admin/ParkingManagement';
import ParkingOperations from './components/attendant/ParkingOperations';
import ParkingReports from './components/admin/ParkingReports';
import Login from './pages/Login';
import { RegisterPage } from './pages/Register';
import DashboardLayout from './layouts/DashboardLayout';
import { ERole } from './enums/ERole';
import Bills from './components/admin/Bills';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const PrivateRoute: React.FC<{ children: React.ReactNode; roles?: ERole[] }> = ({
  children,
  roles,
}) => {
  const { user, loading, isAuthenticated } = useAppSelector((state) => state.auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route
            path="/dashboard/*"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <Routes>
                    <Route
                      path="admin/parking"
                      element={
                        <PrivateRoute roles={[ERole.ADMIN]}>
                          <ParkingManagement />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="admin/reports"
                      element={
                        <PrivateRoute roles={[ERole.ADMIN]}>
                          <ParkingReports />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="admin/billd"
                      element={
                        <PrivateRoute roles={[ERole.ADMIN]}>
                          <Bills />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="attendant/operations"
                      element={
                        <PrivateRoute roles={[ERole.ATTENDANT]}>
                          <ParkingOperations />
                        </PrivateRoute>
                      }
                    />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
