import { Timeout } from "../src/Timeout";
const delay = 1000;

describe("pause-resume functionality", ()=>{
  describe("pause", () => {
    it("prevents timeout resolution", () => {
      const callback = jest.fn();
      const to = new Timeout(callback, delay);
      to.pause();
      jest.advanceTimersByTime(delay);
      expect(callback).not.toHaveBeenCalled();
    });

    it("correctly updates timeout state", () => {
      const callback = jest.fn();
      const to = new Timeout(callback, delay);
      to.pause();  
      expect(to.paused).toBe(true);
      expect(to.isPending).toBe(true);
      expect(to.isFinished).toBe(false);
      expect(to.isCanceled).toBe(false);
      expect(to.isFinishedPreemptively).toBe(false);
    });
  });

  describe("resume", () => {
    it("allows timeout to continue execution", () => {
      const callback = jest.fn();
      const to = new Timeout(callback, delay);
      jest.advanceTimersByTime(delay*0.25);
      to.pause();
      jest.advanceTimersByTime(delay);
      expect(callback).not.toHaveBeenCalled();
      to.resume();
      jest.advanceTimersByTime(delay*0.75);
      expect(callback).toHaveBeenCalled();
    });

    it("resumed timeouts resolves normally", () => {
      const callback = jest.fn();
      const to = new Timeout(callback, delay);
      jest.advanceTimersByTime(delay*0.25);
      to.pause();
      jest.advanceTimersByTime(delay);
      expect(callback).not.toHaveBeenCalled();
      to.resume();
      jest.advanceTimersByTime(delay*0.75);
      expect(to.paused).toBe(false);
      expect(to.isPending).toBe(false);
      expect(to.isCanceled).toBe(false);
      expect(to.isFinished).toBe(true);
      expect(to.isFinishedPreemptively).toBe(false);
    });

    it("resumes from the place where it ended last", () => {
      const callback = jest.fn();
      const to = new Timeout(callback, delay);
      jest.advanceTimersByTime(delay*0.25);
      to.pause();
      jest.advanceTimersByTime(delay);
      const timeLeft = to.timeLeft;
      expect(timeLeft).toBe(delay * 0.75);
      to.resume();
      expect(to.timeLeft).toBe(timeLeft);
    });

    it("correctly updates timeout state", () => {
      const callback = jest.fn();
      const to = new Timeout(callback, delay);
      jest.advanceTimersByTime(delay*0.25);
      to.pause();
      jest.advanceTimersByTime(delay);
      to.resume();
      expect(to.paused).toBe(false);
      expect(to.isPending).toBe(true);
      expect(to.isFinished).toBe(false);
      expect(to.isCanceled).toBe(false);
      expect(to.isFinishedPreemptively).toBe(false);
    });
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