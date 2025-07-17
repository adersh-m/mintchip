import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Spinner from '../components/Spinner';
import Layout from '../components/Layout';
import TransactionsPage from '../pages/Transactions/TransactionsPage';
import BudgetPage from '../pages/BudgetPage';

const LoginPage = lazy(() => import('../pages/Login/LoginPage'));
const DashboardPage = lazy(() => import('../pages/Dashboard/DashboardPage'));
const SettingsPage = lazy(() => import('../pages/Settings/SettingsPage'));

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
          </Route>

          {/* fallback */}
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
