'use client'

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import useAuthStore from "../../store/auth-store"
import { useSettings } from "@/context/settings-context";

export default function OllamaModels() {

  const { settings } = useSettings();
  const [model, setModel] = useState('');
  const [models, setModels] = useState([]);
  const [isDownLoading, setIsDownLoading] = useState(false);
  const [isReady, setIsReady] = useState(false); // Change to true to refresh list

  const passphrase = useAuthStore((state) => state.passphrase);
  const privateKey = useAuthStore((state) => state.privateKey);

  const startOllama = {
    "host": settings.domain,
    "port": settings.hostPort,
    "username": settings.hostName,
    "privateKey": privateKey,
    "passphrase": passphrase,
    "command": "$HOME/.ssh_scripts/.ollama_control start-server"
  }

  const getModels = {
    "host": settings.domain,
    "port": settings.hostPort,
    "username": settings.hostName,
    "privateKey": privateKey,
    "passphrase": passphrase,
    "command": "$HOME/.ssh_scripts/.ollama_control list-models"
  }

  const pullModel = {
    "host": settings.domain,
    "port": settings.hostPort,
    "username": settings.hostName,
    "privateKey": privateKey,
    "passphrase": passphrase,
    "command": "$HOME/.ssh_scripts/.ollama_control pull-model ${model}"
  }

  const deleteModel = {
    "host": settings.domain,
    "port": settings.hostPort,
    "username": settings.hostName,
    "privateKey": privateKey,
    "passphrase": passphrase,
    "command": `$HOME/.ssh_scripts/.ollama_control remove-model ${model}`
  }

  const hasInitialized = useRef(false);

  useEffect(() => {
    // checking if we've already inited the page and just returning instead of doing anything if we have
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    //then boot ollama
    bootOllama();
    //then fetch the models
    fetchModels();
  }, []);

  const trashModel = async (model) => {
    setModel(model);
    removeModel();
  }

  const addModel = async (model) => {
    setModel(model);
    downloadModel();
  }

  const bootOllama = async () => {

    try {
      //run script to start ollama
      const res2 = await fetch('/api/ssh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(startOllama)
      })
      const data3 = await res2.json();

      console.log(data3)

    } catch (error) {
      console.error("Error booting Ollama:", error);
    } finally {
      // setIsLoading(false);
    }
  }

  const removeModel = async () => {

    try {
      //run script to delete model
      const res2 = await fetch('/api/ssh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deleteModel)
      })
      const data3 = await res2.json();

      console.log(data3)

    } catch (error) {
      console.error("Error deleting model:", error);
    } finally {
      // setIsLoading(false);
    }
  }

  const downloadModel = async () => {
    setIsDownLoading(true);
    try {
      //run script to download a model
      const res2 = await fetch('/api/ssh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pullModel)
      })
      const data3 = await res2.json();

      console.log(data3)
      setIsReady(true);
    } catch (error) {
      console.error("Error getting model:", error);
    } finally {
      setIsDownLoading(false);
    }
  }

  const fetchModels = async () => {
    if (isReady || isDownLoading) return; 
    
    const response = await fetch('/api/ssh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(getModels)
    });

    const modelResponse = await response.json();

    // Extract the raw text from the `output` field
    const rawText = modelResponse.output;

    // Process the extracted text
    const lines = rawText.split("\n").slice(1).filter(line => line.trim() !== "");
    const modelsList = lines.map(line => line.split(/\s+/)[0]);

    console.log("Extracted models:", modelsList); // Debugging step
    setModels(modelsList);
  };

  return (
    <div className="flex flex-col items-center mt-5">
      {/* Header */}
      <div className="flex items-center mb-6">
        <h1 className="text-3xl text-primary text-center">Ollama</h1>
        <Image className="ml-4 grayscale" width="50" height="50" src="/ollama.png" alt="Ollama logo" />
      </div>

      {/* Models Section */}
      
      <div className="w-full max-w-4xl">
        <p className="block mb-3 text-lg font-medium text-base border-b-4 border-primary">
          Manage Models
        </p>
        <ul className="space-y-3">
          {models.map((modelL,index) => (
            <li key={index} className="flex justify-between items-center p-4 bg-base-300 rounded-lg shadow-md">
              <span className="text-base">{modelL}</span>
              <button
                type="button"
                onClick={trashModel(modelL)}
                className="btn btn-square btn-sm bg-secondary hover:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <img src="/trash.png" alt="Delete" className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Download Model Form */}
      <form onSubmit={addModel} className="w-full max-w-4xl mt-6">
        <label className="block mb-2 text-lg font-medium text-base border-b-4 border-primary">
          Download Model
        </label>
        <input
          type="text"
          name="model"
          required
          className="w-full px-4 py-2 bg-base-300 rounded text-base focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter model name..."
        />
        <button
          type="submit"
          className="w-full py-2 mt-3 bg-neutral text-neutral-content rounded hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Download
        </button>
      </form>

      {/* Navigation Button */}
      <div className="w-full max-w-4xl flex justify-start mt-6">
        <Link
          href="/ollama"
          className="w-fit px-6 py-3 bg-base-300 text-base rounded-lg hover:opacity-80 focus:ring-primary transition-colors flex items-center justify-center"
        >
          Go Back
        </Link>
      </div>
    </div>
  );
}