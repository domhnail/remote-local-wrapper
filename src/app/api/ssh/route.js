import { Client } from 'ssh2';
import { readFileSync } from 'fs';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const {       
      host,
      port,
      username,
      privateKey,
      passphrase,
      command
    } = req.body;

    const conn = new Client();

    conn.on('ready', () => {
      console.log('Client :: ready');
      conn.exec(command, (err, stream) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }

        let output = '';
        stream.on('data', (data) => {
          output += data.toString();
        });

        stream.on('close', (code, signal) => {
          console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
          res.status(200).json({ output });
          conn.end();
        });
      });
    }).on('error', (err) => {
      console.error('SSH connection error:', err);
      res.status(500).json({ error: err.message });
    }).connect({
      host,      // IP/domain of the remote
      port,  // SSH port
      username,  // username for the SSH login
      privateKey, // private key on local
      passphrase,  // password for the user 
    });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

