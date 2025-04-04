'use client';

import { useSettings } from "@/context/settings-context";

export default function Settings() {
  const { settings, setSettings } = useSettings();

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: field.match(/Port$/i) ? Number(value) : value
    }));
  };

  return (
    <div className="mt-10 flex items-center justify-center">
      <div className="rounded-lg w-full max-w-md">
        <div className="card bg-base-300 rounded-box grid h-20 place-items-center">ssh -i ~/.ssh/id_rsa {settings.hostName}@{settings.domain} -p {settings.hostPort}</div>
        <h1 className="text-3xl text-primary my-6 text-center">Settings</h1>
        <form>
          <label>IP/Domain</label>
          <input
            type="ip"
            name="ip"
            placeholder="domain.net/127.0.0.1"
            value={settings.domain}
            required
            className="w-full p-2 mb-4 bg-base-200 rounded focus:outline-none focus:ring-2 focus:ring-neutral"
            onChange={(e) => handleChange('domain', e.target.value)}
          />
          <label>Ports - Host</label>
          <input
            type="ports"
            name="ports"
            placeholder="22"
            value={settings.hostPort}
            required
            className="w-full p-2 mb-4 bg-base-200 rounded focus:outline-none focus:ring-2 focus:ring-neutral"
            onChange={(e) => handleChange('hostPort', e.target.value)}
          />
          <label>Ports - ComfyUi</label>
          <input
            type="ports"
            name="ports"
            placeholder="8188"
            value={settings.comfyPort}
            required
            className="w-full p-2 mb-4 bg-base-200 rounded focus:outline-none focus:ring-2 focus:ring-neutral"
            onChange={(e) => handleChange('comfyPort', e.target.value)}
          />
          <label>Ports - Ollama</label>
          <input
            type="ports"
            name="ports"
            placeholder="11434"
            value={settings.ollamaPort}
            required
            className="w-full p-2 mb-4 bg-base-200 rounded focus:outline-none focus:ring-2 focus:ring-neutral"
            onChange={(e) => handleChange('ollamaPort', e.target.value)}
          />
          <label>Host Name</label>
          <input
            type="host"
            name="host"
            placeholder="Host Name"
            value={settings.hostName}
            required
            className="w-full p-2 mb-4 bg-base-200 rounded focus:outline-none focus:ring-2 focus:ring-neutral"
            onChange={(e) => handleChange('hostName', e.target.value)}
          />
        </form>
      </div>
    </div>
  );
}
