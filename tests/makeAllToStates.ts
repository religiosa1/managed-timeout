import Timeout, { TimeoutState } from "../src/Timeout";

const noop = () => {};
export default function<T = Timeout>(mapper?: (to: Timeout) => T): Record<TimeoutState, T> {
  const ready = new Timeout(10);
  const pending = new Timeout(10);
  pending.start(noop);
  const paused = new Timeout(10);
  paused.start(noop);
  paused.pause();
  const resolved = new Timeout(10);
  resolved.execute();
  const cancelled = new Timeout(10);
  cancelled.start(noop);
  cancelled.cancel();

  const items = {
    ready,
    pending,
    paused,
    resolved,
    cancelled,
  };
  if (mapper == null) {
    return items as Record<TimeoutState, T>;
  }
  return Object.fromEntries(
    Object.entries(items).map(([key, value]) => [key, mapper(value)])
  ) as Record<TimeoutState, T>;
}