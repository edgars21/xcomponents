import {
  splitProps,
  type JSX,
  onMount,
  createSignal,
  Show,
  Component,
  createMemo,
} from "solid-js";
import { Dynamic } from "solid-js/web";
import Icon, { type Props as IconProps } from "@xcomponents2/icon";
import ProgressCircle from "@xcomponents2/progress-circle";
import {
  stylex,
  type StylexDefinition,
  mergeStylexDefinitions,
} from "@stylex/solid";
import { Button, type ButtonApi, ButtonProps } from "@xcomponents2/button";
false && stylex;

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      stylex: StylexDefinition;
    }
  }
}

export type MenuProps = MenuConstructor & Partial<MenuEvents>;
type Options = { value: string; label: string }[];
type Selected = string | null;

export type MenuConstructor = {
  options: Options;
  selected?: Selected;
  "pt:root"?: StylexDefinition;
  "pt:item"?: ButtonProps;
};

export type MenuEvents = {
  onSelect: (value: string) => void;
};

export interface MenuApi {
  element: HTMLInputElement;
  setSelected: (value: Selected) => void;
  get selected(): Selected;
}

function getItemApi(
  value: Selected,
  options: Options,
  apis: MenuItemInterface["api"][],
): MenuItemInterface["api"] | null {
  const index = options.findIndex((option) => option.value === value);
  if (index === -1) return null;
  const api = apis[index];
  if (!api) return null;
  return api;
}

export function Menu(props: MenuProps): JSX.Element {
  const [constructor, elementAttributesAndEventListeners] = splitProps(props, [
    "ref",
    "selected",
    "pt:root",
    "pt:item",
    "options",
  ]);

  let rootElement: HTMLInputElement;
  let selected: Selected = constructor.selected ?? null;
  let previousSelected: Selected = selected;

  const [rSelectedState, setrSelectedState] = createSignal<Selected>(selected);

  const events: Partial<MenuEvents> = props as Partial<MenuEvents>;

  const items: MenuItemInterface["api"][] = [];

  const api: MenuApi = {
    get element() {
      return rootElement!;
    },
    setSelected(value: Selected) {
      setSelected(value);
    },
    get selected() {
      return selected;
    },
  };

  function setSelected(value: Selected) {
    if (selected) {
      previousSelected = selected;
    }
    if (!value) {
      if (previousSelected) {
        const itemApi = getItemApi(
          previousSelected,
          constructor.options,
          items,
        );
        if (!itemApi) return;
        itemApi.setSelected(false);
      }
    } else {
      const itemApi = getItemApi(value, constructor.options, items);
      if (!itemApi) return;
      const previousItemApi = getItemApi(
        previousSelected,
        constructor.options,
        items,
      );
      if (previousItemApi) previousItemApi.setSelected(false);
      itemApi.setSelected(true);
    }
    selected = value;
    setrSelectedState(value);
  }

  function handleMenChange(value: string) {
    setSelected(value);
    events.onSelect?.(value);
  }

  onMount(() => {
    props.ref?.(api);
  });

  console.log("menu has pt:root", constructor["pt:root"]);

  return (
    // @ts-ignore
    <div
      use:stylex={mergeStylexDefinitions(
        {
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        },
        constructor["pt:root"],
      )}
      ref={rootElement!}
    >
      {constructor.options.map((option) => (
        <MenuItem
          ref={(api) => items.push(api)}
          option={option}
          onSelect={handleMenChange.bind(null, option.value)}
          {...(selected === option.value && { selected: true })}
          {...constructor["pt:item"] && {
            "pt:item": constructor["pt:item"],
          }}
        />
      ))}
    </div>
  );
}

