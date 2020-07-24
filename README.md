# managed-timeout

A setTimeout with extended functionality. Provides the ability to:
- pause/resume timeout.
- execute timeout preemptively, before the delay time passes
- reset or change the delay time
- inspect on whether a timeout is still pending, was canceled or finished normally
- optional promise support

Typescript module and es5 compiled common js inside. Fully tested.

## Usage

`npm install --save managed-timeout`

### Callback-style

```js
import { Timeout } from "managed-timeout";
// or const { Timeout } = require("managed-timeout");

let to = new Timeout(()=>console.log("Hello World"), 15000);
to.pause();
// do something
to.resume();
if (to.isPending) { /* do another something */ }
to.cancel();
```

### Delayed start

Constructor can be supplied with only delay time. In that case, callback
can be supplied to the start() method and the timeout would actually be launched
after the call.

```js
let to = new Timeout(3000);
to.start(()=>console.log("to fired"));
```

### Promise-style

If no callback is supplied to the **start** method, it returns a promise.
It's the only part which isn't pure ES5, make sure to polyfill promises
if you need to support platforms without them (IE).

Cancellation of a timeout will __not__ result in promise error, promise
callbacks won't be called at all.

Consequtive calls to the start method will result in a promise rejection.
All the timeout methods should still be called on the timeout instance and not
on the promise instance. Or in simple terms: after a call to the start() method
only then/catch/finally and other promise methods can be chained.

```js
let to = new Timeout(3000);
to.start().then(()=>{
  // do something
});
to.pause(); // timeout can be paused, continued, cancelled, etc as before

// or async/await style just as a pause
(async () => {
  await new Timeout(5000).start();
  console.log("called in 5 seconds");
})();

// BAD DON'T DO THIS -- a call on promise, not on the timeout instance
new Timeout(3000).start().then(()=>{/* ... */}).pause();
```

## API

### Constructor
**`new Timeout(cb: ()=>void, delay: number)`**

Matches the setTimeout signature. Schedules to call cb function after delay milliseconds.
Throws if cb isn't a function or delay isn't a number or is less than zero

**`new Timeout(delay: number)`**

Delayed start timeout. Only creates an instance of a timeout, needs to be armed with a call
to the **start()** method afterwards.
Throws if delay isn't a number or is less than zero

### Methods

**`start(): Promise<void>`**

**`start(cb: ()=>void): boolean`**

Arms a timeout created without a callback. If the method was called without
a callback, then returns a promise, which will be resolved once the delay time
is passed (timeout can be paused or resumed as usual).
Consequentive calls with a callback will return false, without a callback will
return a rejected promise (previously created promises continue to work as usual).

**`cancel(): boolean`**

Cancels the timeout completely.
Returns true if the timeout was stopped, false if it wasn't pending to begin with.

**`execute(): boolean`**

Execute pending timeout's callback preemptively, without waiting for the delay
time and effectively finishing it.
Returns true if the timeout was finished, false if it was already finished
or canceled before.

**`pause(): boolean`**

Pauses the timeout. If it was already paused, then does nothing.
Returns true if the timeout was paused, false otherwise.

**`resume(): boolean`**

Resumes the paused timeout. If the timeout wasn't paused, then does nothing.
Returns true if the timeout was resumed, false otherwise.

**`reset(delay?: number): boolean`**

Resets the timeout with the previous delay time or with a new delay time.
The timeout will be unpaused and set running if it was in the paused state.
If called on non-started timeouts simply changes the delay time, without actually
starting it. If delay is not supplied, uses the last delay (from the constructor
or last reset call). Otherwise uses the new supplied delay, potentially throwing
an error if it's not a number or it is >= 0.
Returns true if the timeout was reset, false if it had been finished or canceled.

### Properties

All properties are read-only unless stated otherwise.

`paused`

Status if timeout was paused or not. Writable (the same as calling pause/resume).

`isPending: boolean`

True if timeout is pending for execution (actively running or paused).

`isStarted: boolean`

True if timeout was started via the start method or via callback provision to the
constructor. Remains true disregarding if timeout is pending, cancelled or finished.

`isCanceled: boolean`

True if timeout was canceled.

`isFinished: boolean`

True if timeout was finished (normally or preemptively).

`isFinishedPreemptively: boolean`

True if timeout was finished preemptively.

`timeLeft: number`

Time left before the timeout execution. It won't change from call to call when the timeout is paused.

`timePassed: number`

 Number of milliseconds of delay time passed. Basically `delay - timeLeft`.

`delay: number`

Currently set total delay time (from the constructor or consecutive calls to reset).