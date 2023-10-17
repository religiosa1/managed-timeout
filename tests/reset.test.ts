import { Timeout } from "../src/Timeout";
const delay = 1000;

describe("reset functionality", ()=>{
  test("reset", () => {
    const callback = jest.fn();
    const to = new Timeout(callback, delay);
    jest.advanceTimersByTime(delay*0.6);
    expect(callback).not.toHaveBeenCalled();
    to.reset();
    jest.advanceTimersByTime(delay*0.6);
    expect(callback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(delay*0.6);
    expect(callback).toHaveBeenCalled();
  });

  test("reset should throw on bad arg in restart", ()=>{
    expect(() => {
      const to = new Timeout(()=>{}, delay);
      // @ts-expect-error wrong arg type error checking
      to.reset("bad");
    }).toThrow();
  });

  test("reset can change delay", () => {
    const newDelay = 800;
    const callback = jest.fn();
    const to = new Timeout(callback, delay);
    expect(to.delay).toBe(delay);
    to.reset(newDelay);
    expect(to.delay).toBe(newDelay);
    jest.advanceTimersByTime(newDelay);
    expect(callback).toHaveBeenCalled();
  });

  test("reset unpauses timeout", () => {
    const callback = jest.fn();
    const to = new Timeout(callback, delay);
    to.pause();
    jest.advanceTimersByTime(delay*1.1);
    expect(callback).not.toHaveBeenCalled();
    to.reset();
    expect(to.paused).toBe(false);
    jest.advanceTimersByTime(delay);
    expect(callback).toHaveBeenCalled();
  });
});