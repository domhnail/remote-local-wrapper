import { create } from 'zustand';

const useAuthStore = create((set) => ({
  passphrase: '',
  setPassphrase: (passphrase) => set({ passphrase }),
}));

export default useAuthStore;