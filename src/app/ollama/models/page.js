import Image from "next/image";
import Link from "next/link";

export default function OllamaModels() {
  return (
    <div className="min-h-screen flex flex-col items-center mt-5">
      {/* Header */}
      <div className="flex items-center mb-6">
        <h1 className="text-3xl text-green-300 text-center">Ollama</h1>
        <Image className="ml-4 grayscale" width="50" height="50" src="/ollama.png" alt="Ollama logo" />
      </div>

      {/* Models Section */}
      <div className="w-full max-w-4xl">
        <p className="block mb-3 text-lg font-medium text-gray-300 border-b-4 border-green-300">
          Manage Models
        </p>
        <ul className="space-y-3">
          {["Model 1", "Model 2", "Model 3"].map((model, index) => (
            <li key={index} className="flex justify-between items-center p-4 bg-neutral-900 rounded-lg shadow-md">
              <span className="text-white">{model}</span>
              <button
                type="button"
                className="btn btn-square btn-sm bg-green-300 hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <img src="/trash.png" alt="Delete" className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Download Model Form */}
      <form className="w-full max-w-4xl mt-6">
        <label className="block mb-2 text-lg font-medium text-gray-300 border-b-4 border-green-300">
          Download Model
        </label>
        <input
          type="text"
          name="model"
          required
          className="w-full px-4 py-2 bg-neutral-800 rounded text-white focus:outline-none focus:ring-2 focus:ring-green-300"
          placeholder="Enter model name..."
        />
        <button
          type="submit"
          className="w-full py-2 mt-3 bg-neutral-900 text-green-300 rounded hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          Download
        </button>
      </form>

      {/* Navigation Button */}
      <div className="w-full max-w-4xl flex justify-start mt-6">
        <Link
          href="/ollama"
          className="w-fit px-6 py-3 bg-neutral-800 text-neutral-300 rounded-lg hover:bg-neutral-700 focus:ring-green-500 transition-colors flex items-center justify-center"
        >
          Go Back
        </Link>
      </div>
    </div>
  );
}