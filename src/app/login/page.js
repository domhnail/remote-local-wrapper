'use client'

import { useState } from "react";
import useAuthStore from '../store/auth-store';

export default function Login() {
  const [inputValue, setInputValue] = useState('');
  const setPassphrase = useAuthStore((state) => state.setPassphrase);
  const setPrivateKey = useAuthStore((state) => state.setPrivateKey);

  const handleSubmit = (e) => {
    e.preventDefault();
    setPassphrase(inputValue);
    setInputValue("");
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
            className="w-full p-2 mb-4 bg-base-300 rounded text-base focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="file"
            accept=""
            onChange={handleKeyUpload}
            className="w-full p-2 mb-4 bg-base-300 rounded text-base text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:opacity-80"
          />
        </form>
      </div>
    </div>
  );
}
