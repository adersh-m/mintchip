/**
 * Environment configuration utilities
 */

export const env = {
  // API configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  ENABLE_MOCK_API: import.meta.env.VITE_ENABLE_MOCK_API === 'true' || import.meta.env.DEV,

  // Development flags
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true' || import.meta.env.DEV,
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,

  // Firebase configuration
  FIREBASE: {
    API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
    AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
    MEASUREMENT_ID: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  },
} as const; /**
 * Check if all required environment variables are present
 */
export const validateEnv = (): void => {
  const required = ['VITE_FIREBASE_PROJECT_ID', 'VITE_API_BASE_URL'];
  const missing = required.filter((key) => !import.meta.env[key]);

  if (missing.length > 0) {
    console.warn('Missing environment variables:', missing);
  }

  // Validate Firebase configuration
  const firebaseKeys = Object.values(env.FIREBASE);
  const missingFirebase = firebaseKeys.filter((value) => !value || value === '');

  if (missingFirebase.length > 0) {
    console.warn('Missing Firebase configuration values');
  }
};

/**
 * Debug logger that only logs in development
 */
export const debugLog = (...args: unknown[]): void => {
  if (env.DEBUG_MODE) {
    console.log('[DEBUG]', ...args);
  }
};
