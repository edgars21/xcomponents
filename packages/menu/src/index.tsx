import {
  splitProps,
  type JSX,
  onMount,
  createSignal,
  Show,
  createMemo,
} from "solid-js";
import {
  stylex,
  type StylexDefinition,
  mergeStylexDefinitions,
} from "@stylex/solid";
import { Button,  ButtonProps } from "@xcomponents2/button";
import {
  type ComponentInterface,
  type ComponentProps,
  splitComponentProps,
} from "@xcomponents2/shared/component";
false && stylex;

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      stylex: StylexDefinition;
    }
  }
}

export type MenuProps = ComponentProps<MenuInterface>;

export type MenuInterface = ComponentInterface<
  MenuConstructor,
  MenuEvents,
  MenuApi
>;

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

type Options = { value: string; label: string }[];
type Selected = string | null;


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
  const { constructor, events, setApi } =
    splitComponentProps<MenuInterface>(props);


  let rootElement: HTMLInputElement;
  let selected: Selected = constructor.selected ?? null;
  let previousSelected: Selected = selected;

  const [rSelectedState, setrSelectedState] = createSignal<Selected>(selected);

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
    setApi?.(api);
  });

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

type MenuItemInterface = {
  construcotr: {
    option: Options[number];
    selected?: boolean;
    onSelect: () => void;
    ref: (api: MenuItemInterface["api"]) => void;
    "pt:item"?: ButtonProps;
  };
  api: {
    setSelected: (value: boolean) => void;
    get selected(): boolean;
  };
};

function MenuItem(props: MenuItemInterface["construcotr"]): JSX.Element {
  // let button: ButtonApi;
  let selected: boolean = props.selected ?? false;
  const [rSelectedState, setRSelectedState] = createSignal(selected);

  const api: MenuItemInterface["api"] = {
    setSelected(value: boolean) {
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
    <Show when={refreshKey()} keyed>
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
        {...props["pt:item"]}
      />
    </Show>
  );
}
