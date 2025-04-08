import { Client } from 'ssh2';
import net from 'net';

import { activeTunnels } from '../_tunnelStore';

export async function POST(req) {
    let {
      host,
      port,
      username,
      privateKey,
      passphrase,
      localPort,
      remoteHost,
      remotePort,
      model,
      prompt,
      stream
    } = await req.json();
  
    if (!model){
      model = "gemma:latest"
    }

    if (!host || !port || !username || !privateKey) {
      console.error("Missing required parameters:");
      console.log("Host:", host);
      console.log("Port:", port);
      console.log("Username:", username);
      console.log("Model:", model);
  
      return Response.json({ error: "Missing required parameters" }, { status: 400 });
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
              remotePort,  // Ollama's API port
              (err, stream) => {
                if (err) return localSocket.end();
                localSocket.pipe(stream).pipe(localSocket);
              }
            );
          });
  
          tunnelServer.listen(localPort, '127.0.0.1', () => {
            resolve();
          }).on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
              console.log("Tunnel already exists on port", localPort);
              resolve(); // don't crash, just move along
            } else {
              reject(err);
            }
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
        message: `Tunnel created for Ollama: localhost:${localPort} → Ollama Server:11434`,
        localPort
      });
  
    } catch (err) {
      return Response.json({ error: err.message }, { status: 500 });
    }
  }