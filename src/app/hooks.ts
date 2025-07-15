import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

/**
 * Use throughout the app instead of plain `useDispatch` and `useSelector`
 * to get proper types from Redux Toolkit.
 */
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/** Convenience hook used by routers/components to read auth status */
export function useAuthStatus() {
  return useAppSelector((state) => state.auth.status);
}
