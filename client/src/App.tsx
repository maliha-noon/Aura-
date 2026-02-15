import React, { ReactNode } from 'react';
import { Outlet, Route, Routes, Navigate } from 'react-router-dom';
import MainLayout from './views/MainLayout';
import Home from './views/Home';
import Login from './views/Login';
import Register from './views/Register';
import ForgotPassword from './views/ForgotPassword';
import ResetPassword from './views/ResetPassword';
import AdminDashboard from './views/AdminDashboard';
import Terms from './views/Terms';
import Privacy from './views/Privacy';
import { useAuth } from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { Toaster } from 'react-hot-toast';

const AdminProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAdmin } = useAuth();
  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <>
      <Routes>
        <Route
          element={
            <MainLayout>
              <Outlet />
            </MainLayout>
          }
        >
          <Route path={'/'} element={<Home />} />
          <Route path={'/login'} element={<Login />} />
          <Route path={'/register'} element={<Register />} />
          <Route path={'/terms'} element={<Terms />} />
          <Route path={'/privacy'} element={<Privacy />} />
          <Route path={'/forgot-password'} element={<ForgotPassword />} />
          <Route path={'/reset-password'} element={<ResetPassword />} />
          <Route
            path={'/admin'}
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />
        </Route>
      </Routes>
      <Toaster
        position="top-center"
        toastOptions={{
          error: {
            duration: 5000,
          },
        }}
        containerStyle={{
          zIndex: 99999, // Force high z-index
          top: 20,
        }}
      />
    </>
  );
}

export default App;
