import Image from "next/image";

export default function Settings() {
  return (
    <div className="mt-10 flex items-center justify-center">
      <div className="rounded-lg w-full max-w-md">
        <div className="card bg-base-300 rounded-box grid h-20 place-items-center">ssh -i ~/.ssh/comfy_rsa woofr@burrow.woofr.me -p 2012</div>
        <h1 className="text-3xl text-primary my-6 text-center">Settings</h1>
        <form>
          <label>IP/Domain</label>
          <input
            type="ip"
            name="ip"
            placeholder="domain.net/127.0.0.1"
            required
            className="w-full p-2 mb-4 bg-base-200 rounded focus:outline-none focus:ring-2 focus:ring-neutral"
          />
          <label>Ports - Host</label>
          <input
            type="ports"
            name="ports"
            placeholder="22"
            required
            className="w-full p-2 mb-4 bg-base-200 rounded focus:outline-none focus:ring-2 focus:ring-neutral"
          />
          <label>Ports - ComfyUi</label>
          <input
            type="ports"
            name="ports"
            placeholder="8188"
            required
            className="w-full p-2 mb-4 bg-base-200 rounded focus:outline-none focus:ring-2 focus:ring-neutral"
          />
          <label>Ports - Ollama</label>
          <input
            type="ports"
            name="ports"
            placeholder="11434"
            required
            className="w-full p-2 mb-4 bg-base-200 rounded focus:outline-none focus:ring-2 focus:ring-neutral"
          />
          <label>Host Name</label>
          <input
            type="host"
            name="host"
            placeholder="Host Name"
            required
            className="w-full p-2 mb-4 bg-base-200 rounded focus:outline-none focus:ring-2 focus:ring-neutral"
          />
          <button
            type="submit"
            className="w-full p-2 bg-primary text-primary-content rounded hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-neutral"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
