import makeAllToStates from "./makeAllToStates";

describe("makeAllToStates", () => {
  it("returns all the possible timeout for testing", () => {
    const states = makeAllToStates();
    expect(states.ready.state).toBe("ready");
    expect(states.pending.state).toBe("pending");
    expect(states.paused.state).toBe("paused");
    expect(states.resolved.state).toBe("resolved");
    expect(states.cancelled.state).toBe("cancelled");
  });

  it("allows to map the timeouts to some value", () => {
    const states = makeAllToStates((to) => to.state);
    expect(states.ready).toBe("ready");
    expect(states.pending).toBe("pending");
    expect(states.paused).toBe("paused");
    expect(states.resolved).toBe("resolved");
    expect(states.cancelled).toBe("cancelled");
  });
});