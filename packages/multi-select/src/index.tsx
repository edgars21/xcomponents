export { MultiSelectItem } from "./item";
import { type JSX, onMount } from "solid-js";
import {
  type ComponentInterface,
  type ComponentProps,
  splitComponentProps,
  CallableComponent,
} from "@xcomponents2/shared/component";
import { MultiSelectItem, type MultiSelectItemInterface } from "./item";
import { type ToggleInterface } from "@xcomponents2/toggle";

type Item<T extends ToggleInterface = ToggleInterface> = Option<T> & {
  api: MultiSelectItemInterface["api"];
};
type Options<T extends ToggleInterface = ToggleInterface> = Option<T>[];
type Option<T extends ToggleInterface = ToggleInterface> = {
  value: string;
  label: string;
  "pt:item"?: ComponentProps<T>;
};
type Selected = string | null;
export type MultiSelectProps<T extends ToggleInterface> = ComponentProps<
  MultiSelectInterface<T>
>;
export type MultiSelectInterface<T extends ToggleInterface> =
  ComponentInterface<
    MultiSelectConstructor<T>,
    MultiSelectEvents,
    MultiSelectApi
  >;
export type MultiSelectConstructor<T extends ToggleInterface> = {
  options: Options<T>;
  "pt:item": CallableComponent<T>;
  value?: Selected;
};
export type MultiSelectEvents = {
  onSelect: (value: string) => void;
};
export interface MultiSelectApi {
  setSelected: (value: Selected) => void;
  get value(): Selected;
}

function getOption<T extends ToggleInterface>(options: Options<T>, value: Selected): Option<T> | null {
  const foundOption = options.find((option) => option.value === value);
  return foundOption ?? null;
}

export function MultiSelect<T extends ToggleInterface>(
  props: MultiSelectProps<T>,
): JSX.Element {
  const { constructor, events, setApi } =
    splitComponentProps<MultiSelectInterface<T>>(props);

  const initSelectedItem = constructor.value
    ? (getOption(constructor.options, constructor.value) as Item<T>)
    : null;
  const items: Item<T>[] = constructor.options.map((option) => option as Item<T>);
  let selectedItem: Item<T> | null = initSelectedItem;

  const api: MultiSelectApi = {
    get value() {
      return selectedItem ? selectedItem.value : null;
    },
    setSelected(value: Selected) {
      const item = getOption(constructor.options, value) as Item | null;
      if (item) {
        setSelectedItem(item);
      }
    },
  };

  function setSelectedItem(item: Item) {
    if (selectedItem !== null) {
      selectedItem.api.setSelected(false);
    }
    selectedItem = item;
    console.log("all items should have api assinged:", items);
    selectedItem.api.setSelected(true);
  }

  const eventHandlers: MultiSelectEvents = {
    onSelect: (value: string) => {
      events.onSelect?.(value);
    },
  };

  onMount(() => {
    setApi?.(api);
  });



  return items.map((item) => {
    const itemProps = { ...constructor["pt:item"]?.props, ...item["pt:item"] };
    return MultiSelectItem({
      component: {function: constructor["pt:item"].function, props: itemProps},
      api: (api) => {
        console.log("assinging api to item:", item, api);
        item.api = api;
      },
      onSelect: () => {
        console.log("onSelect called for item:", item);
        setSelectedItem(item);
        eventHandlers.onSelect(item.value);
      },
    });
  });
}
