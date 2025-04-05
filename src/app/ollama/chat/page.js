'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
import useAuthStore from "../../store/auth-store"
import { useSettings } from "@/context/settings-context";

export default function OllamaChat() {
    
    const [showSettings, setShowSettings] = useState(false);
    const [maxTokens, setMaxTokens] = useState(512);
    const [temperature, setTemperature] = useState(0.7);
    const [topP, setTopP] = useState(0.95);
    const [models, setModels] = useState([]);

    const { settings } = useSettings();
    const passphrase = useAuthStore((state) => state.passphrase);
    const privateKey = useAuthStore((state) => state.privateKey);

    const tunnelRequest = {
      "host": settings.domain,
      "port": settings.hostPort,
      "username": settings.hostName,
      "privateKey": privateKey,
      "passphrase": passphrase,
      "localPort": settings.ollamaPort,
      "remoteHost": "localhost",
      "remotePort": settings.ollamaPort,
      "prompt": "How are you?",
      "model" : ""
    }
  
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

    useEffect(() => {
      fetchModels();
    }, []);

    const fetchModels = async () => {
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

  const bootOllama = async (model) => {
    console.log(`Selected model: ${model}`);

    if (!model) {
        console.error("Error: Model is undefined");
        return; 
    }

    const updatedTunnelRequest = {
        ...tunnelRequest,
        model: model, //add the selected model to the tunnel request
    };

    console.log("model name: " + updatedTunnelRequest.model)

    try {
        const response = await fetch('/api/ollama_tunnel', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTunnelRequest)
        });

        if (!response.ok) {
            throw new Error(`SSH API returned error: ${response.status}`);
        }

        const data2 = await response.json();
        console.log("SSH Response:", data2);

        // then run script to start comfy
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
  
  return (
    <div className="flex flex-col items-center p-4">
    <div className="w-full max-w-4xl flex flex-col flex-grow">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-base">Ollama</h1>
            <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-m bg-primary text-neutral rounded p-2"
            >
                {showSettings ? 'Hide' : 'Show'} Settings
            </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
            <div className="mb-4 p-4 bg-[var(--primary)] shadow-md text-[var(--foreground)]">
                <div className="grid grid-cols-2 gap-6">

                    {/* Left Column - Model Selection */}
                    <div>
                        <form>
                            <label className="block mb-2 text-lg font-medium text-base-content border-b-4 border-primary">
                                Select a Model
                            </label>
                            <select className="bg-base-200 border border-base-200 text-base-content text-sm rounded-lg block w-full p-2.5"
                                    onChange={(event) => bootOllama(event.target.value)}
                            >
                              {models.map((model, index) => (
                                <option key={index} value={model}>
                                    {model}
                                </option>
                              ))}

                            </select>
                            <button
                                type="submit"
                                className="w-full p-2 mt-2 bg-base-300 text-base-content rounded hover:opacity-80"
                            >
                                Submit
                            </button>
                        </form>
                    </div>

                    {/* Right Column - Settings */}
                    <div>
                        <div className="mb-2">
                            <label className="block text-sm font-medium text-base-content">Max Tokens: {maxTokens}</label>
                            <input
                                type="range"
                                min="1"
                                max="2048"
                                value={maxTokens}
                                onChange={(e) => setMaxTokens(Number(e.target.value))}
                                className="w-full range range-success"
                            />
                        </div>

                        <div className="mb-2">
                            <label className="block text-sm font-medium text-base-content">Temperature: {temperature}</label>
                            <input
                                type="range"
                                step="0.1"
                                min="0.1"
                                max="2.0"
                                value={temperature}
                                onChange={(e) => setTemperature(Number(e.target.value))}
                                className="w-full range range-success"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-base-content">Top-P: {topP}</label>
                            <input
                                type="range"
                                step="0.05"
                                min="0.1"
                                max="1.0"
                                value={topP}
                                onChange={(e) => setTopP(Number(e.target.value))}
                                className="w-full range range-success"
                            />
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Chat History */}
        <div className="flex-grow overflow-y-auto mb-6 rounded-lg bg-base-200 shadow-lg p-6 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <p className="text-center mb-4 text-lg text-base-content">Start a conversation with the AI chatbot.</p>
            </div>
            <div className="space-y-4">
                <div className="space-y-2">
                  
                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="flex flex-col items-end w-[80%]">
                      <div className="flex items-end gap-2">
                      <div className="chat-bubble bg-neutral text-neutral-content">User's message...</div>
                      <div className="chat-header">You</div>
                        <img
                          src="/human.png"
                          alt="Human"
                          className="w-12 h-12 rounded-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex justify-start">
                    <div className="flex flex-col items-start w-[80%]">
                      <div className="flex items-end gap-2">
                        <img
                          src="/robot.png"
                          alt="AI"
                          className="w-12 h-12 rounded-full bg-orange-300"
                        />
                          <div className="chat-header">AI</div>
                          <div className="chat-bubble bg-base-300">AI's response...</div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
        </div>

        {/* Input Form */}
        <form className="bg-base-200 p-4 rounded-lg shadow-lg">

          <div className="flex gap-2">
            <input
              type="text"
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow px-4 py-2 border border-base-100 bg-base-300 text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-base focus:border-transparent"
            />
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg`}
            >
              
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                "Send"
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
