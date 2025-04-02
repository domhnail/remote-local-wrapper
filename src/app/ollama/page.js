import Image from "next/image";
import Link from "next/link";

export default function Ollama() {
  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <div className="flex items-center">
        <h1 className="text-3xl text-green-300 mb-6 text-center">Ollama</h1>
        <Image className="mb-6 ml-4 grayscale" width="50" height="50" src='/ollama.png' alt="ollama logo image"></Image>
      </div>
      <main className="w-full max-w-md"> 
        {/* Buttons */}
        <div className="flex flex-row gap-4">
          <Link
            href="/ollama/chat"
            className="flex-1 py-2 px-6 bg-neutral-800 text-neutral-300 rounded hover:bg-neutral-700 focus:ring-green-500 transition-colors flex items-center justify-center whitespace-nowrap h-12 border-l-4 border-green-300">
            Chat
          </Link>
          <Link
            href="/ollama/models"
            className="flex-1 py-2 px-6 bg-neutral-800 text-neutral-300 rounded hover:bg-neutral-700 focus:ring-green-500 transition-colors flex items-center justify-center whitespace-nowrap h-12 border-l-4 border-green-300">
            Models
          </Link>
        </div>
      </main>
    </div>
  );
}