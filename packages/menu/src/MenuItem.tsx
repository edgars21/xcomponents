import { ToggleInterface } from "@xcomponents2/shared/toggleInterface";
import { Props } from "@xcomponents2/shared/props";
import { Component } from "@xcomponents2/shared/component";
import { type ButtonComponent } from "@xcomponents2/button";
import { type JSX, onMount, createSignal, Show, createMemo } from "solid-js";

export type MenuItemsProps<T extends ButtonComponent> = Props<
  MenuItemConstructor<T>,
  MenuItemEvents<T>,
  MenuItemApi<T>,
  true
>;

type MenuItemConstructor<T extends ButtonComponent> = {
  type: T;
} & T["constructor"] &
  ToggleInterface["constructor"];

type MenuItemEvents<T extends ButtonComponent> = {
  type: T;
} & T["events"] & Record<string, (...args: any[]) => void> &
  ToggleInterface["events"];


type MenuItemApi<T extends ButtonComponent> = {
  type: T;
} & T["api"] &
  ToggleInterface["api"];


export function MenuItem<T extends ButtonComponent>(
  props: MenuItemsProps<T>,
): JSX.Element {
  const { constructor, events, api: setApi } = props;

  const { type, ...forwardConstructor } = constructor;

  let selected: boolean = constructor?.toggled ?? false;
  const [rSelectedState, setRSelectedState] = createSignal(selected);

  const api: MenuItemApi<T> = {
    setToggled(value: boolean) {
      selected = value;
      setRSelectedState(value);
    },
    get toggled() {
      return selected;
    },
  };

  onMount(() => {
    setApi?.(api);
  });

  let key = 1;
  const refreshKey = createMemo(() => {
    rSelectedState();
    return key++;
  });

  return (
    <Show when={refreshKey()} keyed>
      {type.function({
        constructor: forwardConstructor,
        events: {
          onToggle: (toggled: boolean) => {
            api.setToggled(toggled);
            events?.onToggle?.(toggled);
          },
        },
      })}
    </Show>
  );
}
