import { describe, expect, it, vi } from 'vitest';
import { authService } from '../authService';

vi.mock('firebase/auth', () => {
  return {
    getAuth: vi.fn(() => ({})),
    initializeApp: vi.fn(() => ({})),
    createUserWithEmailAndPassword: vi.fn(() =>
      Promise.resolve({ user: { uid: 'u1', email: 'demo@mintchip.dev' } }),
    ),
    signInWithEmailAndPassword: vi.fn(() =>
      Promise.resolve({ user: { uid: 'u1', email: 'demo@mintchip.dev' } }),
    ),
    signOut: vi.fn(() => Promise.resolve()),
    onAuthStateChanged: vi.fn((_, callback) => {
      callback(null);
      return () => { };
    }),
  };
});

describe('authService', () => {
  it('login resolves mock user', async () => {
    const user = await authService.login('demo@x.com', 'password');
    expect(user.uid).toBe('u1');
  });
});
