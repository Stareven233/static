// https://github.com/mscdex/ssh2#execute-uptime-on-a-server
import { Client } from 'ssh2'

export default function sshConnect(command, send_func) {
  const conn = new Client()
  conn.on('ready', () => {
    console.log('Client :: ready');
      conn.exec(command, (err, stream) => {
      if (err) throw err;
      stream.on('close', (code, signal) => {
        console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
        conn.end();
      }).on('data', (data) => {
        console.log('STDOUT: ' + data.toString());
        send_func(data)
      }).stderr.on('data', (data) => {
        console.log('STDERR: ' + data);
      })
    })
  }).connect({
    host: '172.17.174.1',
    port: 22,
    username: 'root',
    password: 'root'
  })
}
