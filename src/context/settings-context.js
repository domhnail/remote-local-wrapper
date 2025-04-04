// context/settings-context.js
'use client'
import { createContext, useState, useEffect, useRef, useContext } from "react";

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const isBrowser = typeof window !== "undefined";
  const initialRender = useRef(true);

  const getLocalStorage = (key, defaultValue) => {
    if (!isBrowser) return defaultValue;
    const stored = localStorage.getItem(key);
    return stored !== null ? stored : defaultValue;
  };

  const [settings, setSettings] = useState({
    domain: '',
    hostPort: 22,
    comfyPort: 8188,
    ollamaPort: 11434,
    hostName: ''
  });

  // load settings on mount
  useEffect(() => {
    if (!isBrowser) return;
    setSettings({
      domain: getLocalStorage('domain', ''),
      hostPort: Number(getLocalStorage('hostPort', 22)),
      comfyPort: Number(getLocalStorage('comfyPort', 8188)),
      ollamaPort: Number(getLocalStorage('ollamaPort', 11434)),
      hostName: getLocalStorage('hostName', '')
    });
  }, [isBrowser]);

  // save on change
  useEffect(() => {
    if (!isBrowser || initialRender.current) {
      initialRender.current = false;
      return;
    }
    
    localStorage.setItem('domain', settings.domain);
    localStorage.setItem('hostPort', settings.hostPort);
    localStorage.setItem('comfyPort', settings.comfyPort);
    localStorage.setItem('ollamaPort', settings.ollamaPort);
    localStorage.setItem('hostName', settings.hostName);
  }, [settings, isBrowser]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);