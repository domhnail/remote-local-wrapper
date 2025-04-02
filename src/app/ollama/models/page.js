import Image from "next/image";
import Link from "next/link";

export default function OllamaModels() {
  return (
    <div className="min-h-screen flex flex-col items-center p-10">
        <div className="flex items-center">
            <h1 className="text-3xl text-green-300 mb-6 text-center">Manage Ollama</h1>
            <Image className="mb-6 ml-4 grayscale" width="50" height="50" src='/ollama.png' alt="comfyui logo image"></Image>
        </div>
        
        {/* Models */}
        <form className="max-w-6xl mx-auto">
        <label className="block mb-2 text-lg font-medium text-gray-900 border-b-4 border-green-300 dark:text-white">Select a Model</label>
        <select className="bg-neutral-50 pl-50 pr-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-neutral-500 focus:border-green-300 block w-full p-2.5 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-green-300 dark:focus:border-green-300">
            <option defaultValue="Model 1">Model 1</option>
            <option value="Model 2">Model 2</option>
            <option value="Model 3">Model 3</option>
            <option value="Model 4">Model 4</option>
        </select>
        <button
            type="submit"
            className="w-full p-2 mt-2 bg-neutral-900 text-green-300 rounded hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Submit
          </button>
        </form>

        <form className="max-w-6xl mx-auto mt-5">
        <label className="block mb-2 text-lg font-medium text-gray-900 border-b-4 border-green-300 dark:text-white">Download Model</label>
          <input
            type="model"
            name="model"
            required
            className="w-full pl-25 pr-25 pt-2 pb-2 bg-neutral-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-green-300"
          />
                  <button
            type="submit"
            className="w-full p-2 mt-2 bg-neutral-900 text-green-300 rounded hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Download
          </button>
          </form>


        {/* Buttons */}
        <div className="flex flex-row gap-4">
          <Link
            href="/ollama"
            className="flex-1 py-2 px-6 mt-4 bg-neutral-800 text-neutral-300 rounded hover:bg-neutral-700 focus:ring-green-500 transition-colors flex items-center justify-center whitespace-nowrap h-12">
            Go Back
          </Link>
        </div>
    </div>
  );
}