const debug = require('debug')('coordinates'),
  randomNumber = require('random-number-csprng'),
  Generator = require('./generator');

class CoordinatesGenerator extends Generator {
  constructor() {
    super('/coordinates');
    this.value = { latitude: 0, longitude: 0 };
  }

  async next() {
    this.value.latitude = await randomNumber(this.value.latitude - 10, this.value.latitude + 10);
    this.value.longitude = await randomNumber(this.value.longitude - 10, this.value.longitude + 10);
    this.broadcast(this.value);
  }
}

module.exports = CoordinatesGenerator;
