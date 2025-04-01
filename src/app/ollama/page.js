'use client';

import Image from "next/image";

export default function Ollama() {

  
  return (
<div className="min-h-screen flex flex-col items-center p-4">
      <div className="w-full max-w-4xl flex flex-col flex-grow">
        {/* Header */}
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-neutral-200">Ollama</h1>
          {/* Reset button */}
          
            <button
              className="p-2 text-neutral-900 bg-green-300 hover:bg-green-500 rounded-lg flex items-center gap-1 transition-colors"
              aria-label="Settings"
            >
              <span>Settings</span>
            </button>
        </header>

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
                      <p className="font-medium text-gray-200 mb-1">You</p>
                      <div className="flex items-end gap-2">
                        <div className="bg-neutral-700 text-white p-3 rounded-lg">
                        </div>
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
                      <p className="font-medium text-gray-200 mb-1">AI</p>
                      <div className="flex items-end gap-2">
                        <img
                          src="/robot.png"
                          alt="AI"
                          className="w-12 h-12 rounded-full bg-orange-300"
                        />
                        <div className="bg-neutral-600 p-3 rounded-lg">
                        </div>
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
