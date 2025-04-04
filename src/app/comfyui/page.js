'use client'

import Image from "next/image";
import Link from "next/link";
import useAuthStore from "../store/auth-store";
import { useSettings } from "@/context/settings-context";

export default function ComfyUi() {
  const { settings } = useSettings();
  const passphrase = useAuthStore((state) => state.passphrase);
  const privateKey = useAuthStore((state) => state.privateKey);
  const request = {
    "host": settings.domain,
    "port": settings.hostPort,
    "username": settings.hostName,
    "privateKey": privateKey,
    "passphrase": passphrase,
    "localPort": settings.comfyPort,
    "remoteHost": "localhost",
    "remotePort": settings.comfyPort
  }

  const secondRequest = {
    "host": settings.domain,
    "port": settings.hostPort,
    "username": settings.hostName,
    "privateKey": privateKey,
    "passphrase": passphrase,
    "command": "$HOME/.comfy_start"
  }

  const killRequest = {
    "host": settings.domain,
    "port": settings.hostPort,
    "username": settings.hostName,
    "privateKey": privateKey,
    "passphrase": passphrase,
    "command": "$HOME/.comfy_kill"
  };

  const fillTunnelRequest = {
    "tunnelId": settings.comfyPort
  };

  const bootComfy = async () => {
    // tunnel in
    const res = await fetch('/api/ssh_tunnel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });
    const data = await res.json();

    // then run script to start comfy
    const res2 = await fetch('/api/ssh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(secondRequest)
    })
    const data2 = await res2.json();
  }

  const killComfy = async () => {
    const res = await fetch('/api/ssh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(killRequest)
    });
    const data = await res.json();
    console.log("kill output:", data);
    const res2 = await fetch('/api/tunnel_close', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fillTunnelRequest)
    })
    const data2 = await res2.json();
    console.log("kill output:", data2);
  };

  return (
    <div className="flex flex-col items-center mt-20">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-4xl text-primary">ComfyUI</h1>
        <Image className="grayscale" width="50" height="50" src="/comfy.png" alt="ComfyUI logo" />
      </div>

      {/* Buttons */}
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-4">
          <Link
            className="flex-1 py-4 px-20 bg-neutral text-neutral-content rounded hover:opacity-80 focus:ring-green-500 transition-colors flex items-center justify-center whitespace-nowrap h-12"
            href=""
            onClick={bootComfy}
          >
            Boot ComfyUI
          </Link>
          <Link
            href=""
            className="flex-1 py-4 px-20 bg-neutral text-neutral-content rounded hover:opacity-80 focus:ring-green-500 transition-colors flex items-center justify-center whitespace-nowrap h-12"
            onClick={killComfy}
          >
            Kill ComfyUI
          </Link>
        </div>
      </div>
    </div>
  );
}