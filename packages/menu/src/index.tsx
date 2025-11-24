import { type JSX, untrack, children, For } from "solid-js";
import Popper, {
  type Constructor as PopperConstructor,
  type ApiBindings as PopperApiBindings,
} from "@xcomponents/popper";
import { stylex, type StyleXJs } from "@stylex/solid";
import Button, {type Props as ButtonProps} from "@xcomponents/button";

false && stylex;

export type Props = Constructor;

export interface Constructor {
  items: { value: string; label: string, "pt:button"?: ButtonProps }[];
  align?: "start" | "center" | "end";
  "pt:root"?: ElementSetter;
}

interface ElementSetter {
  attr?: Record<string, string>;
  stylex?: (() => StyleXJs) | StyleXJs;
}

export default function Menu(p: Props) {
  const props = untrack(() => p);

  const constructor = {
    ...({
      align: "start",
    } as const),
    ...(props as Constructor),
  };


  const { stylex: stylexValue, attr } = constructor["pt:root"] || {};
  return (
    <div
      {...(attr || {})}
      use:stylex={{
        ...{
          border: "1px solid #ccc",
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
        {(item) => (<Button
          align={constructor.align}
          variant="ghost"
          pt:root={{
            stylex: {
              width: "100%",
            }
          }}
          {...item["pt:button"]}
        >{item.label}</Button>
        )}
      </For>

    </div>
  );
}
