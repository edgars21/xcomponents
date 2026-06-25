import { type JSX } from "solid-js";

export function splitComponentProps<T extends ComponentInterface>(
  props: ComponentProps<T>,
): {
  constructor: T["constructor"];
  events: T["events"];
  setApi?: (api: T["api"]) => void;
} {
  const [constructor, events] = Object.entries(props).reduce(
    (acc, [key, value]) => {
      if (key !== "api") {
        if (key.startsWith("on")) {
          // @ts-ignore
          acc[1][key as keyof T["events"]] = value;
        } else {
          // @ts-ignore
          acc[0][key as keyof T["constructor"]] = value;
        }
      }
      return acc;
    },
    [{}, {}] as [T["constructor"], T["events"]],
  );
  return {
    constructor,
    events,
    ...(props.api && {
      setApi: props.api,
    }),
  };
}

export type ComponentProps<T extends ComponentInterface> = T["constructor"] &
  Partial<T["events"]> & { api?: (api: T["api"]) => void };

export type ComponentInterface<
  TC extends ConstructorType = ConstructorType<{}>,
  TE extends EventsType = EventsType<{}>,
  TA extends ApiType = ApiType<{}>,
> = {
  constructor: TC;
  events: TE;
  api: TA;
};

export type ConstructorType<
  T extends Record<string, any> = Record<string, any>,
> = T;
export type EventsType<
  T extends Record<string, (...args: any[]) => void> = Record<
    string,
    (...args: any[]) => void
  >,
> = T;
export type ApiType<T extends Record<string, any> = Record<string, any>> = T;

export type CallableComponent<T extends ComponentInterface> = {
  function: (props: ComponentProps<T>) => JSX.Element;
  props: ComponentProps<T>;
};
