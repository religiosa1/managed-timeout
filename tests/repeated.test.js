const { Timeout } = require("../dist/timeout");
const { Timer } = require("./Timer");
const delay = 1000;

describe("repeated calls", ()=>{
  it("returns false on cancelled timeout", () => {
    let to = new Timeout(()=>{}, delay);
    to.cancel();
    expect(to.pause()).toBe(false);
    expect(to.resume()).toBe(false);
    expect(to.cancel()).toBe(false);
    expect(to.reset()).toBe(false);
    expect(to.execute()).toBe(false);
  });

  it("returns false on ended timeout", () => {
    let timer = new Timer();
    let to = new Timeout(()=>{}, delay);
    timer.advance(delay);
    expect(to.pause()).toBe(false);
    expect(to.resume()).toBe(false);
    expect(to.cancel()).toBe(false);
    expect(to.reset()).toBe(false);
    expect(to.execute()).toBe(false);
  });

  test("resume does nothing on nonpaused timeout", () => {
    let to = new Timeout(()=>{}, delay);
    let st = to.resume();
    expect(st).toBe(false);
    expect(to.paused).toBe(false);
    expect(to.isPending).toBe(true);
  });

  test("pause does nothing on paused timeout", () => {
    let timer = new Timer();
    let to = new Timeout(()=>{}, delay);
    to.pause();
    timer.advance(delay * 0.5);
    let st = to.pause();
    expect(st).toBe(false);
    expect(to.paused).toBe(true);
    expect(to.isPending).toBe(true);
  });
});
