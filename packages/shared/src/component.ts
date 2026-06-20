import { type JSX } from "solid-js";
import { Props } from "./props";

export type Component<
  Constructor extends Record<string, any>,
  Events extends Record<string, (...args: any[]) => void>,
  Api extends Record<string, any>,
  RequiredConstructor extends boolean,
  Function extends (props: Props<Constructor, Events, Api, RequiredConstructor>) => JSX.Element,
> = {
  function: Function;
} & Props<Constructor, Events, Api, RequiredConstructor>;
