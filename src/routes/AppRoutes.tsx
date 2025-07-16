import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Spinner from '../components/Spinner';
import TransactionsPage from '../pages/Transactions/TransactionsPage';

const LoginPage = lazy(() => import('../pages/Login/LoginPage'));
const DashboardPage = lazy(() => import('../pages/Dashboard/DashboardPage'));
const SettingsPage = lazy(() => import('../pages/Settings/SettingsPage'));

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />

          {/* guarded routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* fallback */}
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
