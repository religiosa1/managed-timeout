const MockDate = require('mockdate');
const { Timeout } = require("../dist/timeout.js");
const delay = 1000;

beforeEach(() => {
  jest.useFakeTimers();
});

class Timer {
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
}

test("simple timeout execution", () => {
  let to;
  let callback = jest.fn();
  let timer = new Timer();
  to = new Timeout(callback, delay);
  expect(callback).not.toBeCalled();
  timer.advance(delay);
  expect(callback).toBeCalled();
  expect(callback).toHaveBeenCalledTimes(1);
  expect(to.isPending).toBe(false);
  expect(to.isFinished).toBe(true);
  expect(to.isCanceled).toBe(false);
  expect(to.isFinishedPreemptively).toBe(false);
});

it("should throw on bad callback", ()=>{
  expect(() => {
    new Timeout("bad", delay);
  }).toThrow();
});
it("should throw on bad delay", ()=>{
  expect(() => {
    new Timeout(()=>{}, "bad");
  }).toThrow();
});

test("cancelation", () => {
  let callback = jest.fn();
  let timer = new Timer();
  let to = new Timeout(callback, delay);
  to.cancel();
  timer.advance(delay);
  expect(callback).not.toBeCalled();
  expect(to.isPending).toBe(false);
  expect(to.isFinished).toBe(false);
  expect(to.isCanceled).toBe(true);
  expect(to.isFinishedPreemptively).toBe(false);
});

test("pause", () => {
  let callback = jest.fn();
  let timer = new Timer();
  let to = new Timeout(callback, delay);
  to.pause();
  timer.advance(delay);
  expect(callback).not.toBeCalled();
  expect(to.paused).toBe(true);
  expect(to.isPending).toBe(true);
  expect(to.isFinished).toBe(false);
  expect(to.isCanceled).toBe(false);
  expect(to.isFinishedPreemptively).toBe(false);
});

test("resume", () => {
  let callback = jest.fn();
  let timer = new Timer();
  let to = new Timeout(callback, delay);
  timer.advance(delay*0.25);
  to.pause();
  timer.advance(delay);
  expect(callback).not.toBeCalled();
  to.resume();
  expect(to.paused).toBe(false);
  timer.advance(delay);
  expect(callback).toBeCalled();
  expect(to.isPending).toBe(false);
  expect(to.isFinished).toBe(true);
  expect(to.isCanceled).toBe(false);
  expect(to.isFinishedPreemptively).toBe(false);
});

test("pause property set", () => {
  let callback = jest.fn();
  let timer = new Timer();
  let to = new Timeout(callback, delay);
  to.paused = true;
  expect(to.paused).toBe(true);
  timer.advance(delay);
  expect(callback).not.toBeCalled();
  to.paused = false;
  timer.advance(delay);
  expect(callback).toBeCalled();
  expect(to.paused).toBe(false);
  expect(to.isPending).toBe(false);
  expect(to.isFinished).toBe(true);
  expect(to.isCanceled).toBe(false);
  expect(to.isFinishedPreemptively).toBe(false);
});

test("execute", () => {
  let callback = jest.fn();
  new Timer();
  let to = new Timeout(callback, delay);
  expect(callback).not.toBeCalled();
  to.execute();
  expect(callback).toBeCalled();
  expect(to.isPending).toBe(false);
  expect(to.isFinished).toBe(true);
  expect(to.isCanceled).toBe(false);
  expect(to.isFinishedPreemptively).toBe(true);
});

test("reset", () => {
  let callback = jest.fn();
  let timer = new Timer();
  let to = new Timeout(callback, delay);
  timer.advance(delay*0.6);
  expect(callback).not.toBeCalled();
  to.reset();
  timer.advance(delay*0.6);
  expect(callback).not.toBeCalled();
  timer.advance(delay*0.6);
  expect(callback).toBeCalled();
});

test("reset should throw on bad arg in restart", ()=>{
  expect(() => {
    let to = new Timeout(()=>{}, delay);
    to.reset("bad");
  }).toThrow();
});

test("reset can change delay", () => {
  const newDelay = 800;
  let callback = jest.fn();
  let timer = new Timer();
  let to = new Timeout(callback, delay);
  expect(to.delay).toBe(delay);
  to.reset(newDelay);
  expect(to.delay).toBe(newDelay);
  timer.advance(newDelay);
  expect(callback).toBeCalled();
});

test("reset unpauses timeout", () => {
  const newDelay = 800;
  let callback = jest.fn();
  let timer = new Timer();
  let to = new Timeout(callback, delay);
  to.pause();
  timer.advance(delay*1.1);
  expect(callback).not.toBeCalled();
  to.reset();
  expect(to.paused).toBe(false);
  timer.advance(delay);
  expect(callback).toBeCalled();
});

test("timeLeft", () => {
  const ldelay = delay * 0.57;
  const etl = delay - ldelay;

  let timer = new Timer();

  let to = new Timeout(()=>{}, delay);
  timer.advance(ldelay);

  let tl = to.timeLeft;
  expect(tl).toBeCloseTo(etl);
});

test("timePassed", () => {
  const ldelay = delay * 0.57;

  let timer = new Timer();

  let to = new Timeout(()=>{}, delay);
  timer.advance(ldelay);

  let tp = to.timePassed;
  expect(tp).toBeCloseTo(ldelay);
});

test("timeLeft value doesn't change when paused", ()=>{
  let timer = new Timer();
  let to = new Timeout(() => {}, delay);
  timer.advance(delay*0.25);
  to.pause();
  let timeLeft = to.timeLeft;
  timer.advance(delay*0.25);
  expect(to.timeLeft).toEqual(timeLeft);
});

test("returns false on cancelled", () => {
  let to = new Timeout(()=>{}, delay);
  to.cancel();
  expect(to.pause()).toBe(false);
  expect(to.resume()).toBe(false);
  expect(to.cancel()).toBe(false);
  expect(to.reset()).toBe(false);
  expect(to.execute()).toBe(false);
});

test("returns false on ended", () => {
  let timer = new Timer();
  let to = new Timeout(()=>{}, delay);
  timer.advance(delay);
  expect(to.pause()).toBe(false);
  expect(to.resume()).toBe(false);
  expect(to.cancel()).toBe(false);
  expect(to.reset()).toBe(false);
  expect(to.execute()).toBe(false);
});

test("resume does nothing on nonpaused timeout", () => {
  let to = new Timeout(()=>{}, delay);
  let st = to.resume();
  expect(st).toBe(false);
  expect(to.paused).toBe(false);
  expect(to.isPending).toBe(true);
});

test("pause does nothing on paused timeout", () => {
  let timer = new Timer();
  let to = new Timeout(()=>{}, delay);
  to.pause();
  timer.advance(delay * 0.5);
  let st = to.pause();
  expect(st).toBe(false);
  expect(to.paused).toBe(true);
  expect(to.isPending).toBe(true);
});