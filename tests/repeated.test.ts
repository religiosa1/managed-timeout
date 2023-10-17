import { Timeout } from "../src/Timeout";
const delay = 1000;

describe("repeated calls", ()=>{
  it("returns false on cancelled timeout", () => {
    const to = new Timeout(()=>{}, delay);
    to.cancel();
    expect(to.pause()).toBe(false);
    expect(to.resume()).toBe(false);
    expect(to.cancel()).toBe(false);
    expect(to.reset()).toBe(false);
    expect(to.execute()).toBe(false);
  });

  it("returns false on ended timeout", () => {
    const to = new Timeout(()=>{}, delay);
    jest.advanceTimersByTime(delay);
    expect(to.pause()).toBe(false);
    expect(to.resume()).toBe(false);
    expect(to.cancel()).toBe(false);
    expect(to.reset()).toBe(false);
    expect(to.execute()).toBe(false);
  });

  test("resume does nothing on nonpaused timeout", () => {
    const to = new Timeout(()=>{}, delay);
    const st = to.resume();
    expect(st).toBe(false);
    expect(to.paused).toBe(false);
    expect(to.isPending).toBe(true);
  });

  test("pause does nothing on paused timeout", () => {
    const to = new Timeout(()=>{}, delay);
    to.pause();
    jest.advanceTimersByTime(delay * 0.5);
    const st = to.pause();
    expect(st).toBe(false);
    expect(to.paused).toBe(true);
    expect(to.isPending).toBe(true);
  });
});
