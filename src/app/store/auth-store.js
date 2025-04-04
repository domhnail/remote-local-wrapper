import { create } from 'zustand';

const useAuthStore = create((set) => ({
  passphrase: '',
  privateKey: '',
  setPassphrase: (passphrase) => set({ passphrase }),
  setPrivateKey: (privateKey) => set({ privateKey }),
}));

export default useAuthStore;