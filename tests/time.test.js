const { Timeout } = require("../dist/timeout");
const { Timer } = require("./Timer");
const delay = 1000;

describe("time containing properties", ()=> {
  test("timeLeft contains correct value", () => {
    const ldelay = delay * 0.57;
    const etl = delay - ldelay;

    let timer = new Timer();

    let to = new Timeout(()=>{}, delay);
    timer.advance(ldelay);

    let tl = to.timeLeft;
    expect(tl).toBeCloseTo(etl);
  });

  test("timePassed contains correct value", () => {
    const ldelay = delay * 0.57;

    let timer = new Timer();

    let to = new Timeout(()=>{}, delay);
    timer.advance(ldelay);

    let tp = to.timePassed;
    expect(tp).toBeCloseTo(ldelay);
  });

  test("timeLeft value doesn't change when paused", ()=>{
    let timer = new Timer();
    let to = new Timeout(() => {}, delay);
    timer.advance(delay*0.25);
    to.pause();
    let timeLeft = to.timeLeft;
    timer.advance(delay*0.25);
    expect(to.timeLeft).toEqual(timeLeft);
  });
});
