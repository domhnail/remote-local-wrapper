import { Client } from 'ssh2';
import { getSession } from '@/app/lib/sessionStore';

export async function POST(req) {
  const { token, host, port, username, command } = await req.json();

  const session = getSession(token);
  if (!session) {
    return Response.json({ error: "Invalid or expired session token" }, { status: 401 });
  }

  const { privateKey, passphrase } = session;

  if (!command || typeof command !== "string") {
    return Response.json({ error: "Invalid command" }, { status: 400 });
  }

  return new Promise((resolve, reject) => {
    const conn = new Client();

    conn.on('ready', () => {
      conn.exec(command, (err, stream) => {
        if (err) {
          conn.end();
          return resolve(Response.json({ error: err.message }, { status: 500 }));
        }

        let output = '';
        stream.on('data', (data) => {
          output += data.toString();
        });

        stream.stderr.on('data', (data) => {
          console.error('stderr:', data.toString());
        });

        stream.on('close', (code, signal) => {
          conn.end();
          return resolve(Response.json({ output }, { status: 200 }));
        });
      });
    });

    conn.on('error', (err) => {
      console.error('SSH error:', err);
      return resolve(Response.json({ error: err.message }, { status: 500 }));
    });

    conn.connect({
      host,
      port: parseInt(port) || 22,
      username,
      privateKey,
      passphrase
    });
  });
}