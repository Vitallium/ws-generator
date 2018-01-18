const WebSocket = require('ws'),
  glob = require('glob'),
  http = require('http'),
  path = require('path'),
  url = require('url'),
  debug = require('debug')('server'),
  // instances
  server = http.createServer(),
  registeredPaths = {},
  port = process.env.PORT || 3000;

// register generators
glob.sync('./generators/*.js').forEach((generator) => {
  // skip base generator
  if (generator === './generators/generator.js') {
    return;
  }

  // path is '/foo'
  const moduleName = path.basename(generator, '.js');
  registeredPaths[`/${moduleName}`] = new (require(path.resolve(generator)))();
  debug(`Registered module /${moduleName}`);
});

server.on('upgrade', (request, socket, head) => {
  const pathName = url.parse(request.url).pathname;
  debug(`trying to upgrade ${pathName}`);

  if (registeredPaths[pathName]) {
    debug(`found the upgradable path for ${pathName}`)
    registeredPaths[pathName].handle(request, socket, head);
  } else {
    debug(`${pathName} is not found`);
    socket.destroy();
  }
});

server.listen(port, () => {
  debug(`Listening on ${port}`);
});

process.on('uncaughtException', (err) => {
  debug('Whoops! Something went wrong!');
  if (err) {
    debug(err.stack);
  }
});

// // heartbeat
// function noop() {}
// function heartbeat() {
//   this.isAlive = true;
// }
// function should_chuck_kill_it(client) {
//   if (!client.isAlive) {
//     return client.terminate();
//   }

//   client.isAlive = false;
//   client.ping(noop);
// }

// wss.on('connection', (ws) => {
//   ws.isAlive = true;
//   ws.on('pong', heartbeat);
// });

// const intervalId = setInterval(() => {
//   wss.clients.forEach((client) => should_chuck_kill_it(client));
// }, 30000);
