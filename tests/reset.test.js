const { Timeout } = require("../dist/timeout");
const { Timer } = require("./Timer");
const delay = 1000;

describe("reset functionality", ()=>{
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
});