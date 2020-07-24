const { Timeout } = require("../dist/timeout");
const { Timer } = require("./Timer");
const delay = 1000;

describe("execute calls", ()=>{
  test("execute successfully calls callback", () => {
    let callback = jest.fn();
    new Timer();
    let to = new Timeout(callback, delay);
    expect(callback).not.toBeCalled();
    to.execute();
    expect(callback).toBeCalled();
    expect(to.isPending).toBe(false);
    expect(to.isFinished).toBe(true);
    expect(to.isCanceled).toBe(false);
    expect(to.isFinishedPreemptively).toBe(true);
  });
});