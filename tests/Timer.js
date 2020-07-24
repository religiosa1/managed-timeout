const MockDate = require('mockdate');

module.exports.Timer = class Timer {
  constructor() {
    this.ot = new Date().getTime();
    this.ct = this.ot;
    MockDate.set(this.ct);
  }
  advance(delay) {
    this.ct += delay;
    MockDate.set(this.ct);
    jest.advanceTimersByTime(delay);
  }
  diff() {
    return this.ct - this.ot;
  }
};