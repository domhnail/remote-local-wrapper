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
    return Response.json({ error: "Command must be a non-empty string." }, { status: 400 });
  }

  return new Promise((resolve, reject) => {
    const conn = new Client();

    conn.on('ready', () => {
      console.log('Client :: ready');

      //this puts the command into a background terminal
      const backgroundCommand = `nohup ${command} > /dev/null 2>&1 &`;

      //executing based on that setup
      conn.exec(backgroundCommand, (err, stream) => {
        if (err) {
          conn.end();
          return resolve(Response.json({ error: err.message }, { status: 500 }));
        }

        let output = '';
        stream.on('data', (data) => {
          output += data.toString();
        });

        stream.stderr.on('data', (data) => {
          //this is where the thing sits, basically, constantly passing this data, but into the void
          console.error('stderr: ' + data.toString());
        });

        stream.on('close', (code, signal) => {
          //on close we bring it back and log to us
          console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
          conn.end();
          return resolve(Response.json({ output }, { status: 200 }));
        });
      });
    });

    conn.on('error', (err) => {
      //or we error out
      console.error('SSH connection error:', err);
      return resolve(Response.json({ error: err.message }, { status: 500 }));
    });

    //the connection
    conn.connect({
      host,
      port: parseInt(port) || 22,
      username,
      privateKey,
      passphrase
    });
  });
}
