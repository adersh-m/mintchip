import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store.ts';
import './index.css';
import { env, validateEnv } from './lib/env.ts';
import AppRoutes from './routes/AppRoutes.tsx';

// Validate environment configuration
validateEnv();

// Initialize mock service worker in development
if (env.ENABLE_MOCK_API) {
  import('./mocks/handlers').then(({ worker }) => {
    worker
      .start({
        onUnhandledRequest: 'bypass',
        serviceWorker: {
          url: '/mockServiceWorker.js',
        },
      })
      .then(() => {
        console.log('🚀 MSW started successfully');
      })
      .catch((error) => {
        console.error('❌ MSW failed to start:', error);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  </StrictMode>
);
