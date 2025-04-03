import Image from "next/image";
import Link from "next/link";

export default function Ollama() {
  return (
    <div className="flex flex-col items-center mt-20">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-4xl text-primary">Ollama</h1>
        <Image className="grayscale" width="50" height="50" src="/ollama.png" alt="Ollama logo" />
      </div>

      {/* Buttons */}
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-4">
          <Link
            href="/ollama/chat"
            className="flex-1 py-4 px-20 bg-neutral text-neutral-content rounded hover:opacity-80 focus:ring-green-500 transition-colors flex items-center justify-center whitespace-nowrap h-12"
          >
            Chat
          </Link>
          <Link
            href="/ollama/models"
            className="flex-1 py-4 px-20 bg-neutral text-neutral-content rounded hover:opacity-80 focus:ring-green-500 transition-colors flex items-center justify-center whitespace-nowrap h-12"
          >
            Models
          </Link>
        </div>
      </div>
    </div>
  );
}