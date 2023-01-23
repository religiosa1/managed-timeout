const { Timeout } = require("../dist/timeout");
const { Timer } = require("./Timer");
const delay = 1000;

describe("delayed start execution", ()=>{
  test("basic delayed execution", ()=>{
    let timer = new Timer();
    let callback = jest.fn();
    let to = new Timeout(delay);
    timer.advance(delay);
    expect(to.isPending).toBe(false);
    expect(to.isStarted).toBe(false);
    to.start(callback);
    expect(to.isPending).toBe(true);
    expect(to.isStarted).toBe(true);
    expect(to.isFinished).toBe(false);
    expect(callback).not.toBeCalled();
    timer.advance(delay);
    expect(to.isPending).toBe(false);
    expect(to.isStarted).toBe(true);
    expect(to.isFinished).toBe(true);
    expect(callback).toBeCalledWith(to);
  });

  test("delayed execution bad callback", ()=>{
    expect(() => {
      new Timeout(delay).start("bad");
    }).toThrow()
  });

  test("reset on a non-started timeout only changes delay and timeLeft", ()=>{
    let timer = new Timer();
    let to = new Timeout(delay);
    let callback = jest.fn();
    expect(to.delay).toBe(delay);
    to.reset(delay*2);
    expect(to.delay).toBe(delay*2);
    expect(to.timeLeft).toBe(delay*2);
    expect(to.isStarted).toBe(false);
    expect(to.isPending).toBe(false);
    to.start(callback);
    timer.advance(delay);
    expect(callback).not.toBeCalled();
    timer.advance(delay);
    expect(callback).toBeCalledWith(to);
  });

  test("returns false on repeated start calls with args", ()=>{
    let to = new Timeout(delay);
    to.start();
    expect(to.start(()=>{})).toBe(false);
  })
});