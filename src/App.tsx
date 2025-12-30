import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import MainLayout from './layouts/MainLayout';
import ClientsPage from './pages/ClientsPage';
import ProductsPage from './pages/ProductsPage';
import InvoicesPage from './pages/InvoicesPage';
import CreateInvoicePage from './pages/CreateInvoicePage';
import InvoiceDetailsPage from './pages/InvoiceDetailsPage';
import AuditPage from './pages/AuditPage';

// Placeholder Pages
const Dashboard = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-background-paper p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
        <h3 className="text-gray-500 text-sm uppercase tracking-wider font-semibold">Ventas del Mes</h3>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">S/. 0.00</p>
      </div>
      <div className="bg-white dark:bg-background-paper p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
        <h3 className="text-gray-500 text-sm uppercase tracking-wider font-semibold">Comprobantes</h3>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">0</p>
      </div>
      <div className="bg-white dark:bg-background-paper p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
        <h3 className="text-gray-500 text-sm uppercase tracking-wider font-semibold">Clientes Nuevos</h3>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">0</p>
      </div>
    </div>
  </div>
);

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
        <Route path="invoices" element={<InvoicesPage />} />
        <Route path="invoices/new" element={<CreateInvoicePage />} />
        <Route path="invoices/:id" element={<InvoiceDetailsPage />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="audit" element={<AuditPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
