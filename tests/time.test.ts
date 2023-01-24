import { Timeout } from "../src/timeout";
const delay = 1000;

describe("time containing properties", ()=> {
  test("timeLeft contains correct value", () => {
    const ldelay = delay * 0.57;
    const etl = delay - ldelay;

    const to = new Timeout(()=>{}, delay);
    jest.advanceTimersByTime(ldelay);

    const tl = to.timeLeft;
    expect(tl).toBeCloseTo(etl);
  });

  test("timePassed contains correct value", () => {
    const ldelay = delay * 0.57;

    const to = new Timeout(()=>{}, delay);
    jest.advanceTimersByTime(ldelay);

    const tp = to.timePassed;
    expect(tp).toBeCloseTo(ldelay);
  });

  test("timeLeft value doesn't change when paused", ()=>{
    const to = new Timeout(() => {}, delay);
    jest.advanceTimersByTime(delay*0.25);
    to.pause();
    const timeLeft = to.timeLeft;
    jest.advanceTimersByTime(delay*0.25);
    expect(to.timeLeft).toEqual(timeLeft);
  });
});
