export async function closeHandler(req, res) {
  if (req.method === 'POST') {
    const { tunnelId } = req.body;
    
    if (!activeTunnels.has(tunnelId)) {
      return res.status(404).json({ error: 'Tunnel not found' });
    }

    const { connection, server } = activeTunnels.get(tunnelId);
    server.close();
    connection.end();
    
    res.status(200).json({ message: 'Tunnel closed' });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}