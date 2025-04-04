import { activeTunnels } from "../_tunnelStore";

export async function POST(req) {
  const { tunnelId } = await req.json();

  if (!activeTunnels.has(tunnelId)) {
    return Response.json({ error: 'Tunnel not found' }, { status: 404 });
  }

  const { connection, server } = activeTunnels.get(tunnelId);
  server.close();
  connection.end();
  activeTunnels.delete(tunnelId);

  return Response.json({ message: 'Tunnel closed' }, { status: 200 });
}