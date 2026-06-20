

import { ToggleInterfaceComponent } from "@xcomponents2/shared/toggleInterface";
import {Props} from "@xcomponents2/shared/props";
import {Component} from "@xcomponents2/shared/component";
import {
  type JSX,
  onMount,
  createSignal,
  Show,
  createMemo,
} from "solid-js";


export type MenuItemsProps = Props<MenuItemConstructor, MenuItemEvents, MenuItemApi, true>; 

type MenuItemConstructor = {
    type: Component<> 
} & ToggleInterfaceComponent["constructor"];


type MenuItemEvents = {
} & ToggleInterfaceComponent["events"];

type MenuItemApi = {
} & ToggleInterfaceComponent["api"];

export function MenuItem(props: MenuItemsProps): JSX.Element {
  const {constructor, events, api: setApi} = props;

  const {type, ...forwardConstructor} = constructor;

  let selected: boolean = constructor?.toggled ?? false;
  const [rSelectedState, setRSelectedState] = createSignal(selected);

  const api: MenuItemApi = {
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
                } 
            }
        })}
    </Show>
  );
}