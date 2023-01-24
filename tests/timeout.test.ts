import { Timeout } from "../src/timeout";
const delay = 1000;

describe("basic usage", ()=> {
  test("simple timeout execution", () => {
    const callback = jest.fn();
    const to = new Timeout(callback, delay);
    expect(to.isStarted).toBe(true);
    expect(callback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(delay);
    expect(callback).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledTimes(1);
    expect(to.isPending).toBe(false);
    expect(to.isFinished).toBe(true);
    expect(to.isCanceled).toBe(false);
    expect(to.isFinishedPreemptively).toBe(false);
  });

  it("should throw on bad callback", ()=>{
    expect(() => {
      // @ts-expect-error bad argument type error check
      new Timeout("bad", delay);
    }).toThrow();
  });
  it("should throw on bad delay", ()=>{
    expect(() => {
      // @ts-expect-error bad argument type error check
      new Timeout(()=>{}, "bad");
    }).toThrow();
  });

  test("cancelation", () => {
    const callback = jest.fn();
    const to = new Timeout(callback, delay);
    to.cancel();
    jest.advanceTimersByTime(delay);
    expect(callback).not.toHaveBeenCalled();
    expect(to.isPending).toBe(false);
    expect(to.isFinished).toBe(false);
    expect(to.isCanceled).toBe(true);
    expect(to.isFinishedPreemptively).toBe(false);
  });
});