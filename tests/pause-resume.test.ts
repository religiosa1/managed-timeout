import { Timeout } from "../src/Timeout";
const delay = 1000;

describe("pause-resume functionality", ()=>{
  test("pause", () => {
    const callback = jest.fn();
    const to = new Timeout(callback, delay);
    to.pause();
    jest.advanceTimersByTime(delay);
    expect(callback).not.toHaveBeenCalled();
    expect(to.paused).toBe(true);
    expect(to.isPending).toBe(true);
    expect(to.isFinished).toBe(false);
    expect(to.isCanceled).toBe(false);
    expect(to.isFinishedPreemptively).toBe(false);
  });

  test("resume", () => {
    const callback = jest.fn();
    const to = new Timeout(callback, delay);
    jest.advanceTimersByTime(delay*0.25);
    to.pause();
    jest.advanceTimersByTime(delay);
    expect(callback).not.toHaveBeenCalled();
    to.resume();
    expect(to.paused).toBe(false);
    jest.advanceTimersByTime(delay);
    expect(callback).toHaveBeenCalled();
    expect(to.isPending).toBe(false);
    expect(to.isFinished).toBe(true);
    expect(to.isCanceled).toBe(false);
    expect(to.isFinishedPreemptively).toBe(false);
  });

  test("pause property set", () => {
    const callback = jest.fn();
    const to = new Timeout(callback, delay);
    to.paused = true;
    expect(to.paused).toBe(true);
    jest.advanceTimersByTime(delay);
    expect(callback).not.toHaveBeenCalled();
    to.paused = false;
    jest.advanceTimersByTime(delay);
    expect(callback).toHaveBeenCalled();
    expect(to.paused).toBe(false);
    expect(to.isPending).toBe(false);
    expect(to.isFinished).toBe(true);
    expect(to.isCanceled).toBe(false);
    expect(to.isFinishedPreemptively).toBe(false);
  });
})