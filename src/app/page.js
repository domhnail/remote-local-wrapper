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
        <div className="flex items-center justify-center w-10 h-10 shrink-0 rounded-full bg-primary text-primary-content font-bold">
          1
        </div>
        <h1 className="text-lg font-medium border-b-4 border-primary">Login and Settings</h1>
      </div>

      {/* Buttons */}
      <div className="flex flex-row gap-4">
        {/* Buttons */}
        <Link
          href="/login"
          className="w-full p-3 bg-neutral text-neutral-content rounded hover:opacity-80  focus:outline-none focus:ring-2 focus:ring-accent-content text-center transition-colors"
        >
          Login
        </Link>
        <Link
          href="/settings"
          className="w-full p-3 bg-neutral text-neutral-content rounded hover:opacity-80  focus:outline-none focus:ring-2 focus:ring-accent-content text-center transition-colors"
        >
          Settings
        </Link>
      </div>

      {/* Step 2 */}
      <div className="flex items-center gap-4 mt-5">
        <div className="flex items-center justify-center w-10 h-10 shrink-0 rounded-full bg-primary text-primary-content font-bold">
          2
        </div>
        <h1 className="text-lg font-medium border-b-4 border-primary">Select what you want to use</h1>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-4">
        <Link
          href="/comfyui"
          className="w-full p-3 bg-neutral text-neutral-content rounded hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-accent-content text-center transition-colors"
        >
          ComfyUi
        </Link>
        <Link
          href="/ollama"
          className="w-full p-3 bg-neutral text-neutral-content rounded hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-accent-content text-center transition-colors"
        >
          Ollama
        </Link>
      </div>
    </div>
  );
}
