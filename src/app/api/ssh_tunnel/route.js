import { Client } from 'ssh2';
import net from 'net';
import { readFileSync } from 'fs';

import { activeTunnels } from '../_tunnelStore';

export async function POST(req) {
  const body = await req.json();

  const {
    host,
    port,
    username,
    privateKey,
    passphrase,
    localPort,
    remoteHost,
    remotePort
  } = body;

  if (!host || !port || !username || !privateKey) {
    return Response.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  const conn = new Client();
  let tunnelServer;

  const cleanupResources = () => {
    if (tunnelServer) {
      tunnelServer.close();
      console.log('Stopped local server');
    }
    activeTunnels.delete(localPort);
  };

  try {
    await new Promise((resolve, reject) => {
      conn.on('ready', () => {
        console.log('SSH Connection Established');

        tunnelServer = net.createServer((localSocket) => {
          conn.forwardOut(
            'localhost',
            localPort,
            remoteHost,
            remotePort,
            (err, stream) => {
              if (err) return localSocket.end();
              localSocket.pipe(stream).pipe(localSocket);
            }
          );
        });

        tunnelServer.listen(localPort, '127.0.0.1', () => {
          activeTunnels.set(localPort, { conn, tunnelServer });
          resolve();
        });
      });

      conn.on('error', (err) => {
        console.error('SSH Error:', err);
        cleanupResources();
        reject(err);
      });

      conn.on('close', () => {
        console.log('SSH Connection Closed');
        cleanupResources();
      });

      conn.connect({
        host,
        port: parseInt(port) || 22,
        username,
        remoteHost,
        privateKey,
        passphrase,
        keepaliveInterval: 30000,
        keepaliveCountMax: 3
      });
    });

    return Response.json({
      message: `Tunnel created: localhost:${localPort} → desktop:${remotePort}`,
      localPort,
      tunnelId: localPort
    });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}