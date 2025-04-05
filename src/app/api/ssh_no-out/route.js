import { Client } from 'ssh2';

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

      //this puts the command into a background terminal
      const backgroundCommand = `nohup ${command} > /dev/null 2>&1 &`; //the second part '> /dev/null 2>&1 &', passes the output from the command into the void
      //executing based on that set up
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