// @ts-nocheck
import {
  type JSX,
  untrack,
  children,
  For,
  createSignal,
  createMemo,
} from "solid-js";
import Popper, {
  type Constructor as PopperConstructor,
  type ApiBindings as PopperApiBindings,
} from "@xcomponents/popper";
import { stylex, type StyleXJs } from "@stylex/solid";
import Button, {
  type Props as ButtonProps,
  type Api as ButtonApi,
} from "@xcomponents/button";

false && stylex;

export type Props = Constructor & Events;

type Item = ItemValue & ButtonProps;
type ItemValue = {
  value: string;
  label: string;
  onAction?: () => void;
};
export interface Constructor {
  initValue: string;
  items: Item[];
  variant?: "segment" | "tab";
  "pt:root"?: ElementSetter;
  "pt:segment"?: ElementSetter;
}

interface ElementSetter {
  attr?: Record<string, string>;
  stylex?: (() => StyleXJs) | StyleXJs;
}

interface Events {
  onChange?: (value: ItemValue["value"]) => void;
}

interface Api {
  readonly selected: ItemValue[];
  select: (item: ItemValue) => void;
  unselect: (item: ItemValue) => void;
}

export default function Menu(p: Props) {
  const props = untrack(() => p);

  const constructor = {
    ...({
      variant: "segment",
    } as const),
    ...(props as Constructor),
  };

  const items = constructor.items as (Item & { api: ButtonApi })[];

  const events = { ...props } as Events;

  const initSelected =
    items.find((i) => i.value === constructor.initValue) || items[0];
  const selected: Set<Item> = new Set([initSelected]);
  const [rSelected, setRSelected] = createSignal<string[]>([
    initSelected.value,
  ]);

  const api: Api = {
    get selected() {
      return [...selected].map((s) => ({ value: s.value, label: s.label }));
    },
    select: (item: Item) => {
      selected.add(item);
      setRSelected([...selected].map((s) => s.value));
      item.api.toggleOn();
      if (events.onChange) {
        events.onChange([...selected][0]?.value);
      }
    },
    unselect: (item: Item) => {
      selected.delete(item);
      item.api.toggleOff();
      setRSelected([...selected].map((s) => s.value));
    },
  };

  const rootStyles =
    constructor.variant === "tab"
      ? {
          position: "relative",
          display: "flex",
          flexWrap: "nowrap",
          backgroundColor: "#fff",
          width: "max-content",
          height: "max-content",
        }
      : {
          padding: "4px 4px",
          gap: "4px",
          display: "flex",
          flexWrap: "nowrap",
          backgroundColor: "#fff",
          width: "max-content",
          height: "max-content",
          border: "1px solid oklch(0.3867 0 0)",
          borderRadius: "5px",
        };

  const { stylex: stylexValue, attr } = constructor["pt:root"] || {};
  return (
    <div
      {...(attr || {})}
      use:stylex={{
        ...{
          boxSizing: "border-box",
          ...rootStyles,
        },
        ...(stylexValue && typeof stylexValue === "function"
          ? stylexValue()
          : stylexValue),
      }}
    >
      <For each={items}>
        {(item) => {
          const { value, label, ...buttonProps } = item;
          buttonProps.onClick = (e: MouseEvent) => {
            if (!selected.has(item)) {
              const previous = [...selected][0];
              if (previous) {
                api.unselect(previous);
              }
              api.select(item);
            }
          };

          const rIsSelected = createMemo(() => {
            return rSelected().includes(value);
          });

          return (
            <Button
              ref={(api) => {
                item.api = api;
              }}
              variant="outline"
              togglable
              onToggle={(toggled) => {
              }}
              pt:root={{
                stylex: () => ({
                  ...{
                    // @ts-ignore
                    position: "relative",
                    border: "none",
                    pointerEvents: [[rIsSelected(), "none"], "auto"],
                  },
                  ...(constructor.variant === "tab" && {
                    borderRadius: "0px",
                    backgroundColor: [
                      [":active", "oklch(94% 0% 68deg)"],
                      [":hover", "oklch(97% 0% 68deg)"],
                      "transparent",
                    ],
                  }),
                  ...{
                    ...(constructor["pt:segment"]?.stylex &&
                      (typeof constructor["pt:segment"].stylex === "function"
                        ? constructor["pt:segment"].stylex()
                        : constructor["pt:segment"]?.stylex)),
                  },
                }),
              }}
              preventToogleOnClick
              {...{
                ...buttonProps,
                ...(selected.has(item) && {
                  initToggled: true,
                }),
              }}
            >
              <div>
                {label}
                {constructor.variant === "tab" && (
                  <Show when={rIsSelected()}>
                    <div
                      use:stylex={{
                        position: "absolute",
                        bottom: "0",
                        left: "0",
                        height: "2px",
                        width: "100%",
                        backgroundColor: "blue",
                        transition: "transform 0.3s ease",
                      }}
                    ></div>
                  </Show>
                )}
              </div>
            </Button>
          );
        }}
      </For>
    </div>
  );
}
