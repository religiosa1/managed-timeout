export const callbackError = "Expeting to get a cb function as the first argument";
export const delayError = "Delay argument should be a number >= 0";
export const repeatedStart = "Timeout was already started";

export class Timeout {
  private _pending: boolean = false;
  private _canceled: boolean = false;
  private _paused: boolean = false;

  private _delay: number;
  private _timeLeft: number; //< Time left for a timeout for the resume call
  private _to: any; //< setTimeout identifier
  private _startTime: number; //< latest setTimeout call time as returned by Date.getTime()
  private _cb: (...args: any[])=>void; //< timeout callback

 /** Timeout constructor, without scheduling a callback.
   * Callback must be provided later with the start function.
   * @param {number} delay delay time in millieseconds
   * @throws {Error} if cb isn't a function or a number or if delay isn't a number or less than zero.
   */
  constructor(delay: number);
  /** Timeout constructor, schedueles timeout is callback is provided.
   * @param {(...args: any[])=>void } cb callback to execute after delay time has passed, or delay time in millieseconds
   * @param {number} delay delay time in millieseconds
   * @throws {Error} if cb isn't a function or a number or if delay isn't a number or less than zero.
   */
  constructor(cb: ((...args: any[])=>void), delay: number);
  constructor(cb_or_delay: ((...args: any[])=>void) | number , delay?: number) {
    const d = (typeof cb_or_delay === "number") ? cb_or_delay : delay;
    if (typeof d !== "number" || d < 0) {
      throw new Error(delayError);
    }
    this._delay = d;
    this._timeLeft = d;

    if (typeof cb_or_delay !== "number") {
      this.start(cb_or_delay);
    }
  }

  /** True if timeout is pending for execution (actively running or paused) */
  get isPending(): boolean {
    return this._pending;
  }
  /** True if timeout was started */
  get isStarted(): boolean {
    return this._startTime != null;
  }
  /** True if timeout was canceled */
  get isCanceled(): boolean {
    return this._canceled;
  }
  /** True if timeout was finished (normally or preemptively) */
  get isFinished(): boolean {
    return !this.isPending && !this._canceled;
  }
  /** True if timeout was finished preemptively */
  get isFinishedPreemptively(): boolean {
    return this.isFinished && this._timeLeft > 0;
  }
  /** Time left (in ms) before the timeout execution */
  get timeLeft(): number {
    if (!this._pending || this._paused) {
      return this._timeLeft;
    } else {
      return  this._delay - (new Date().getTime() - this._startTime);
    }
  }
  /** Number of milliseconds of delay time passed. */
  get timePassed(): number {
    return this._delay - this.timeLeft;
  }

  private _run() {
    this._startTime = new Date().getTime();
    this._pending = true;
    this._canceled = false;
    this._paused = false;
    this._to = setTimeout(()=>{
      this._to = null;
      this._pending = false;
      this._timeLeft = 0;
      this._cb();
    }, this._timeLeft);
  }
  private _halt() {
    if (this._to) {
      clearTimeout(this._to);
      this._to = null;
    }
    this._timeLeft = this.timeLeft;
  }

  /** Starts a timeout created without a callback.
   * @returns a Promise, resolving after the delay time has passed.
   */
  start(): Promise<void>;
  /** Starts a timeout created without a callback.
   * @param cb callback to be called after the delay time has passed.
   * @returns true if callback was successfully started, false otherwise.
   */
  start(cb: (...args: any[])=>void): boolean;
  start(cb?: (...args: any[])=>void): boolean | Promise<void> {
    if (cb != null) {
      if (typeof cb !== "function") { throw new Error(callbackError); }
      if (this._pending) { return false; }
      this._cb = cb;
      this._run();
      return true;
    } else {
      return new Promise((resolve, reject) => {
        if (this._pending) { return reject(repeatedStart); }
        this._cb = resolve;
        this._run();
      });
    }
  }

  /** Cancels the timeout completely.
   * @returns {boolean} true if the timeout was stopped, false if it wasn't pending to begin with
   */
  cancel(): boolean {
    if (!this._pending) { return false; }
    this._halt();
    this._pending = false;
    this._canceled = true;
    return true;
  }

  /** Execute pending timeout's CB preemptively, without waiting for the delay time and finishing it.
   * Repeated invokations won't run the cb, and false would be returned instead.
   * @returns {boolean} true if the timeout was finished, false if it was already finished or canceled before
   */
  execute(): boolean {
    if (!this._pending) { return false; }
    this._halt();
    this._pending = false;
    this._cb();
    return true;
  }

  /** Pauses the timeout.
   * If it was already paused do nothing.
   * @returns {boolean} true if the timeout was paused, false otherwise.
   */
  pause(): boolean {
    if (!this._pending || this._paused) { return false; }
    this._halt();
    this._paused = true;
    return true;
  }

  /** Resumes the paused timeout.
   * If it wasn't paused do nothing.
   * @returns {boolean} true if the timeout was resumed, false otherwise.
   */
  resume(): boolean {
    if (!this._pending || !this._paused) { return false; }
    this._run();
    return true;
  }

  /** Timeout pause/resume status. */
  get paused(): boolean {
    return this._paused;
  }
  set paused(val: boolean) {
    if (val) {
      this.pause();
    } else {
      this.resume();
    }
  }

  /**
   * Reset the timeout's delay with the previous delay value or a new one.
   * The timeout will be unpaused and running if it's in the paused state.
   * If the timeout was finished or canceled do nothing, return false.
   * If timeout wasn't started just changes the delay time.
   * @param {number} [delay] delay time to which reset the timeout (default the same as before)
   * @throws {Error} if delay was supplied and it isn't a number >= 0
   * @return {boolean} status if timeout was reset or not.
   */
  reset(delay?: number): boolean {
    if ( delay == null) { delay = this._delay; }
    if (typeof delay !== "number" || delay < 0) {
      throw new Error(delayError);
    }
    if (this.isStarted) {
      if (!this.isPending) { return false; }
      this._halt();
      this._delay = delay;
      this._timeLeft = delay;
      this._run();
    } else {
      this._delay = delay;
      this._timeLeft = delay;
    }
    return true;
  }
  /** Current set total delay (from the constructor or consecutive calls to reset) */
  get delay(): number {
    return this._delay;
  }
}
export default Timeout;