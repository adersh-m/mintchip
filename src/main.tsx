import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRoutes from './routes/AppRoutes.tsx'
import { Provider } from 'react-redux'
import { store } from './app/store.ts'

// Initialize mock service worker in development
if (import.meta.env.DEV) {
  import('./mocks/handlers').then(({ worker }) => {
    worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
    }).then(() => {
      console.log('🚀 MSW started successfully');
    }).catch((error) => {
      console.error('❌ MSW failed to start:', error);
    });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  </StrictMode>,
)
