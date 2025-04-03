import Image from "next/image";
import Link from "next/link";

export default function ComfyUi() {
  return (
    <div className="min-h-screen flex flex-col items-center mt-20">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-4xl text-green-300">ComfyUI</h1>
        <Image className="grayscale" width="50" height="50" src="/comfy.png" alt="ComfyUI logo" />
      </div>

      {/* Buttons */}
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-4">
          <Link
            href="/login"
            className="flex-1 py-4 px-20 bg-neutral-800 text-neutral-300 rounded hover:bg-neutral-700 focus:ring-green-500 transition-colors flex items-center justify-center whitespace-nowrap h-12 border-l-4 border-green-300"
          >
            Boot ComfyUI
          </Link>
          <Link
            href="/settings"
            className="flex-1 py-4 px-20 bg-neutral-800 text-neutral-300 rounded hover:bg-neutral-700 focus:ring-green-500 transition-colors flex items-center justify-center whitespace-nowrap h-12 border-l-4 border-green-300"
          >
            Kill ComfyUI
          </Link>
        </div>
      </div>
    </div>
  );
}