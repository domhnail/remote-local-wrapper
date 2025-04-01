import Image from "next/image";
import Link from "next/link";

export default function ComfyUi() {
  return (
    <div className="justify-items-center min-h-screen sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-3xl text-green-300 mb-6 text-center">ComfyUi</h1>
      <main>
                  {/* Buttons */}
        <div className="flex flex-row gap-4">
          <Link
            href="/login"
            className="w-full p-3 bg-neutral-800 text-neutral-300 rounded hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-center transition-colors"
          >
          Boot ComfyUi
          </Link>
          <Link
            href="/settings"
            className="w-full p-3 bg-neutral-800 text-neutral-300 rounded hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-center transition-colors"
          >
            Kill ComfyUi
          </Link>
        </div>
      </main>
    </div>
  );
}
