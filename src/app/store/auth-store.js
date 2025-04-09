import { create } from 'zustand';

const useAuthStore = create((set) => ({
  sessionToken: '',
  setSessionToken: (token) => set({ sessionToken: token }),
}));

export default useAuthStore;