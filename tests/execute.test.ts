import { Timeout, TimeoutState } from "../src/Timeout";
import makeAllToStates from "./makeAllToStates";
const delay = 1000;

describe("execute calls", ()=>{
  it("executes successfully calls callback", () => {
    const callback = jest.fn();
    const to = new Timeout(callback, delay);
    expect(callback).not.toHaveBeenCalled();
    to.execute();
    expect(callback).toHaveBeenCalled();
    expect(to.isPending).toBe(false);
    expect(to.isFinished).toBe(true);
    expect(to.isCanceled).toBe(false);
    expect(to.isFinishedPreemptively).toBe(true);
  });

  it("returns true on all states, besides resolved and rejected", () => {
    const states = makeAllToStates((to) => to.execute());
    expect(states).toEqual({
      ready: true,
      pending: true,
      paused: true,
      resolved: false,
      cancelled: false,
    } satisfies Record<TimeoutState, boolean>);
  });
});