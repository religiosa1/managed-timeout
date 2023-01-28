import Timeout from "../src/timeout";
import makeAllToStates from "./makeAllToStates";

describe("cancel", () => {
  const delay = 1000;
  const callback = jest.fn();
  const cancelCb = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  })

  it("allows to cancel a pending timeout", () => {
    const to = new Timeout(delay);
    to.start(callback);

    jest.advanceTimersByTime(delay/2);
    expect(to.state).toBe("pending");
    const result = to.cancel();
    expect(result).toBe(true);
    expect(to.state).toBe("cancelled");
    jest.advanceTimersByTime(delay);
    expect(callback).not.toHaveBeenCalled();
  });

  it("calls a cancel callback supplied to start on cancellation", () => {
    const to = new Timeout(delay);
    to.start(callback, cancelCb);
    const result = to.cancel("test");
    expect(result).toBe(true);
    expect(to.state).toBe("cancelled");
    expect(cancelCb).toHaveBeenCalledWith(to, "test");
    jest.advanceTimersByTime(delay);
    expect(callback).not.toHaveBeenCalled();
  });

  it("on finished timeout calls to cancel does nothing and returns false", () => {
    const to = new Timeout(delay);
    to.start(callback, cancelCb);
    jest.advanceTimersToNextTimer();
    expect(to.state).toBe("resolved");
    const result = to.cancel("test");
    expect(result).toBe(false);
    expect(to.state).toBe("resolved");
    expect(callback).toHaveBeenCalled();
    expect(cancelCb).not.toHaveBeenCalled();
  });

  it("behaves in the expected way on different states of Timeout", () => {
    const states = makeAllToStates((to) => to.cancel());
    expect(states.ready).toBe(true);
    expect(states.pending).toBe(true);
    expect(states.paused).toBe(true);
    expect(states.resolved).toBe(false);
    expect(states.cancelled).toBe(false);
  });
})