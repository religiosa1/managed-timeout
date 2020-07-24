const { Timeout } = require("../dist/timeout");
const { Timer } = require("./Timer");
const delay = 1000;

describe("pause-resume functionality", ()=>{
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
})