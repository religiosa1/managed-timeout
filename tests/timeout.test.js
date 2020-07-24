const { Timeout } = require("../dist/timeout");
const { Timer } = require("./Timer");
const delay = 1000;

describe("basic usage", ()=> {
  test("simple timeout execution", () => {
    let to;
    let callback = jest.fn();
    let timer = new Timer();
    to = new Timeout(callback, delay);
    expect(to.isStarted).toBe(true);
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
});