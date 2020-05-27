"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timeout = void 0;
var delayError = "Delay argument should be a number >= 0";
var Timeout = /** @class */ (function () {
    /** schedueles timeout
     * @param {(...args: any[])=>void} cb callback to execute after delay time has passed
     * @param {number} delay delay time in millieseconds
     * @throws {Error} if cb isn't a function or delay isn't a number or less than zero.
     */
    function Timeout(cb, delay) {
        this._pending = true;
        this._canceled = false;
        this._paused = false;
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
    Object.defineProperty(Timeout.prototype, "isPending", {
        /** True if timeout is pending for execution (actively running or paused) */
        get: function () {
            return this._pending;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Timeout.prototype, "isCanceled", {
        /** True if timeout was canceled */
        get: function () {
            return this._canceled;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Timeout.prototype, "isFinished", {
        /** True if timeout was finished (normally or preemptively) */
        get: function () {
            return !this.isPending && !this._canceled;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Timeout.prototype, "isFinishedPreemptively", {
        /** True if timeout was finished preemptively */
        get: function () {
            return this.isFinished && this._timeLeft > 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Timeout.prototype, "timeLeft", {
        /** Time left (in ms) before the timeout execution */
        get: function () {
            if (!this._pending || this._paused) {
                return this._timeLeft;
            }
            else {
                return this._delay - (new Date().getTime() - this._startTime);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Timeout.prototype, "timePassed", {
        /** Number of milliseconds of delay time passed. */
        get: function () {
            return this._delay - this.timeLeft;
        },
        enumerable: false,
        configurable: true
    });
    Timeout.prototype._run = function () {
        var _this = this;
        this._startTime = new Date().getTime();
        this._to = setTimeout(function () {
            _this._to = null;
            _this._pending = false;
            _this._timeLeft = 0;
            _this._cb();
        }, this._timeLeft);
    };
    Timeout.prototype._halt = function () {
        if (this._to) {
            clearTimeout(this._to);
            this._to = null;
        }
        this._timeLeft = this.timeLeft;
    };
    /** Cancels the timeout completely.
     * @returns {boolean} true if the timeout was stopped, false if it wasn't pending to begin with
     */
    Timeout.prototype.cancel = function () {
        if (!this._pending) {
            return false;
        }
        this._halt();
        this._pending = false;
        this._canceled = true;
        return true;
    };
    /** Execute pending timeout's CB preemptively, without waiting for the delay time and finishing it.
     * Repeated invokations won't run the cb, and false would be returned instead.
     * @returns {boolean} true if the timeout was finished, false if it was already finished or canceled before
     */
    Timeout.prototype.execute = function () {
        if (!this._pending) {
            return false;
        }
        this._halt();
        this._pending = false;
        this._cb();
        return true;
    };
    /** Pauses the timeout.
     * If it was already paused do nothing.
     * @returns {boolean} true if the timeout was paused, false otherwise.
     */
    Timeout.prototype.pause = function () {
        if (!this._pending || this._paused) {
            return false;
        }
        this._halt();
        this._paused = true;
        return true;
    };
    /** Resumes the paused timeout.
     * If it wasn't paused do nothing.
     * @returns {boolean} true if the timeout was resumed, false otherwise.
     */
    Timeout.prototype.resume = function () {
        if (!this._pending || !this._paused) {
            return false;
        }
        this._paused = false;
        this._run();
        return true;
    };
    Object.defineProperty(Timeout.prototype, "paused", {
        /** Timeout pause/resume status. */
        get: function () {
            return this._paused;
        },
        set: function (val) {
            if (val) {
                this.pause();
            }
            else {
                this.resume();
            }
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Reset the timeout's timer with the previous delay value or a new delay.
     * The timeout will be unpaused and running if it's in the paused state.
     * If the timeout was finished or canceled do nothing, return false.
     * @param {number} [delay] delay time to which reset the timeout (default the same as before)
     * @throws {Error} if delay was supplied and it isn't a number >= 0
     * @return {boolean} status if timeout was reset or not.
     */
    Timeout.prototype.reset = function (delay) {
        if (delay == null) {
            delay = this._delay;
        }
        if (typeof delay !== "number" || delay < 0) {
            throw new Error(delayError);
        }
        if (!this._pending) {
            return false;
        }
        if (this._paused) {
            this._paused = false;
        }
        this._halt();
        this._delay = delay;
        this._timeLeft = delay;
        this._run();
        return true;
    };
    Object.defineProperty(Timeout.prototype, "delay", {
        /** Current set total delay (from the constructor or consecutive calls to reset) */
        get: function () {
            return this._delay;
        },
        enumerable: false,
        configurable: true
    });
    return Timeout;
}());
exports.Timeout = Timeout;
exports.default = Timeout;
//# sourceMappingURL=timeout.js.map