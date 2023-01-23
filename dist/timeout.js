var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    var _Timeout_state, _Timeout_delay, _Timeout_timeLeft, _Timeout_to, _Timeout_startTime, _Timeout_cb;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Timeout = exports.repeatedStart = exports.delayError = exports.callbackError = void 0;
    exports.callbackError = "Expeting to get a cb function as the first argument";
    exports.delayError = "Delay argument should be a number >= 0";
    exports.repeatedStart = "Timeout was already started";
    class Timeout {
        constructor(cb_or_delay, delay) {
            _Timeout_state.set(this, "ready");
            _Timeout_delay.set(this, void 0);
            /** Time left for a timeout for the resume call (after it was paused) */
            _Timeout_timeLeft.set(this, void 0);
            /** setTimeout identifier */
            _Timeout_to.set(this, void 0);
            /** latest setTimeout call time as returned by Date.getTime() */
            _Timeout_startTime.set(this, void 0);
            /** timeout callback */
            _Timeout_cb.set(this, void 0);
            const d = (typeof cb_or_delay === "number") ? cb_or_delay : delay;
            if (!Number.isInteger(d) || d < 0) {
                throw new Error(exports.delayError);
            }
            __classPrivateFieldSet(this, _Timeout_delay, d, "f");
            __classPrivateFieldSet(this, _Timeout_timeLeft, d, "f");
            if (typeof cb_or_delay !== "number") {
                this.start(cb_or_delay);
            }
        }
        get state() {
            return __classPrivateFieldGet(this, _Timeout_state, "f");
        }
        /** True if timeout is pending for execution (actively running or paused) */
        get isPending() {
            return __classPrivateFieldGet(this, _Timeout_state, "f") === "pending" || __classPrivateFieldGet(this, _Timeout_state, "f") === "paused";
        }
        /** True if timeout was started */
        get isStarted() {
            return __classPrivateFieldGet(this, _Timeout_startTime, "f") != null;
        }
        /** True if timeout was canceled */
        get isCanceled() {
            return __classPrivateFieldGet(this, _Timeout_state, "f") === "cancelled";
        }
        /** True if timeout was finished (normally or preemptively) */
        get isFinished() {
            return __classPrivateFieldGet(this, _Timeout_state, "f") === "resolved";
        }
        /** True if timeout was finished preemptively */
        get isFinishedPreemptively() {
            return __classPrivateFieldGet(this, _Timeout_state, "f") === "resolved" && __classPrivateFieldGet(this, _Timeout_timeLeft, "f") > 0;
        }
        /** Time left (in ms) before the timeout execution */
        get timeLeft() {
            if (__classPrivateFieldGet(this, _Timeout_state, "f") !== "pending") {
                return __classPrivateFieldGet(this, _Timeout_timeLeft, "f");
            }
            return __classPrivateFieldGet(this, _Timeout_delay, "f") - (new Date().getTime() - __classPrivateFieldGet(this, _Timeout_startTime, "f"));
        }
        /** Number of milliseconds of delay time passed. */
        get timePassed() {
            return __classPrivateFieldGet(this, _Timeout_delay, "f") - this.timeLeft;
        }
        start(cb) {
            if (cb != null) {
                if (typeof cb !== "function") {
                    throw new Error(exports.callbackError);
                }
                if (this.isPending) {
                    return false;
                }
                __classPrivateFieldSet(this, _Timeout_cb, cb, "f");
                this._run();
                return true;
            }
            else {
                return new Promise((resolve, reject) => {
                    if (this.isPending) {
                        return reject(new Error(exports.repeatedStart));
                    }
                    __classPrivateFieldSet(this, _Timeout_cb, () => resolve(this), "f");
                    this._run();
                });
            }
        }
        /** Cancels the timeout completely.
         * @returns true if the timeout was stopped, false if it wasn't pending to begin with
         */
        cancel() {
            if (__classPrivateFieldGet(this, _Timeout_state, "f") !== "pending" && __classPrivateFieldGet(this, _Timeout_state, "f") !== "paused") {
                return false;
            }
            this._halt();
            __classPrivateFieldSet(this, _Timeout_state, "cancelled", "f");
            return true;
        }
        /** Execute pending timeout's CB preemptively, without waiting for the delay time and finishing it.
         * Repeated invokations won't run the cb, and false would be returned instead.
         * @returns {boolean} true if the timeout was finished, false if it was already finished or canceled before
         */
        execute() {
            if (__classPrivateFieldGet(this, _Timeout_state, "f") !== "pending") {
                return false;
            }
            this._halt();
            __classPrivateFieldSet(this, _Timeout_state, "resolved", "f");
            __classPrivateFieldGet(this, _Timeout_cb, "f").call(this, this);
            return true;
        }
        /** Pauses the timeout.
         * If it was already paused do nothing.
         * @returns {boolean} true if the timeout was paused, false otherwise.
         */
        pause() {
            if (__classPrivateFieldGet(this, _Timeout_state, "f") !== "pending") {
                return false;
            }
            this._halt();
            __classPrivateFieldSet(this, _Timeout_state, "paused", "f");
            return true;
        }
        /** Resumes the paused timeout.
         * If it wasn't paused do nothing.
         * @returns {boolean} true if the timeout was resumed, false otherwise.
         */
        resume() {
            if (__classPrivateFieldGet(this, _Timeout_state, "f") !== "paused") {
                return false;
            }
            this._run();
            return true;
        }
        /** Timeout pause/resume status. */
        get paused() {
            return __classPrivateFieldGet(this, _Timeout_state, "f") === "paused";
        }
        set paused(val) {
            if (val) {
                this.pause();
            }
            else {
                this.resume();
            }
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
        reset(delay) {
            if (delay == null) {
                delay = __classPrivateFieldGet(this, _Timeout_delay, "f");
            }
            if (typeof delay !== "number" || delay < 0) {
                throw new Error(exports.delayError);
            }
            if (this.isStarted) {
                if (!this.isPending) {
                    return false;
                }
                this._halt();
                __classPrivateFieldSet(this, _Timeout_delay, delay, "f");
                __classPrivateFieldSet(this, _Timeout_timeLeft, delay, "f");
                this._run();
            }
            else {
                __classPrivateFieldSet(this, _Timeout_delay, delay, "f");
                __classPrivateFieldSet(this, _Timeout_timeLeft, delay, "f");
            }
            return true;
        }
        /** Current set total delay (from the constructor or consecutive calls to reset) */
        get delay() {
            return __classPrivateFieldGet(this, _Timeout_delay, "f");
        }
        _run() {
            __classPrivateFieldSet(this, _Timeout_startTime, new Date().getTime(), "f");
            __classPrivateFieldSet(this, _Timeout_state, "pending", "f");
            __classPrivateFieldSet(this, _Timeout_to, setTimeout(() => {
                __classPrivateFieldSet(this, _Timeout_to, null, "f");
                __classPrivateFieldSet(this, _Timeout_state, "resolved", "f");
                __classPrivateFieldSet(this, _Timeout_timeLeft, 0, "f");
                __classPrivateFieldGet(this, _Timeout_cb, "f").call(this, this);
            }, __classPrivateFieldGet(this, _Timeout_timeLeft, "f")), "f");
        }
        _halt() {
            if (__classPrivateFieldGet(this, _Timeout_to, "f")) {
                clearTimeout(__classPrivateFieldGet(this, _Timeout_to, "f"));
                __classPrivateFieldSet(this, _Timeout_to, null, "f");
            }
            __classPrivateFieldSet(this, _Timeout_timeLeft, this.timeLeft, "f");
        }
    }
    exports.Timeout = Timeout;
    _Timeout_state = new WeakMap(), _Timeout_delay = new WeakMap(), _Timeout_timeLeft = new WeakMap(), _Timeout_to = new WeakMap(), _Timeout_startTime = new WeakMap(), _Timeout_cb = new WeakMap();
    exports.default = Timeout;
});
//# sourceMappingURL=timeout.js.map