import { Client } from 'ssh2';
import { getSession } from '@/app/lib/sessionStore';

export async function POST(req) {
  const { token, host, port, username, command } = await req.json();

  const session = getSession(token);
  if (!session) {
    return new Response("Invalid or expired session token.", { status: 401 });
  }

  const { privateKey, passphrase } = session;

  if (!command || typeof command !== "string") {
    return new Response("Command is required and must be a string.", { status: 400 });
  }

  const stream = new ReadableStream({
    start(controller) {
      const conn = new Client();

      conn.on('ready', () => {
        console.log('SSH :: ready');

        conn.exec(command, (err, sshStream) => {
          if (err) {
            controller.enqueue(`ERROR: ${err.message}\n`);
            controller.close();
            conn.end();
            return;
          }

          sshStream.on('data', (data) => {
            controller.enqueue(data.toString());
          });

          sshStream.stderr.on('data', (data) => {
            controller.enqueue(`stderr: ${data.toString()}`);
          });

          sshStream.on('close', (code, signal) => {
            controller.enqueue(`\nCommand finished. Exit code: ${code}\n`);
            controller.close();
            conn.end();
          });
        });
      });

      conn.on('error', (err) => {
        controller.enqueue(`SSH error: ${err.message}\n`);
        controller.close();
      });

      conn.connect({
        host,
        port: parseInt(port) || 22,
        username,
        privateKey,
        passphrase
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache'
    }
  });
}