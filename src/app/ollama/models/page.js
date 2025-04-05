import Image from "next/image";
import Link from "next/link";

export default function OllamaModels() {

  


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
          {["Model 1", "Model 2", "Model 3"].map((model, index) => (
            <li key={index} className="flex justify-between items-center p-4 bg-base-300 rounded-lg shadow-md">
              <span className="text-base">{model}</span>
              <button
                type="button"
                className="btn btn-square btn-sm bg-secondary hover:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <img src="/trash.png" alt="Delete" className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Download Model Form */}
      <form className="w-full max-w-4xl mt-6">
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