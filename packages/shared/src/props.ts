
export type Props<
  Constructor extends PropsConstructorType = {},
  Events extends PropsEventsType = {},
  Api extends PropsApiType = {},
  RequiredConstructor extends boolean = false,
> = {
  events?: Partial<Events>;
  api?: (api: Api) => void;
} & (RequiredConstructor extends true ? 
  {constructor: Constructor }
 : {constructor?: Constructor });

export type PropsConstructorType = Record<string, any>;
export type PropsEventsType = Record<string, (...args: any[]) => void>;
export type PropsApiType = Record<string, any>;