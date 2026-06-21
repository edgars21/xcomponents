export type Props<
  Constructor extends PropsConstructorType = {},
  Events extends PropsEventsType = {},
  Api extends PropsApiType = {},
  RequiredConstructor extends boolean = false,
> = {
  events?: Partial<Events>;
  api?: (api: Api) => void;
} & (RequiredConstructor extends true
  ? { constructor: Constructor }
  : { constructor?: Constructor });

export type PropsConstructorType = Record<string, any>;
export type PropsEventsType<RequiredKeys extends string = never> = {
  [K in RequiredKeys]: (...args: any[]) => void;
} & Record<string, (...args: any[]) => void>;
export type PropsApiType<Required extends Record<string, any> = {}> = Record<
  string,
  any
> &
  Required;