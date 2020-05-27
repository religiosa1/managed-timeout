# managed-timeout

A setTimeout with extended functionality. Provides the ability to:
- pause/resume delayed timeout.
- execute timeout preemptively, before the delay time passes
- reset or change the delay time
- inspect on whether a timeout is still pending, was canceled or finished normally

Typescript module and es5 compiled common js inside.

## Usage

`npm install --save managed-timeout`

```js
import { Timeout } from "managed-timeout";
// or const Timeout = require("managed-timeout");

let to = new Timeout(()=>console.log("Hello World"), 15000);
to.pause();
// do something
to.resume();
if (to.isPending) { /* do another something */ }
to.cancel();
```

### Constructor
**`new Timeout(cb: ()=>void, delay: number)`**

Matches the setTimeout signature. Schedules to call cb function after delay milliseconds
Throws if cb isn't a function or delay isn't a number or is less than zero

### Methods

**`cancel(): boolean`**

Cancels the timeout completely.
Returns true if the timeout was stopped, false if it wasn't pending to begin with

**`execute(): boolean`**

Execute pending timeout's callback preemptively, without waiting for the delay time and finishing it.
Returns true if the timeout was finished, false if it was already finished or canceled before.

**`pause(): boolean`**

Pauses the timeout. If it was already paused do nothing.
Returns true if the timeout was paused, false otherwise.

**`resume(): boolean`**

Resumes the paused timeout. If it wasn't paused do nothing.
Returns true if the timeout was resumed, false otherwise.

**`reset(delay?: number): boolean`**

Resets the timeout with the previous delay or a new delay.
The timeout will be unpaused and set running if it was in the paused state.
If delay is not supplied, uses the last delay (from the constructor or last reset call).
Otherwise using the new delay or throwing an error if it's not a number >= 0
Returns true if the timeout was reset, false if it had been finished or canceled.

### Properties

`paused`

Status if timeout was paused or not. Writable (the same as calling pause/resume).

`isPending: boolean`

True if timeout is pending for execution (actively running or paused)

`isCanceled: boolean`

True if timeout was canceled

`isFinished: boolean`

True if timeout was finished (normally or preemptively)

`isFinishedPreemptively: boolean`

True if timeout was finished preemptively

`timeLeft: number`

Time left before the timeout execution. It won't change from call to call when the timeout is paused.

`delay: number`

Current set total delay (from the constructor or consecutive calls to reset)