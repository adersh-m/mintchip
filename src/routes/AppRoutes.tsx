import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Spinner from '../components/Spinner';
import Layout from '../components/Layout';

// Lazy load all pages for better performance
const LoginPage = lazy(() => import('../pages/Login/LoginPage'));
const DashboardPage = lazy(() => import('../pages/Dashboard/DashboardPage'));
const SettingsPage = lazy(() => import('../pages/Settings/SettingsPage'));
const TransactionsPage = lazy(() => import('../pages/Transactions/TransactionsPage'));
const BudgetPage = lazy(() => import('../pages/BudgetPage'));
const ReportsPage = lazy(() => import('../pages/ReportsPage'));

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* public routes */}

          {/* guarded routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Layout><DashboardPage /></Layout>} />
            <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
            <Route path="/transactions" element={<Layout><TransactionsPage /></Layout>} />
            <Route path="/budgets" element={<Layout><BudgetPage /></Layout>} />
            <Route path="/reports" element={<Layout><ReportsPage /></Layout>} />
          </Route>

          {/* fallback */}
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
