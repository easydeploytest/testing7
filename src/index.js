const http = require('http');

const PORT = process.env.PORT || 3000;
const APP  = process.env.OTEL_SERVICE_NAME || 'acme';
const ENV  = process.env.DEPLOYMENT_ENV || 'dev';
const GREETING = process.env.GREETING || 'Hello from EasyDeploy!';

const server = http.createServer((req, res) => {
  if (req.url === '/healthz') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    app: APP,
    env: ENV,
    message: GREETING,
    time: new Date().toISOString(),
  }));

  console.log(JSON.stringify({ level: 'info', msg: 'request', method: req.method, path: req.url, app: APP, env: ENV }));
});

server.listen(PORT, () => {
  console.log(JSON.stringify({ level: 'info', msg: 'server started', port: PORT, app: APP, env: ENV }));
});
