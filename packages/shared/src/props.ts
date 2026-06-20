
export type Props<
  Constructor extends Record<string, any> = {},
  Events extends Record<string, (...args: any[]) => void> = {},
  Api extends Record<string, any> = {},
  RequiredConstructor extends boolean = false,
> = {
  events?: Events;
  api?: (api: Api) => void;
} & (RequiredConstructor extends true ? 
  {constructor: Constructor }
 : {constructor?: Constructor });