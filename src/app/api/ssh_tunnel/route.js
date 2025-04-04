import { Client } from 'ssh2';
import net from 'net';
import { readFileSync } from 'fs';

// store active connections to prevent garbage collection
const activeTunnels = new Map();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const {
      host,
      port,
      username,
      privateKey,
      passphrase,
      localPort,
      remoteHost,
      remotePort
    } = req.body;

    // validate parameters
    if (!host || !port || !username || !privateKey) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const conn = new Client();
    let tunnelServer;

    conn.on('ready', () => {
      console.log('SSH Connection Established');

      // create local port forwarding server
      tunnelServer = net.createServer((localSocket) => {
        conn.forwardOut(
          'localhost',
          localPort,
          'localhost',
          remotePort,
          (err, stream) => {
            if (err) return localSocket.end();
            localSocket.pipe(stream).pipe(localSocket);
          }
        );
      });

      tunnelServer.listen(localPort, '127.0.0.1', () => {
        activeTunnels.set(localPort, { conn, tunnelServer });
        res.status(200).json({
          message: `Tunnel created: localhost:${localPort} → desktop:${remotePort}`,
          localPort
        });
      });
    });

    conn.on('error', (err) => {
      console.error('SSH Error:', err);
      cleanupResources();
      res.status(500).json({ error: err.message });
    });

    conn.on('close', () => {
      console.log('SSH Connection Closed');
      cleanupResources();
    });

    const cleanupResources = () => {
      if (tunnelServer) {
        tunnelServer.close();
        console.log('Stopped local server');
      }
      if (activeTunnels.has(conn._sock._handle.fd)) {
        activeTunnels.delete(conn._sock._handle.fd);
      }
    };

    try {
      conn.connect({
        host,
        port: parseInt(port) || 22,
        username,
        privateKey: readFileSync('~'),
        passphrase,
        keepaliveInterval: 30000,
        keepaliveCountMax: 3
      });
    } catch (err) {
      console.error('Connection Error:', err);
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}