// @ts-nocheck
import { type JSX, untrack, children, For, createSignal } from "solid-js";
import Popper, {
  type Constructor as PopperConstructor,
  type ApiBindings as PopperApiBindings,
} from "@xcomponents/popper";
import { stylex, type StyleXJs } from "@stylex/solid";
import Button, { type Props as ButtonProps } from "@xcomponents/button";

false && stylex;

export type Props = Constructor & Events;

type Item = ItemValue & ButtonProps;
type ItemValue = { value: string; label: string, onAction?: () => void };
export interface Constructor {
  items: Item[];
  align?: "start" | "center" | "end";
  "pt:root"?: ElementSetter;
  startSpace?: number | boolean;
}

interface ElementSetter {
  attr?: Record<string, string>;
  stylex?: (() => StyleXJs) | StyleXJs;
}

interface Events {
  onAction?: () => void;
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
      align: "start",
      startSpace: true,
    } as const),
    ...(props as Constructor),
  };
  
  const events = { ...props } as Events;

  const hasStartAdornment = !!props.items.find(
    (i) => !!i?.startSlot || !!i.startIcon || (!!i.caretLeading && i.caret)
  );
  const startSpace = hasStartAdornment
    ? typeof constructor.startSpace === "number"
      ? constructor.startSpace
      : constructor.startSpace === true
      ? 16
      : 0
    : 0;

  const selected: Set<Item> = new Set();
  const [rSelected, setRSelected] = createSignal<string[]>([]);

  const api: Api = {
    get selected() {
      return [...selected].map((s) => ({ value: s.value, label: s.label }));
    },
    select: (item: Item) => {
      selected.add(item);
      setRSelected([...selected].map((s) => s.value));
      if (events.onAction) {
        events.onAction();
      }
    },
    unselect: (item: Item) => {
      selected.delete(item);
      setRSelected([...selected].map((s) => s.value));
      if (events.onAction) {
        events.onAction();
      }
    },
  };

  const { stylex: stylexValue, attr } = constructor["pt:root"] || {};
  return (
    <div
      {...(attr || {})}
      use:stylex={{
        ...{
          padding: "8px 0",
          backgroundColor: "#fff",
          width: "max-content",
          height: "max-content",
        },
        ...(stylexValue && typeof stylexValue === "function"
          ? stylexValue()
          : stylexValue),
      }}
    >
      <For each={props.items}>
        {(item) => {
          const { value, label, ...buttonProps } = item;
          const oldClick = buttonProps.onClick;
          buttonProps.onClick = (e: MouseEvent) => {
            if (selected.has(item)) {
              api.unselect(item);
            } else {
              api.select(item);
            }

            if (item.onAction) {
              item.onAction();
            }

            if (oldClick) {
              oldClick(e);
            }
          };
          const startSpaceAdornment =
            startSpace &&
            !item?.startSlot &&
            !item.startIcon &&
            !(item.caretLeading && !item.caret) ? (
              <div
                style={{
                  width: `${startSpace}px`,
                  height: `${startSpace}px`,
                }}
              ></div>
            ) : null;
          return (
            <Button
              align={constructor.align}
              variant="ghost"
              {...(rSelected().includes(item.value) && {

                "should-be-here": true,
              })}
              pt:root={{
                stylex: () => ({
                  // @ts-ignore
                  log: true,
                  width: "100%",
                  ...(rSelected().includes(item.value) && {
                    backgroundColor: [
                      [":hover", "rgba(0, 0, 0, 0.25)"],
                      "rgba(0, 0, 0, 0.2)",
                    ],
                  }),
                }),
              }}
              {...buttonProps}
              {...(startSpaceAdornment && { startSlot: startSpaceAdornment })}
            >
              {label}
            </Button>
          );
        }}
      </For>
    </div>
  );
}
