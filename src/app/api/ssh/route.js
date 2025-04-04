import { Client } from 'ssh2';
import { readFileSync } from 'fs';

export async function POST(req) {
  const {
    host,
    port,
    username,
    privateKey,
    passphrase,
    command
  } = await req.json();

  return new Promise((resolve, reject) => {
    const conn = new Client();

    conn.on('ready', () => {
      console.log('Client :: ready');
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
          console.error('stderr: ' + data.toString());
        });

        stream.on('close', (code, signal) => {
          console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
          conn.end();
          return resolve(Response.json({ output }, { status: 200 }));
        });
      });
    });
    conn.on('error', (err) => {
      console.error('SSH connection error:', err);
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