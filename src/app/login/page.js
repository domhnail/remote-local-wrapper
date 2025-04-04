'use client'

import { useState } from "react";
import useAuthStore from '../store/auth-store';

export default function Login() {
  const [inputValue, setInputValue] = useState('');
  const setPassphrase = useAuthStore((state) => state.setPassphrase);

  const handleSubmit = (e) => {
    e.preventDefault();
    setPassphrase(inputValue);
    setInputValue("");
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
          <button
            type="submit"
            className="w-full p-2 bg-neutral text-neutral-content rounded hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
