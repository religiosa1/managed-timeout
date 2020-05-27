const delayError = "Delay argument should be a number >= 0";
export class Timeout {
  private _pending: boolean = true;
  private _canceled: boolean = false;
  private _paused: boolean = false;

  private _delay: number;
  private _timeLeft: number; //< Time left for a timeout for the resume call
  private _to: any; //< setTimeout identifier
  private _startTime: number; //< latest setTimeout call time as returned by Date.getTime()
  private _cb: (...args: any[])=>void; //< timeout callback

  /** schedueles timeout
   * @param {(...args: any[])=>void} cb callback to execute after delay time has passed
   * @param {number} delay delay time in millieseconds
   * @throws {Error} if cb isn't a function or delay isn't a number or less than zero.
   */
  constructor(cb: (...args: any[])=>void, delay: number) {
    if (typeof cb !== "function") {
      throw new Error("Expeting to get a cb function as the first argument");
    }
    if (typeof delay !== "number" || delay < 0) {
      throw new Error(delayError);
    }
    this._delay = delay;
    this._timeLeft = delay;
    this._cb = cb;
    this._run();
  }

  /** True if timeout is pending for execution (actively running or paused) */
  get isPending(): boolean {
    return this._pending;
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
    this._paused = false;
    this._run();
    return true;
  }

  /** Timeout pause/resume status. */
  get paused() {
    return this._paused;
  }
  set paused(val) {
    if (val) {
      this.pause();
    } else {
      this.resume();
    }
  }

  /**
   * Reset the timeout's timer with the previous delay value or a new delay.
   * The timeout will be unpaused and running if it's in the paused state.
   * If the timeout was finished or canceled do nothing, return false.
   * @param {number} [delay] delay time to which reset the timeout (default the same as before)
   * @throws {Error} if delay was supplied and it isn't a number >= 0
   * @return {boolean} status if timeout was reset or not.
   */
  reset(delay?: number): boolean {
    if ( delay == null) { delay = this._delay; }
    if (typeof delay !== "number" || delay < 0) {
      throw new Error(delayError);
    }
    if (!this._pending) { return false; }
    if (this._paused) { this._paused = false; }
    this._halt();
    this._delay = delay;
    this._timeLeft = delay;
    this._run();
    return true;
  }
  /** Current set total delay (from the constructor or consecutive calls to reset) */
  get delay() {
    return this._delay;
  }
}
export default Timeout;