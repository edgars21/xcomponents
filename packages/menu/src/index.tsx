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
import { Button, type ButtonApi } from "@xcomponents2/button";
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

type MenuConstructor = {
  ref?: (api: Api) => void;
  options: Options;
  selected?: Selected;
  "pt:root"?: StylexDefinition;
};

type MenuItemInterface = {
  construcotr: {
    option: Options[number];
    selected?: boolean;
    onSelect: () => void;
    ref: (api: MenuItemInterface["api"]) => void;
  };
  api: {
    setSelected: (value: boolean) => void;
    get selected(): boolean;
  };
};

export type MenuEvents = {
  onSelect: (value: string) => void;
};

export interface Api {
  element: HTMLInputElement;
  setSelected: (value: string) => void;
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
    "options",
  ]);

  let rootElement: HTMLInputElement;
  let selected: Selected = constructor.selected ?? null;
  let previousSelected: Selected = selected;

  const [rSelectedState, setrSelectedState] = createSignal<Selected>(selected);

  const events: Partial<MenuEvents> = props as Partial<MenuEvents>;

  const items: MenuItemInterface["api"][] = [];

  const api: Api = {
    get element() {
      return rootElement!;
    },
    setSelected(value: string) {
      const itemApi = getItemApi(value, constructor.options, items);
      if (itemApi) {
        console.log("setSelected", value, "itemApi", itemApi);
        previousSelected = selected;
        selected = value;
        setrSelectedState(value);
        const previousItemApi = getItemApi(
          previousSelected,
          constructor.options,
          items,
        );
        if (previousItemApi) previousItemApi.setSelected(false);
        itemApi.setSelected(true);
        events.onSelect?.(value);
      }
    },
    get selected() {
      return selected;
    },
  };

  onMount(() => {
    props.ref?.(api);
  });

  console.log("menu list rerender: ", constructor.options);

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
          onSelect={() => api.setSelected(option.value)}
          {...(selected === option.value && { selected: true })}
        />
      ))}
    </div>
  );
}

function MenuItem(props: MenuItemInterface["construcotr"]): JSX.Element {
  // let button: ButtonApi;
  let selected: boolean = props.selected ?? false;
  const [rSelectedState, setRSelectedState] = createSignal(selected);

  const api: MenuItemInterface["api"] = {
    setSelected(value: boolean) {
      console.log("------> Im an item api");
      selected = value;
      setRSelectedState(value);
    },
    get selected() {
      return selected;
    },
  };

  onMount(() => {
    props.ref?.(api);
  });

  let key = 1;
  const refreshKey = createMemo(() => {
    rSelectedState();
    return key++;
  });

  return (
    <Show when={!!refreshKey()} keyed>
      <Button
        label={props.option.label}
        onClick={() => {
          props.onSelect();
        }}
        pt:root={{
          border: "none",
          borderRadius: "0",
          padding: "8px 12px",
          backgroundColor: [[":hover", "#cecece"], "#fff"],
        }}
        startIcon={rSelectedState() ? "lucide:check" : "empty"}
      />
    </Show>
  );
}
