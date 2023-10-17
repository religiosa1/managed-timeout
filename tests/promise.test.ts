import { Timeout } from "../src/Timeout";
import { repeatedStart, abort } from "../src/ErrorMessages";
const delay = 1000;

describe("Promisified calls", ()=> {
  test("promise style start", async () =>{
    const to = new Timeout(delay);
    const p = to.start();
    expect(p).toBeInstanceOf(Promise);
    expect(to.isPending).toBe(true);
    expect(to.isStarted).toBe(true);
    expect(to.isFinished).toBe(false);
    jest.advanceTimersByTime(delay);
    await p;
    expect(to.isPending).toBe(false);
    expect(to.isStarted).toBe(true);
    expect(to.isFinished).toBe(true);
  });

  it("rejects on repeated calls to strt without args", async ()=>{
    const to = new Timeout(delay);
    to.start();
    const prms = to.start();
    await expect(prms).rejects.toThrow(repeatedStart);
  });

  it("rejects on cancellation", async () => {
    const to = new Timeout(delay);
    const prms = to.start();
    to.cancel();
    await expect(prms).rejects.toThrow(abort);
  });

  test("promise style pause", async () =>{
    const to = new Timeout(delay);
    const p = to.start();
    to.pause();
    jest.advanceTimersByTime(delay);
    to.resume();
    jest.advanceTimersByTime(delay);
    await expect(p).resolves.toBe(to);
  });

  it("resolves with timeout as its value", async () => {
    const to = new Timeout(delay);
    const prms = to.start();
    jest.advanceTimersByTime(delay);
    await expect(prms).resolves.toBe(to);
  });
});