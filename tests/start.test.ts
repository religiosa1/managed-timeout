import { Timeout }  from "../src/timeout";
const delay = 1000;

describe("delayed start execution", ()=>{
  test("basic delayed execution", ()=>{
    const callback = jest.fn();
    const to = new Timeout(delay);
    jest.advanceTimersByTime(delay);
    expect(to.isPending).toBe(false);
    expect(to.isStarted).toBe(false);
    to.start(callback);
    expect(to.isPending).toBe(true);
    expect(to.isStarted).toBe(true);
    expect(to.isFinished).toBe(false);
    expect(callback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(delay);
    expect(to.isPending).toBe(false);
    expect(to.isStarted).toBe(true);
    expect(to.isFinished).toBe(true);
    expect(callback).toHaveBeenCalledWith(to);
  });

  test("delayed execution bad callback", ()=>{
    expect(() => {
      // @ts-expect-error bad argument type error check
      new Timeout(delay).start("bad");
    }).toThrow()
  });

  test("reset on a non-started timeout only changes delay and timeLeft", ()=>{
    const to = new Timeout(delay);
    const callback = jest.fn();
    expect(to.delay).toBe(delay);
    to.reset(delay*2);
    expect(to.delay).toBe(delay*2);
    expect(to.timeLeft).toBe(delay*2);
    expect(to.isStarted).toBe(false);
    expect(to.isPending).toBe(false);
    to.start(callback);
    jest.advanceTimersByTime(delay);
    expect(callback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(delay);
    expect(callback).toHaveBeenCalledWith(to);
  });

  test("returns false on repeated start calls with args", ()=>{
    const to = new Timeout(delay);
    to.start();
    expect(to.start(()=>{})).toBe(false);
  })
});