'use client'

import Image from "next/image";
import Link from "next/link";
import useAuthStore from "../store/auth-store";
import { useSettings } from "@/context/settings-context";
import { useState } from 'react';

export default function ComfyUi() {
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false); // Change to true to see the button

  //get parameters
  const { settings } = useSettings();
  const passphrase = useAuthStore((state) => state.passphrase);
  const privateKey = useAuthStore((state) => state.privateKey);
  
  //request for tunneling
  const tunnelRequest = {
    "host": settings.domain,
    "port": settings.hostPort,
    "username": settings.hostName,
    "privateKey": privateKey,
    "passphrase": passphrase,
    "localPort": settings.comfyPort,
    "remoteHost": "localhost",
    "remotePort": settings.comfyPort
  }

  //request for comfy starting
  const comfyStartReq = {
    "host": settings.domain,
    "port": settings.hostPort,
    "username": settings.hostName,
    "privateKey": privateKey,
    "passphrase": passphrase,
    "command": "$HOME/.ssh_scripts/.comfy_start"
  }

  //request for comfy killing
  const killRequest = {
    "host": settings.domain,
    "port": settings.hostPort,
    "username": settings.hostName,
    "privateKey": privateKey,
    "passphrase": passphrase,
    "command": "$HOME/.ssh_scripts/.comfy_kill"
  };

  //request for tunnel ending
  const fillTunnelRequest = {
    "tunnelId": settings.comfyPort
  };

  const bootComfy = async () => {
    setIsLoading(true);
    try {
      // tunnel in
      const res = await fetch('/api/ssh_tunnel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tunnelRequest)
      });
      const data = await res.json();
      // then run script to start comfy
      const res2 = await fetch('/api/ssh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(comfyStartReq)
      })
      //don't bother data logging
      setIsReady(true);
    } catch (error) {
      console.error("Error booting ComfyUI:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const killComfy = async () => {
    setIsReady(false);
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
          {/* Boot Button */}
          <button
            className={`flex-1 py-4 px-20 bg-neutral text-neutral-content rounded hover:opacity-80 focus:ring-green-500 transition-colors flex items-center justify-center whitespace-nowrap h-12 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            onClick={bootComfy}
            disabled={isLoading}
          >
            {isLoading ? 'Booting...' : 'Boot ComfyUI'}
          </button>

          {/* Conditional Go To Button */}
          {isReady && (
            <Link
              href="http://localhost:8188/"
              className="flex-1 py-4 px-20 bg-accent text-accent-content rounded hover:opacity-80 focus:ring-green-500 transition-colors flex items-center justify-center whitespace-nowrap h-12"
            >
              Go To ComfyUI
            </Link>
          )}

          {/* Kill Button */}
          <button
            className="flex-1 py-4 px-20 bg-neutral text-neutral-content rounded hover:opacity-80 focus:ring-green-500 transition-colors flex items-center justify-center whitespace-nowrap h-12"
            onClick={killComfy}
          >
            Kill ComfyUI
          </button>
        </div>
      </div>
    </div>
  );
}