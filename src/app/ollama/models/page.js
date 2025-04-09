'use client'

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect} from "react";
import useAuthStore from "../../store/auth-store"
import { useSettings } from "@/context/settings-context";

export default function OllamaModels() {

  const { settings } = useSettings();
  const [models, setModels] = useState([]);
  const [isDownLoading, setIsDownLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [downloadLog, setDownloadLog] = useState("");

  const token = useAuthStore((state) => state.sessionToken);

  const startOllama = {
    "host": settings.domain,
    "port": settings.hostPort,
    "username": settings.hostName,
    "token": token,
    "command": "$HOME/.ssh_scripts/.ollama_control start-server"
  }

  const getModels = {
    "host": settings.domain,
    "port": settings.hostPort,
    "username": settings.hostName,
    "token": token,
    "command": "$HOME/.ssh_scripts/.ollama_control list-models"
  }

  const pullOrDelete = {
    "host": settings.domain,
    "port": settings.hostPort,
    "username": settings.hostName,
    "token": token,
  }


  useEffect(() => {
    //then boot ollama
    bootOllama();
    //then fetch the models
    fetchModels();
  }, [settings, token]);

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

  const removeModel = async (selectModel) => {
    console.log("trying to remove model:", selectModel);
    const deleteModel = {
      ...pullOrDelete,
      command: `$HOME/.ssh_scripts/.ollama_control remove-model ${selectModel}`
    };
    try {
      //run script to delete model
      const res2 = await fetch('/api/ssh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deleteModel)
      })
      const data3 = await res2.json();
      fetchModels();
      console.log(data3)
    } catch (error) {
      console.error("Error deleting model:", error);
    } finally {
      // setIsLoading(false);
    }
  }

  const downloadModel = async (newModel) => {
    const pullModel = {
      ...pullOrDelete,
      command: `$HOME/.ssh_scripts/.ollama_control pull-model ${newModel}`
    };
    setIsDownLoading(true);
    try {
      //run script to download a model
      const res = await fetch('/api/ssh_out', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pullModel)
      })
      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        setDownloadLog(lines[lines.length - 1] || '');
      }
      setIsReady(true);
      fetchModels();
    } catch (error) {
      console.error("Error getting model:", error);
    } finally {
      setIsDownLoading(false);
    }
  }

  const fetchModels = async () => {

    const response = await fetch('/api/ssh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(getModels)
    });

    const modelResponse = await response.json();

    // Extract the raw text from the `output` field
    const rawText = modelResponse.output || '';
    if (!rawText) {
      console.log('Undefined output', modelResponse);
    }

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
          {models.map((modelElement,index) => (
            <li key={index} className="flex justify-between items-center p-4 bg-base-300 rounded-lg shadow-md">
              <span className="text-base">{modelElement}</span>
              <button
                type="button"
                onClick={() => removeModel(modelElement)}
                className="btn btn-square btn-sm bg-secondary hover:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <img src="/trash.png" alt="Delete" className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Download Model Form */}
      <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const model = formData.get('model');
            if (model) downloadModel(model.toString()); }}
            className="w-full max-w-4xl mt-6">
        <label className="block mb-2 text-lg font-medium text-base border-b-4 border-primary">
          Download Model
        </label>
        {isDownLoading && <pre className="bg-black text-green-400 p-4 text-sm">{downloadLog}</pre>}
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