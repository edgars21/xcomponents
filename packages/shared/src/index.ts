import { type JSX, untrack, children, For, createSignal } from "solid-js";

import { type Accessor } from "solid-js";

type FirstArg<F> = F extends (...args: infer P) => any ? P[0] : never;

type _MappedValues<T, AllowRaw extends boolean> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? AllowRaw extends true
      ? Accessor<FirstArg<T[K]>> | FirstArg<T[K]>
      : Accessor<FirstArg<T[K]>>
    : never;
};

export type ToAccessorsCfg<
  T,
  AllowRaw extends boolean = false,
  MakeOptional extends boolean = false
> = MakeOptional extends true
  ? { [K in keyof _MappedValues<T, AllowRaw>]?: _MappedValues<T, AllowRaw>[K] }
  : {
      [K in keyof _MappedValues<T, AllowRaw>]-?: _MappedValues<T, AllowRaw>[K];
    };

export type ToAccessors<T> = ToAccessorsCfg<T, false, false>;
export type ToAccessorsOrValue<T> = ToAccessorsCfg<T, true, false>;
export type ToOptionalAccessors<T> = ToAccessorsCfg<T, false, true>;
export type ToOptionalAccessorsOrValue<T> = ToAccessorsCfg<T, true, true>;

export function createEventListenerWithCleanupFactory() {
  const listeners: [
    EventTarget,
    string,
    (e: Event) => void,
    options?: AddEventListenerOptions
  ][] = [];

  return [
    (
      target: EventTarget,
      event: string,
      handler: (e: Event) => void,
      options?: AddEventListenerOptions
    ) => {
      target.addEventListener(event, handler, options);
      const listener = [
        target,
        event,
        handler,
        ...(options ? [options] : []),
      ] as [EventTarget, string, (e: Event) => void];
      listeners.push(listener);

      return () => {
        const index = listeners.indexOf(listener);
        if (index > -1) {
          target.removeEventListener(event, handler);
          listeners.splice(index, 1);
        }
      };
    },
    () => {
      listeners.forEach(([target, event, handler]) => {
        target.removeEventListener(event, handler);
      });
    },
  ] as const;
}

export function normalizeSlot(
  slot: JSX.Element
): (HTMLElement | string)[] | HTMLElement | string | undefined {
  let parsed = children(() => slot)();
  if (!Array.isArray(parsed)) {
    parsed = [parsed];
  }
  parsed = parsed.filter((el) => {
    if (el instanceof HTMLElement || typeof el === "string") {
      return true;
    }
  });

  if (parsed.length === 0) {
    return undefined;
  } else if (parsed.length === 1) {
    return parsed[0] as HTMLElement | string;
  } else {
    return parsed as (HTMLElement | string)[];
  }
}
