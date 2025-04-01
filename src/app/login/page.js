import Image from "next/image";

export default function Home() {
  return (
    <div className="mt-20 flex items-center justify-center">
      <div className="p-8 rounded-lg w-full max-w-md">
        <h1 className="text-3xl text-green-300 mb-6 text-center">Login</h1>
        <form>
          <input
            type="email"
            name="email"
            placeholder="Passphrase"
            required
            className="w-full p-2 mb-4 bg-neutral-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="w-full p-2 bg-neutral-900 text-green-300 rounded hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
