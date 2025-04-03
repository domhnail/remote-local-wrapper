'use client';

import { useState, useEffect, useRef } from "react";

export default function Settings() {

  const isBrowser = typeof window !== "undefined";
  const initialRender = useRef(true);

  const getLocalStorage = (key, defaultValue) => {
    if (!isBrowser) return defaultValue;
    const stored = localStorage.getItem(key);
    return stored !== null ? stored : defaultValue;
  };

  const [domain, setDomain] = useState('');
  const [hostPort, setHostPort] = useState(22);
  const [comfyPort, setComfyPort] = useState(8188);
  const [ollamaPort, setOllamaPort] = useState(11434);
  const [hostName, setHostName] = useState('');

  // load settings from localStorage on mount
  useEffect(() => {
    if (!isBrowser) return;
    setDomain(getLocalStorage('domain', ''));
    setHostPort(Number(getLocalStorage('hostPort', 22)));
    setComfyPort(Number(getLocalStorage('comfyPort', 8188)));
    setOllamaPort(Number(getLocalStorage('ollamaPort', 11434)));
    setHostName(getLocalStorage('hostName', ''));
  }, [isBrowser]);

  // save settings to localStorage when changed
  useEffect(() => {
    if (!isBrowser || initialRender.current) {
      initialRender.current = false;
      return;
    }
    localStorage.setItem('domain', domain);
    localStorage.setItem('hostPort', hostPort);
    localStorage.setItem('comfyPort', comfyPort);
    localStorage.setItem('ollamaPort', ollamaPort);
    localStorage.setItem('hostName', hostName);
  }, [domain, hostPort, comfyPort, ollamaPort, hostName, isBrowser]);

  return (
    <div className="mt-10 flex items-center justify-center">
      <div className="rounded-lg w-full max-w-md">
        <div className="card bg-base-300 rounded-box grid h-20 place-items-center">ssh -i ~/.ssh/id_rsa {hostName}@{domain} -p {hostPort}</div>
        <h1 className="text-3xl text-primary my-6 text-center">Settings</h1>
        <form>
          <label>IP/Domain</label>
          <input
            type="ip"
            name="ip"
            placeholder="domain.net/127.0.0.1"
            value={domain}
            required
            className="w-full p-2 mb-4 bg-base-200 rounded focus:outline-none focus:ring-2 focus:ring-neutral"
            onChange={(e) => setDomain(e.target.value)}
          />
          <label>Ports - Host</label>
          <input
            type="ports"
            name="ports"
            placeholder="22"
            value={hostPort}
            required
            className="w-full p-2 mb-4 bg-base-200 rounded focus:outline-none focus:ring-2 focus:ring-neutral"
            onChange={(e) => setHostPort(Number(e.target.value))}
          />
          <label>Ports - ComfyUi</label>
          <input
            type="ports"
            name="ports"
            placeholder="8188"
            value={comfyPort}
            required
            className="w-full p-2 mb-4 bg-base-200 rounded focus:outline-none focus:ring-2 focus:ring-neutral"
            onChange={(e) => setComfyPort(Number(e.target.value))}
          />
          <label>Ports - Ollama</label>
          <input
            type="ports"
            name="ports"
            placeholder="11434"
            value={ollamaPort}
            required
            className="w-full p-2 mb-4 bg-base-200 rounded focus:outline-none focus:ring-2 focus:ring-neutral"
            onChange={(e) => setOllamaPort(Number(e.target.value))}
          />
          <label>Host Name</label>
          <input
            type="host"
            name="host"
            placeholder="Host Name"
            value={hostName}
            required
            className="w-full p-2 mb-4 bg-base-200 rounded focus:outline-none focus:ring-2 focus:ring-neutral"
            onChange={(e) => setHostName(e.target.value)}
          />
        </form>
      </div>
    </div>
  );
}
