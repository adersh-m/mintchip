import { createSlice } from '@reduxjs/toolkit';

export interface AuthState {
  status: 'idle' | 'authenticated' | 'error';
}

const initialState: AuthState = {
  status: 'idle',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated(state) {
      state.status = 'authenticated';
    },
    setError(state) {
      state.status = 'error';
    },
    resetAuth(state) {
      state.status = 'idle';
    },
  },
});

export const { setAuthenticated, setError, resetAuth } = authSlice.actions;
export default authSlice.reducer;
