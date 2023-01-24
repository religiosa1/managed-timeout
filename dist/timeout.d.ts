declare const callbackError: "Expeting to get a cb function as the first argument";
declare const delayError: "Delay argument should be a number >= 0";
declare const repeatedStart: "Timeout was already started";
type TimeoutState = "ready" | "pending" | "paused" | "resolved" | "cancelled";
declare class Timeout {
    #private;
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
    get state(): TimeoutState;
    /** True if timeout is pending for execution (actively running or paused) */
    get isPending(): boolean;
    /** True if timeout was started */
    get isStarted(): boolean;
    /** True if timeout was canceled */
    get isCanceled(): boolean;
    /** True if timeout was finished (normally or preemptively) */
    get isFinished(): boolean;
    /** True if timeout was finished preemptively */
    get isFinishedPreemptively(): boolean;
    /** Time left (in ms) before the timeout execution */
    get timeLeft(): number;
    /** Number of milliseconds of delay time passed. */
    get timePassed(): number;
    /** Starts a timeout created without a callback.
     * @returns a Promise, resolving after the delay time has passed.
     */
    start(): Promise<Timeout>;
    /** Starts a timeout created without a callback.
     * @param cb callback to be called after the delay time has passed.
     * @returns true if callback was successfully started, false otherwise.
     */
    start(cb: (to: Timeout) => void): boolean;
    /** Cancels the timeout completely.
     * @returns true if the timeout was stopped, false if it wasn't pending to begin with
     */
    cancel(): boolean;
    /** Execute pending timeout's CB preemptively, without waiting for the delay time and finishing it.
     * Repeated invokations won't run the cb, and false would be returned instead.
     * @returns {boolean} true if the timeout was finished, false if it was already finished or canceled before
     */
    execute(): boolean;
    /** Pauses the timeout.
     * If it was already paused do nothing.
     * @returns {boolean} true if the timeout was paused, false otherwise.
     */
    pause(): boolean;
    /** Resumes the paused timeout.
     * If it wasn't paused do nothing.
     * @returns {boolean} true if the timeout was resumed, false otherwise.
     */
    resume(): boolean;
    /** Timeout pause/resume status. */
    get paused(): boolean;
    set paused(val: boolean);
    /**
     * Reset the timeout's delay with the previous delay value or a new one.
     * The timeout will be unpaused and running if it's in the paused state.
     * If the timeout was finished or canceled do nothing, return false.
     * If timeout wasn't started just changes the delay time.
     * @param delay time to which reset the timeout (default the same as before)
     * @throws {Error} if delay was supplied and it isn't a number >= 0
     * @return status if timeout was reset or not.
     */
    reset(delay?: number): boolean;
    /** Current set total delay (from the constructor or consecutive calls to reset) */
    get delay(): number;
}

export { Timeout, TimeoutState, callbackError, Timeout as default, delayError, repeatedStart };
