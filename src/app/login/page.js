'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "../store/auth-store";

export default function Login() {
  const [passphrase, setPassphrase] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const setSessionToken = useAuthStore((state) => state.setSessionToken);
  const sessionToken = useAuthStore((state) => state.sessionToken);
  useEffect(() => {
    if (sessionToken) {
      router.push('/');
    }
  }, [sessionToken, router]);

  const handleSelectKeyFile = async () => {
    try {
      const input = document.createElement("input");
      input.type = "file";  
      input.onchange = async () => {
        const file = input.files[0];
        if (file) {
          const keyText = await file.text();
          setPrivateKey(keyText);
        }
      };
  
      input.click();  // Trigger the file picker
    } catch (err) {
      console.error("Key file selection failed:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/session/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ privateKey, passphrase }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        setSessionToken(data.token);
        router.push('/');
      } else {
        console.error("Login failed:", data.error);
      }
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setIsSubmitting(false);
    }
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
          <button
            type="button"
            onClick={handleSelectKeyFile}
            className="w-full p-2 mb-4 bg-secondary text-white rounded hover:opacity-80"
          >
            Select Private Key
          </button>
          <button
            type="submit"
            className="w-full p-2 bg-primary text-white rounded hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
