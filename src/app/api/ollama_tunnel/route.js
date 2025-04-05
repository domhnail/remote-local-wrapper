import { Client } from 'ssh2';
import net from 'net';

export async function POST(req) {
    const {
      host,
      port,
      username,
      privateKey,
      passphrase,
      localPort,
      remotePort,
      model,
      prompt,
      stream
    } = await req.json();
  
    if (!host || !port || !username || !privateKey || !model || !prompt) {
      return Response.json({ error: 'Missing required parameters' }, { status: 400 });
    }
  
    const conn = new Client();
    let tunnelServer;
  
    try {
      await new Promise((resolve, reject) => {
        conn.on('ready', () => {
          console.log('SSH Connection Established');
  
          tunnelServer = net.createServer((localSocket) => {
            conn.forwardOut(
              'localhost',
              localPort,
              'localhost',
              remotePort,  // Ollama's API port
              (err, stream) => {
                if (err) return localSocket.end();
                localSocket.pipe(stream).pipe(localSocket);
              }
            );
          });
  
          tunnelServer.listen(localPort, '127.0.0.1', () => {
            resolve();
          });
        });
  
        conn.on('error', reject);
        conn.on('close', () => console.log('SSH Connection Closed'));
  
        conn.connect({
          host,
          port: parseInt(port) || 22,
          username,
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