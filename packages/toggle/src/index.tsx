import {
  Props,
  type PropsConstructorType,
  type PropsEventsType,
  type PropsApiType,
} from "@xcomponents2/shared/props";
import { type Component } from "@xcomponents2/shared/component";
import { type JSX } from "solid-js";

export type ToggleProps = Props<
  ToggleConstructor,
  ToggleEvents,
  ToggleApi,
  true
>;

export type ToggleConstructor<
  T extends PropsConstructorType | undefined = undefined,
> = {
  toggled?: boolean;
} & (T extends undefined ? {} : T);

export type ToggleEvents<T extends PropsEventsType | undefined = undefined> = {
  onToggle: (toggled: boolean) => void;
} & (T extends undefined ? {} : T);

export type ToggleApi<T extends PropsApiType | undefined = undefined> = {
  setToggled: (toggled: boolean) => void;
  toggle: () => void;
  isToggled: () => boolean;
} & (T extends undefined ? {} : T);

export type ToggleInterface = {
  constructor: ToggleConstructor;
  api: ToggleEvents;
  events: ToggleApi;
};

export function Toggle<
  T extends Component<
    ToggleConstructor,
    ToggleEvents,
    ToggleApi,
    true,
    (props: ToggleProps) => JSX.Element
  >,
>(
  type: T["function"],
  props: ToggleProps,
): JSX.Element {
  const RenderedComponent = type;
  return RenderedComponent(props);
}
