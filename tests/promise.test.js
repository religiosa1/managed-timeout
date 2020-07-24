
const { Timeout, repeatedStart } = require("../dist/timeout");
const { Timer } = require("./Timer");
const delay = 1000;

describe("Promisified calls", ()=> {
  test("promise style start", async () =>{
    let timer = new Timer();
    let to = new Timeout(delay);
    let p = to.start();
    expect(p).toBeInstanceOf(Promise);
    expect(to.isPending).toBe(true);
    expect(to.isStarted).toBe(true);
    expect(to.isFinished).toBe(false);
    timer.advance(delay);
    await p;
    expect(to.isPending).toBe(false);
    expect(to.isStarted).toBe(true);
    expect(to.isFinished).toBe(true);
    expect(timer.diff()).toBeGreaterThanOrEqual(delay);
  });

  it("rejects on repeated calls to strt without args", ()=>{
    let to = new Timeout(delay);
    to.start().catch(()=>{});
    return expect(() => to.start()).rejects.toBe(repeatedStart);
  });

  test("promise style pause", async () =>{
    let timer = new Timer();
    let to = new Timeout(delay);
    let p = to.start();
    to.pause();
    timer.advance(delay);
    to.resume();
    timer.advance(delay);
    await p;
    expect(timer.diff()).toBeGreaterThanOrEqual(delay*2);
  });
});