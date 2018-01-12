const debug = require('debug')('users'),
  faker = require('faker'),
  WebSocket = require('ws'),
  Generator = require('./generator');

// Yes! I know this is bad.
Array.prototype.sample = function() {
  return this[Math.floor(Math.random() * this.length)];
}

class UserGenerator extends Generator {
  constructor() {
    super('/users');

    this.users = [];
    this.actions = ['added', 'deleted', 'changed'];
    this.userKeys = ['name', 'position'];

    this.wss.on('connection', this.onNewConnection.bind(this));
  }

  next() {
    const cmd = this.randomCommand();
    if (cmd.data) {
      this.broadcast(cmd);
    }
  }

  onNewConnection(ws) {
    // TODO: Rewrite
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(this.users));
    }
  }

  // PRIVATE
  randomCommand() {
    const action = this.actions.sample();
    let cmd = {
      action
    };

    switch (action) {
      case 'added': {
        cmd.data = this.createUser();
        break;
      }
      case 'deleted': {
        cmd.data = this.deleteUser();
        break;
      }
      case 'changed': {
        cmd.data = this.changeUser();
        break;
      }
      default:
        break;
    }

    return cmd;
  }

  createUser() {
    const user = {
      id: this.users.length + 1,
      name: faker.name.findName(),
      position: faker.name.jobTitle()
    };
    this.users.push(user);

    return user;
  }

  changeUser() {
    const key = this.userKeys.sample();
    const user = this.users.sample();

    if (user) {
      user[key] = key === 'name' ? faker.name.findName() : faker.name.jobTitle();
      return user;
    } else {
      return null;
    }
  }

  deleteUser() {
    const user = this.users.sample();
    if (user) {
      this.users = this.users.filter((u) => u.id !== user.id);
      return { id: user.id };
    } else {
      return null;
    }
  }
}

module.exports = UserGenerator;
