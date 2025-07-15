import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/authSlice';
import PrivateRoute from '../PrivateRoute';

function setup(authStatus: 'idle' | 'authenticated') {
  const rootReducer = combineReducers({ auth: authReducer });
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: { auth: { status: authStatus } } as any,
  });
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<div>Dashboard</div>} />
          </Route>
          <Route path="/login" element={<div>Login</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
}

test('redirects unauthenticated user to /login', () => {
  setup('idle');
  expect(screen.getByText(/Login/i)).toBeInTheDocument();
});

test('renders dashboard for authenticated user', () => {
  setup('authenticated');
  expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
});
