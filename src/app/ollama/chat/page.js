'use client';

import Image from "next/image";
import { useState } from "react";

export default function OllamaChat() {
    
    const [showSettings, setShowSettings] = useState(false);
    const [maxTokens, setMaxTokens] = useState(512);
    const [temperature, setTemperature] = useState(0.7);
    const [topP, setTopP] = useState(0.95);
  
  return (
    <div className="min-h-screen flex flex-col items-center p-4">
    <div className="w-full max-w-4xl flex flex-col flex-grow">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-neutral-200">Ollama</h1>
            <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-m bg-green-300 text-neutral-900 rounded p-2"
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
                            <label className="block mb-2 text-lg font-medium text-gray-900 border-b-4 border-green-300 dark:text-white">
                                Select a Model
                            </label>
                            <select className="bg-neutral-700 border border-neutral-600 text-neutral-100 text-sm rounded-lg block w-full p-2.5">
                                <option defaultValue="Model 1">Model 1</option>
                                <option value="Model 2">Model 2</option>
                                <option value="Model 3">Model 3</option>
                                <option value="Model 4">Model 4</option>
                            </select>
                            <button
                                type="submit"
                                className="w-full p-2 mt-2 bg-neutral-900 text-green-300 rounded hover:bg-neutral-800"
                            >
                                Submit
                            </button>
                        </form>
                    </div>

                    {/* Right Column - Settings */}
                    <div>
                        <div className="mb-2">
                            <label className="block text-sm font-medium">Max Tokens: {maxTokens}</label>
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
                            <label className="block text-sm font-medium">Temperature: {temperature}</label>
                            <input
                                type="range"
                                step="0.1"
                                min="0.1"
                                max="4.0"
                                value={temperature}
                                onChange={(e) => setTemperature(Number(e.target.value))}
                                className="w-full range range-success"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Top-P: {topP}</label>
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
        <div className="flex-grow overflow-y-auto mb-6 rounded-lg bg-neutral-900 shadow-lg p-6 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <p className="text-center mb-4 text-lg">Start a conversation with the AI chatbot.</p>
            </div>
            <div className="space-y-4">
                <div className="space-y-2">
                  
                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="flex flex-col items-end w-[80%]">
                      <div className="flex items-end gap-2">
                      <div className="chat-bubble bg-neutral-700 text-white">User's message...</div>
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
                          <div className="chat-bubble bg-neutral-600">AI's response...</div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
        </div>

        {/* Input Form */}
        <form className="bg-neutral-800 p-4 rounded-lg shadow-lg">

          <div className="flex gap-2">
            <input
              type="text"
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow px-4 py-2 border border-neutral-600 bg-neutral-700 text-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
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
