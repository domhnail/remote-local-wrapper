import Image from "next/image";
import Link from "next/link";

//koboldai.net for inspiration
// List item for models
// Input field to download model from ollama
// one ollama chat page and one manage models (download model, list models, list...)
// list of models with delete option

export default function Home() {
  return (
    <div className="flex flex-col gap-8 p-8 max-w-md mx-auto">
    {/* Step 1 */}
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-10 h-10 shrink-0 rounded-full bg-green-300 text-neutral-700 font-bold">
          1
        </div>
        <h1 className="text-lg font-medium border-b-4 border-green-300">Login and Settings</h1>
      </div>

          {/* Buttons */}
      <div className="flex flex-row gap-4">
        <Link
          href="/login"
          className="w-full p-3 bg-neutral-800 text-green-300 rounded hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-center transition-colors"
        >
        Login
        </Link>
        <Link
          href="/settings"
          className="w-full p-3 bg-neutral-800 text-green-300 rounded hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-center transition-colors"
        >
          Settings
        </Link>
      </div>
      
      {/* Step 2 */}
      <div className="flex items-center gap-4 mt-5">
        <div className="flex items-center justify-center w-10 h-10 shrink-0 rounded-full bg-green-300 text-neutral-700 font-bold">
          2
        </div>
        <h1 className="text-lg font-medium border-b-4 border-green-300">Choose what you want to use</h1>
      </div>
    
      {/* Buttons */}
    <div className="flex flex-col gap-4">
      <Link
        href="/comfyui"
        className="w-full p-3 bg-neutral-800 text-green-300 rounded border-l-4 border-green-300 hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-center transition-colors"
      >
        ComfyUi
      </Link>
      <Link
        href="/ollama"
        className="w-full p-3 bg-neutral-800 text-green-300 rounded border-l-4 border-green-300 hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-center transition-colors"
      >
        Ollama
      </Link>
    </div>
  </div>
);
}
