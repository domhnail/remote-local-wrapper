'use client';

import { useState, useEffect, useRef } from "react";
import useAuthStore from "../../store/auth-store"
import { useSettings } from "@/context/settings-context";

export default function OllamaChat() {

  // states
  const [showSettings, setShowSettings] = useState(false);

  //chat handling
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [maxTokens, setMaxTokens] = useState(512);
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.95);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [systemprompt, setSystemPrompt] = useState('');

  // login params
  const { settings } = useSettings();
  const token = useAuthStore((state) => state.sessionToken);

  const tunnelRequest = {
    "host": settings.domain,
    "port": settings.hostPort,
    "username": settings.hostName,
    "token": token,
    "localPort": settings.ollamaPort,
    "remoteHost": "localhost",
    "remotePort": settings.ollamaPort,
    "prompt": "",
    "model": ""
  }

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

  const hasInitialized = useRef(false);

  useEffect(() => {

    // checking if we've already inited the page and just returning instead of doing anything if we have
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    //checking if any of our settings are null and not doing any of these if they are
    if (!Object.values(tunnelRequest).some(ele => ele == null)) {
      //create the tunnel
      createTunnel();
      //then boot ollama
      bootOllama();
      //then fetch the models
      fetchModels();
    }
  }, []);

  const createTunnel = async () => {
    console.log("Checking if port 11434 is in use...");

    try {
      //Step 1: Kill any process using the port before opening the tunnel
      await fetch('/api/tunnel_close', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "host": settings.domain,
          "port": settings.hostPort,
          "username": settings.hostName,
          "token": token,
          command: "kill -9 $(lsof -t -i :11434) 2>/dev/null || fuser -k 11434/tcp"
        }),
      });

      console.log("Existing process killed, setting up SSH tunnel...");

      //Step 2: Proceed with tunnel creation
      const tunnelRes = await fetch('/api/ollama_tunnel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tunnelRequest),
      });

      if (!tunnelRes.ok) {
        throw new Error(`Tunnel setup failed: ${tunnelRes.status}`);
      }

      const tunnelData = await tunnelRes.json();
      console.log("Tunnel response:", tunnelData);

    } catch (error) {
      console.error("Error setting up tunnel:", error);
    }
  };

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

  // this runs upon routing to the page, to get ollama up so that the other commands can be issued
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newHistory = [...history, { role: 'user', content: message }];
    setHistory(newHistory);
    setMessage('');
    try {
      if (!selectedModel) {
        console.error("No selected model")
        return
      }
      const res = await fetch(`http://${tunnelRequest.remoteHost}:${settings.ollamaPort}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            {
              role : "system",
              content: systemprompt
            },
            ...newHistory,
            {
            role : "user",
            content : message
            }
          ],
          stream: false,
          options : {
            max_tokens: maxTokens,
            temperature: temperature,
            top_p: topP,
          }
        }),
      });

      if (!res.ok) throw new Error('Network response was not ok');

      // Read response as stream
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let botResponse = "";
      let buffer = ""; // Temp storage for incomplete words

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Decode current chunk
        const chunk = decoder.decode(value, { stream: true });

        // Append to buffer and split into lines
        buffer += chunk;
        const lines = buffer.split("\n");

        // Process all but last (possibly incomplete) line
        for (let i = 0; i < lines.length - 1; i++) {
          const parsed = JSON.parse(lines[i]);
          botResponse += parsed.message.content + " ";
        }

        // Store last line in buffer (might be incomplete)
        buffer = lines[lines.length - 1];
      }

      // Handle any remaining buffered data
      if (buffer.trim()) {
        const parsed = JSON.parse(buffer);
        botResponse += parsed.message.content;
      }

      setHistory([...newHistory, { role: "assistant", content: botResponse }]);

    } catch (error) {
      console.error('Error communicating with Ollama:', error);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="w-full max-w-4xl flex flex-col flex-grow">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-base">Ollama</h1>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="text-m bg-primary text-primary-content rounded p-2"
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
                    value={selectedModel}
                    onChange={(event) => {
                      const model = event.target.value;
                      setSelectedModel(model)
                      bootOllama(model);
                    }}
                  >
                    <option value="" disabled>Select a model</option>
                    {models.map((model, index) => (
                      <option key={index} value={model}>
                        {model}
                      </option>
                    ))}

                  </select>
                  {/* <button
                                type="submit"
                                className="w-full p-2 mt-2 bg-base-300 text-base-content rounded hover:opacity-80"
                            >
                                Submit
                            </button> */}
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
                <div>
                  <label className="block text-sm font-medium text-base-content">System prompt: </label>
                  <textarea
                    value={systemprompt}
                    rows={1}
                    onChange={(e) => setSystemPrompt((e.target.value))}
                    className="flex-grow resize-none overflow-hidden px-4 py-2 border border-base-100 bg-base-300 text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-base focus:border-transparent"
                    onInput={(e) => {
                      e.target.style.height = "auto";
                      e.target.style.height = e.target.scrollHeight + "px";
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-col gap-4">
        {/* Chat History */}
          <div className="flex-grow overflow-y-auto mb-6 rounded-lg bg-base-200 shadow-lg p-6 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <p className="text-center mb-4 text-lg text-base-content">Start a conversation with the AI chatbot.</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                {history.map((entry, index) => (
                  entry.role === 'user' ? (
                    // user message
                    <div key={index} className="flex justify-end">
                      <div className="flex flex-col items-end w-[80%]">
                        <div className="flex items-end gap-2">
                          <div className="chat-bubble bg-neutral text-neutral-content">
                            {entry.content}
                          </div>
                          <div className="chat-header">You</div>
                          <img
                            src="/user.png"
                            alt="User"
                            className="w-12 h-12 rounded-full bg-neutral-content"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    // ai message
                    <div key={index} className="flex justify-start">
                      <div className="flex flex-col items-start w-[80%]">
                        <div className="flex items-end gap-2">
                          <img
                            src="/robot.png"
                            alt="AI"
                            className="w-12 h-12 rounded-full bg-neutral-content"
                          />
                          <div className="chat-header">AI</div>
                          <div className="chat-bubble bg-base-300">
                            {entry.content}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="bg-base-200 p-4 rounded-lg shadow-lg flex gap-2">
          <div className="flex-grow flex gap-2">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              rows={1}
              className="flex-grow resize-none overflow-hidden px-4 py-2 border border-base-100 bg-base-300 text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-base focus:border-transparent"
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();  // prevent new line on enter
                  e.target.form.requestSubmit(); // trigger the send function
                }
              }}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-content rounded-lg hover:opacity-80 transition-colors"
              disabled={!message} 
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
