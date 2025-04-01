import Image from "next/image";

export default function Settings() {
  return (
    <div className="mt-10 flex items-center justify-center">
      <div className="rounded-lg w-full max-w-md">
        <h1 className="text-3xl text-green-300 mb-6 text-center">Settings</h1>
        <form>
          <label>IP Address</label>
          <input
            type="ip"
            name="ip"
            placeholder="IP"
            required
            className="w-full p-2 mb-4 bg-neutral-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <label>Ports</label>
          <input
            type="ports"
            name="ports"
            placeholder="Ports"
            required
            className="w-full p-2 mb-4 bg-neutral-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <label>Host Name</label>
          <input
            type="host"
            name="host"
            placeholder="Host Name"
            required
            className="w-full p-2 mb-4 bg-neutral-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <label>Theme</label>
           <input
            type="theme"
            name="theme"
            placeholder="Theme"
            required
            className="w-full p-2 mb-4 bg-neutral-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="w-full p-2 bg-neutral-900 text-green-300 rounded hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
