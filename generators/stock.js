const debug = require('debug')('stock'),
  randomNumber = require('random-number-csprng'),
  Generator = require('./generator');

class StockGenerator extends Generator {
  constructor() {
    super('/stock');
    this.value = 60;
  }

  async next() {
    this.value = await randomNumber(this.value - 10, this.value + 10);
    this.wss.broadcast(this.value);
  }
}

module.exports = StockGenerator;
