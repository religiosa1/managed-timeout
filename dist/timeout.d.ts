export declare class Timeout {
    private _pending;
    private _canceled;
    private _paused;
    private _delay;
    private _timeLeft;
    private _to;
    private _startTime;
    private _cb;
    /** schedueles timeout
     * @param {(...args: any[])=>void} cb callback to execute after delay time has passed
     * @param {number} delay delay time in millieseconds
     * @throws {Error} if cb isn't a function or delay isn't a number or less than zero.
     */
    constructor(cb: (...args: any[]) => void, delay: number);
    /** True if timeout is pending for execution (actively running or paused) */
    get isPending(): boolean;
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
    private _run;
    private _halt;
    /** Cancels the timeout completely.
     * @returns {boolean} true if the timeout was stopped, false if it wasn't pending to begin with
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
     * Reset the timeout's timer with the previous delay value or a new delay.
     * The timeout will be unpaused and running if it's in the paused state.
     * If the timeout was finished or canceled do nothing, return false.
     * @param {number} [delay] delay time to which reset the timeout (default the same as before)
     * @throws {Error} if delay was supplied and it isn't a number >= 0
     * @return {boolean} status if timeout was reset or not.
     */
    reset(delay?: number): boolean;
    /** Current set total delay (from the constructor or consecutive calls to reset) */
    get delay(): number;
}
export default Timeout;
