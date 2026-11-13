
const { spawn } = require('child_process');

const processes = new Map();
let shuttingDown = false;

function start(name, file) {
   const child = spawn(process.execPath, [file], {
      cwd: __dirname,
      env: process.env,
      stdio: 'inherit'
   });

   processes.set(name, child);

   child.on('error', error => {
      console.error(`[${name}] Failed to start:`, error);
      shutdown(1);
   });

   child.on('exit', (code, signal) => {
      console.log(`[${name}] Exited: code=${code}, signal=${signal}`);

      if (!shuttingDown) {
         shutdown(code || 1);
      }
   });

   return child;
}

function shutdown(code = 0) {
   if (shuttingDown) return;
   shuttingDown = true;

   console.log('[Launcher] Shutting down all processes...');

   for (const child of processes.values()) {
      if (!child.killed) child.kill('SIGTERM');
   }

   setTimeout(() => {
      for (const child of processes.values()) {
         if (child.exitCode === null) child.kill('SIGKILL');
      }

      process.exit(code);
   }, 7000).unref();
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

start('Audio Server', 'audio-server.js');
start('Discord Bot', 'shard.js');
