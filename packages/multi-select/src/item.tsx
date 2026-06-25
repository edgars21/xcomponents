import { type JSX, onMount, createSignal, Show, createMemo } from "solid-js";
import { type ToggleApi, ToggleInterface } from "@xcomponents2/toggle";
import {
  type ComponentInterface,
  type CallableComponent,
  type ComponentProps,
  splitComponentProps,
} from "@xcomponents2/shared/component";

export type MultiSelectItemProps<T extends ToggleInterface> = {
  component: CallableComponent<T>;
} & ComponentProps<MultiSelectItemInterface<T>>;
export type MultiSelectItemInterface<
  T extends ToggleInterface = ToggleInterface,
> = ComponentInterface<
  MultiSelectItemConstructor<T>,
  MultiSelectItemEvents,
  MultiSelectItemApi
>;
export type MultiSelectItemConstructor<T extends ToggleInterface> = {
  selected?: boolean;
  selectedStateConstructor?: Partial<T["constructor"]>;
};
export type MultiSelectItemEvents = {
  onSelect: () => void;
};
export type MultiSelectItemApi = {
  setSelected: (selected: boolean) => void;
  isSelected: () => boolean;
};

export function MultiSelectItem<T extends ToggleInterface>(
  props: MultiSelectItemProps<T>,
): JSX.Element {
  const { constructor, events, setApi } =
    splitComponentProps<MultiSelectItemInterface<T>>(props);
  props.component.props.toggled = constructor.selected;
  let toggleApi: ToggleApi;

  const [rRefreshCompnent, setrRefreshCompnent] = createSignal(1);

  let api: MultiSelectItemApi = {
    setSelected: (selected: boolean) => {
      toggleApi.setToggled(selected);
    },
    isSelected: () => toggleApi.isToggled(),
  };

  const eventHandlers: MultiSelectItemEvents = {
    onSelect: () => {
      events?.onSelect?.();
    },
  };

  onMount(() => {
    setApi?.(api);
  });

  return (
    <Show when={rRefreshCompnent()} keyed>
      {props.component.function({
        ...props.component.props,
        api: (api) => {
          toggleApi = api;
          props.component.props.api?.(api);
        },
        onToggle: (state: boolean) => {
          if (toggleApi.isToggled() === false) {
            toggleApi.setToggled(true);
          } else {
            props.component.props.onToggle?.(state);
            eventHandlers.onSelect();
          }
        },
      })}
    </Show>
  );
}
