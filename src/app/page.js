import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    // <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    <main className="flex flex-col gap-8 p-8 max-w-md mx-auto">
    {/* Step 1 */}
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-10 h-10 shrink-0 rounded-full bg-green-300 text-neutral-700 font-bold">
          1
        </div>
        <h1 className="text-lg font-medium border-b-4 border-green-300">Login and Settings</h1>
      </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-row gap-4">
        <button className="w-full p-3 bg-neutral-800 text-green-300 rounded hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-500">
          Login
        </button>
        <button className="w-full p-3 bg-neutral-800 text-green-300 rounded hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-500">
          Settings
        </button>
      </div>
      
      {/* Step 2 */}
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-10 h-10 shrink-0 rounded-full bg-green-300 text-neutral-700 font-bold">
          2
        </div>
        <h1 className="text-lg font-medium border-b-4 border-green-300">Choose what you want to use</h1>
      </div>
    
      {/* Buttons */}
    <div className="mt-8 flex flex-row gap-4">
      <Link
        href="/comfyui"
        className="w-full p-3 bg-neutral-800 text-green-300 rounded hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-center transition-colors"
      >
        Boot ComfyUi
      </Link>
      <Link
        href="/ollama"
        className="w-full p-3 bg-neutral-800 text-green-300 rounded hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-center transition-colors"
      >
        Boot Ollama
      </Link>
    </div>
  </main>
);
}
