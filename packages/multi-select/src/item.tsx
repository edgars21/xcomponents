import { ToggleInterface } from "@xcomponents2/shared/toggleInterface";
import { Props } from "@xcomponents2/shared/props";
import { Component } from "@xcomponents2/shared/component";
import { Icon } from "@xcomponents2/icon";
import {
  Button,
  type ButtonProps,
  type ButtonConstructor,
  type ButtonEvents,
  type ButtonApi,
  ToggleButton,
} from "@xcomponents2/button";
import { type JSX, onMount, createSignal, Show, createMemo } from "solid-js";
import { type ToggleProps, type ToggleApi } from "@xcomponents2/toggle";
import { ComponentCallback, type GetComponentInterface, type GetComponentInterfaceFromProps } from "@xcomponents2/shared/component";
type Resolve<T> = T extends object ? { [K in keyof T]: T[K] } : T;


type CombinedToggleButtonComponent = GetComponentInterface<typeof ToggleButton>;


type ButtonComponent = GetComponentInterface<typeof Button>;
type ToggleComponent = GetComponentInterfaceFromProps<ToggleProps>;

type TogglableButtonComponent = ButtonComponent & ToggleComponent;
type TogglableButtonComponent2 = Resolve<ToggleComponent & Resolve<ButtonComponent>>;


const test: ToggleComponent =  {} as CombinedToggleButtonComponent

export type MultiSelectItemProps<T extends ToggleProps> = Props<
  MultiSelectItemConstructor<T>,
  MultiSelectItemEvents,
  MultiSelectItemApi,
  true
>;



type MultiSelectItemConstructor<T extends ToggleProps> = {
  selected?: boolean;
  component: ComponentCallback<T>;
};

type MultiSelectItemEvents = {
  onSelect: (selected: boolean) => void;
};
type MultiSelectItemApi = {
  setSelected: (selected: boolean) => void;
  isSelected: () => boolean;
};

export function MultiSelectItem<T extends ToggleProps>(
  props: MultiSelectItemProps<T>,
): JSX.Element {
  const { constructor, events, api: setApi } = props;
  constructor.component.constructor.toggled = constructor.selected;

  let toggleApi: ToggleApi;

  const [rRefreshCompnent, setrRefreshCompnent] = createSignal(1);

  const {
    component: {
      events: { onToggle: extractedComponentOnToggleEvent } = {},
      ...forwardComponentConstructortAndApi
    },
  } = constructor;

  let api: MultiSelectItemApi = {
    setSelected: (selected: boolean) => {
      toggleApi.setToggled(selected);
    },
    isSelected: () => toggleApi.isToggled(),
  };

  const eventHandlers: MultiSelectItemEvents = {
    onSelect: (selected: boolean) => {
      events?.onSelect?.(selected);
    },
  };

  function customOnMount() {
    setApi?.(api);
  }

  return (
    <Show when={rRefreshCompnent()} keyed>
      {(
        constructor.component
          .function as ComponentCallback<ToggleProps>["function"]
      )({
        api: (api) => {
          toggleApi = api;
          forwardComponentConstructortAndApi.api?.(api);
          customOnMount();
        },
        constructor: forwardComponentConstructortAndApi.constructor,
        events: {
          onToggle: (toggled: boolean) => {
            setrRefreshCompnent((prev) => prev + 1);
            extractedComponentOnToggleEvent?.(toggled);
            eventHandlers.onSelect(toggled);
          },
        },
      })}
    </Show>
  );
}
