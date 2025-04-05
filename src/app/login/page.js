'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from '../store/auth-store';

export default function Login() {
  const [inputValue, setInputValue] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const passphrase = useAuthStore((state) => state.setPassphrase);
  const setPassphrase = useAuthStore((state) => state.setPassphrase);
  const privateKey = useAuthStore((state) => state.setPrivateKey);
  const setPrivateKey = useAuthStore((state) => state.setPrivateKey);

  useEffect(() => {
    // If already logged in go to main page
    if (passphrase && privateKey) {
      setIsLoggedIn(true);
      router.push('/');
    }
  }, [passphrase, privateKey, router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setPassphrase(inputValue);
    setInputValue("");
    setIsLoggedIn(true);
    router.push('/');
  };

  const handleKeyUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const keyText = event.target.result;
      setPrivateKey(keyText);
    };
    reader.readAsText(file);
  };

  if (isLoggedIn) {
    return null; 
  };

  return (
    <div className="mt-20 flex items-center justify-center">
      <div className="p-8 rounded-lg w-full max-w-md">
        <h1 className="text-3xl text-primary mb-6 text-center">Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Passphrase"
            required
            onChange={(e) => setPassphrase(e.target.value)}
            className="w-full p-2 mb-4 bg-base-300 rounded text-base focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="file"
            accept=""
            onChange={handleKeyUpload}
            className="w-full p-2 mb-4 bg-base-300 rounded text-base text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:opacity-80"
          />
          <button
            type="submit"
            className="w-full p-2 bg-primary text-white rounded hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
