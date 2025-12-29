import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import MainLayout from './layouts/MainLayout';

// Placeholder Pages
const Dashboard = () => <div className="text-2xl font-bold mb-4">Dashboard</div>;
const Invoices = () => <div className="text-2xl font-bold mb-4">Facturación</div>;
const Clients = () => <div className="text-2xl font-bold mb-4">Gestión de Clientes</div>;
const Products = () => <div className="text-2xl font-bold mb-4">Gestión de Productos</div>;

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="clients" element={<Clients />} />
        <Route path="products" element={<Products />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
