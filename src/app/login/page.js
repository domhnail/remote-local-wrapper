import Image from "next/image";

export default function Login() {
  return (
    <div className="mt-20 flex items-center justify-center">
      <div className="p-8 rounded-lg w-full max-w-md">
        <h1 className="text-3xl text-primary mb-6 text-center">Login</h1>
        <form>
          <input
            type="email"
            name="email"
            placeholder="Passphrase"
            required
            className="w-full p-2 mb-4 bg-base-300 rounded text-base focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="w-full p-2 bg-neutral text-neutral-content rounded hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
