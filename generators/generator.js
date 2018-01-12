const WebSocket = require('ws'),
  debug = require('debug')('generator');

class Generator {
  constructor(path, interval) {
    this.path = path;
    this.interval = interval || 5000;

    this.wss = new WebSocket.Server({ noServer: true });
    this.intervalId = setInterval(this.next.bind(this), this.interval);

    // em? ok.
    this.wss.broadcast = (data) => {
      this.wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      });
    }

    this.wss.on('disconnect', (e) => {
      // TODO: implement me!
      debug('Implement me!');
    });
  }

  get name() {
    return this.path;
  }

  handle(request, socket, head) {
    this.wss.handleUpgrade(request, socket, head, (ws) => {
      this.wss.emit('connection', ws);
    });
  }

  broadcast(data) {
    data = typeof(data) === 'object' ? JSON.stringify(data) : data;
    this.wss.broadcast(data);
  }

  onNewConnection() {
    debug('New connection has been established');
  }

  async next() {
    debug('Implement me!');
  }

  // PRIVATE
  noop() {}
}

module.exports = Generator;
