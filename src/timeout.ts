import { AbortError } from "./AbortError";
import * as ErrorMsg from "./ErrorMessages";

export type TimeoutState = "ready" | "pending" | "paused" | "resolved" | "cancelled";
export class Timeout {
  #state: TimeoutState = "ready";

  #delay: number;
  /** Time left for a timeout for the resume call (after it was paused) */
  #timeLeft: number;
  /** setTimeout identifier */
  #to: ReturnType<typeof setTimeout> | null = null;
  /** latest setTimeout call time as returned by Date.getTime() */
  #startTime: number | undefined;
  /** timeout callback */
  #cb: ((to: Timeout)=>void) | null = null;
  /** Promise cancellation callback */
  #reject: ((reason: unknown) => void) | null = null;

 /** Timeout constructor, without scheduling a callback.
   * Callback must be provided later with the start function.
   * @param delay delay time in millieseconds
   * @throws {Error} if cb isn't a function or a number or if delay isn't a number or less than zero.
   */
  constructor(delay: number);
  /** Timeout constructor, schedueles timeout is callback is provided.
   * @param cb callback to execute after delay time has passed, or delay time in millieseconds
   * @param delay delay time in millieseconds
   * @throws {Error} if cb isn't a function or a number or if delay isn't a number or less than zero.
   */
  constructor(cb: ((to: Timeout) => void), delay: number);
  constructor(
    cb_or_delay: ((to: Timeout) => void) | number,
    delay?: number,
  ) {
    const d = (typeof cb_or_delay === "number") ? cb_or_delay : delay;
    if (typeof d !== "number" || !Number.isInteger(d) || d < 0) {
      throw new Error(ErrorMsg.delay);
    }
    this.#delay = d;
    this.#timeLeft = d;

    if (typeof cb_or_delay !== "number") {
      this.start(cb_or_delay);
    }
  }

  get state(): TimeoutState {
    return this.#state;
  }

  /** True if timeout is pending for execution (actively running or paused) */
  get isPending(): boolean {
    return this.#state === "pending" || this.#state === "paused";
  }
  /** True if timeout was started */
  get isStarted(): boolean {
    return this.#startTime != null;
  }
  /** True if timeout was canceled */
  get isCanceled(): boolean {
    return this.#state === "cancelled";
  }
  /** True if timeout was finished (normally or preemptively) */
  get isFinished(): boolean {
    return this.#state === "resolved";
  }
  /** True if timeout was finished preemptively */
  get isFinishedPreemptively(): boolean {
    return this.#state === "resolved" && this.#timeLeft > 0;
  }
  /** Time left (in ms) before the timeout execution */
  get timeLeft(): number {
    if (this.#state !== "pending") {
      return this.#timeLeft;
    }
    return this.#calculateTimeLeft();
  }
  /** Number of milliseconds of delay time passed. */
  get timePassed(): number {
    return this.#delay - this.timeLeft;
  }

  /** Timeout pause/resume status. */
  get paused(): boolean {
    return this.#state === "paused";
  }
  set paused(val: boolean) {
    if (val) {
      this.pause();
    } else {
      this.resume();
    }
  }

  /** Current set total delay (from the constructor or consecutive calls to reset) */
  get delay(): number {
    return this.#delay;
  }

  /** Starts a timeout created without a callback.
   * @returns a Promise, resolving after the delay time has passed.
   */
  start(): Promise<Timeout>;
  /** Starts a timeout created without a callback.
   * @param cb callback to be called after the delay time has passed.
   * @param cancelCb optional callback to be called if timeout is cancelled.
   * @returns true if callback was successfully started, false otherwise.
   */
  start(
    cb: (to: Timeout)=>void,
    cancelCb?: (to: Timeout, reason: unknown) => void
  ): boolean;
  start(
    cb?: (to: Timeout) => void,
    cancelCb?: (to: Timeout, reason: unknown) => void
  ): Promise<Timeout> | boolean {
    if (cb != null) {
      if (typeof cb !== "function") { throw new Error(ErrorMsg.callback); }
      if (this.isPending) {
        return false;
      }
      this.#cb = cb;
      this.#reject = (reason: unknown) => cancelCb?.(this, reason);
      this.#run();
      return true;
    } else {
      return new Promise((resolve, reject) => {
        if (this.isPending) {
          return reject(new Error(ErrorMsg.repeatedStart));
        }
        this.#cb = () => resolve(this);
        this.#reject = (reason: unknown) => reject(reason);
        this.#run();
      });
    }
  }

  /** Cancels the timeout completely.
   * @returns true if the timeout was stopped, false if it wasn't pending to begin with
   */
  cancel(reason: unknown = new AbortError(ErrorMsg.abort)): boolean {
    if (this.isFinished || this.isCanceled) { return false; }
    this.#halt();
    this.#state = "cancelled";
    this.#reject?.(reason);
    return true;
  }

  /** Execute pending timeout's CB preemptively, without waiting for the delay time and finishing it.
   * Repeated invokations won't run the cb, and false would be returned instead.
   * @returns {boolean} true if the timeout was finished, false if it was already finished or canceled before
   */
  execute(): boolean {
    if (this.isFinished || this.isCanceled) { return false; }
    this.#halt();
    this.#state = "resolved";
    // we need to check cb here, as one run execute right after the constructor call, without start
    this.#cb?.(this);
    return true;
  }

  /** Pauses the timeout.
   * If it was already paused do nothing.
   * @returns {boolean} true if the timeout was paused, false otherwise.
   */
  pause(): boolean {
    if (this.#state !== "pending") { return false; }
    this.#halt();
    this.#state = "paused";
    return true;
  }

  /** Resumes the paused timeout.
   * If it wasn't paused do nothing.
   * @returns {boolean} true if the timeout was resumed, false otherwise.
   */
  resume(): boolean {
    if (this.#state !== "paused") { return false; }
    this.#run();
    return true;
  }

  /**
   * Reset the timeout's delay with the previous delay value or a new one.
   * The timeout will be unpaused and running if it's in the paused state.
   * If the timeout was finished or canceled do nothing, return false.
   * If timeout wasn't started just changes the delay time.
   * @param delay time to which reset the timeout (default the same as before)
   * @throws {Error} if delay was supplied and it isn't a number >= 0
   * @return status if timeout was reset or not.
   */
  reset(delay?: number): boolean {
    if ( delay == null) { delay = this.#delay; }
    if (typeof delay !== "number" || delay < 0) {
      throw new Error(ErrorMsg.delay);
    }
    if (this.isStarted) {
      if (!this.isPending) { return false; }
      this.#halt();
      this.#delay = delay;
      this.#timeLeft = delay;
      this.#run();
    } else {
      this.#delay = delay;
      this.#timeLeft = delay;
    }
    return true;
  }

  #calculateTimeLeft() {
    return this.#delay - (new Date().getTime() - (this.#startTime ?? 0));
  }

  #run() {
    this.#startTime = new Date().getTime();
    this.#state = "pending";
    this.#to = setTimeout(()=>{
      this.#to = null;
      this.#state = "resolved";
      this.#timeLeft = 0;
      this.#cb?.(this);
    }, this.#timeLeft);
  }

  #halt() {
    if (this.#to) {
      clearTimeout(this.#to);
      this.#to = null;
    }
    this.#timeLeft = this.#calculateTimeLeft();
  }
}
export default Timeout;