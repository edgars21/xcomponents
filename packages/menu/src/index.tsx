import {
  splitProps,
  type JSX,
  onMount,
  createSignal,
  Show,
  Component,
} from "solid-js";
import { Dynamic } from "solid-js/web";
import Icon, { type Props as IconProps } from "@xcomponents2/icon";
import ProgressCircle from "@xcomponents2/progress-circle";
import {
  stylex,
  type StylexDefinition,
  mergeStylexDefinitions,
} from "@stylex/solid";
import { Button } from "@xcomponents2/button";
false && stylex;

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      stylex: StylexDefinition;
    }
  }
}

export type MenuProps = MenuConstructor & MenuEvents;
type Options = { value: string; label: string }[];

type MenuConstructor = {
  ref?: (api: Api) => void;
  options: Options;
  "pt:root"?: StylexDefinition;
};

export type MenuEvents = {
  onSelect: (value: string) => void;
};

export interface Api {
  element: HTMLInputElement;
}

export function Menu(props: MenuProps): JSX.Element {
  let rootElement: HTMLInputElement;

  const [constructor, elementAttributesAndEventListeners] = splitProps(props, [
    "ref",
    "pt:root",
    "options",
  ]);

  const api: Api = {
    get element() {
      return rootElement!;
    },
  };

  onMount(() => {
    if (props.ref) {
      props.ref(api);
    }
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
        <Button
          label={option.label}
          onClick={() => props.onSelect(option.value)}
          pt:root={{
            border: "none",
            borderRadius: "0",
            padding: "8px 12px",
            backgroundColor: [[":hover", "#cecece"],"#fff"],
          }}
        />
        // <div onClick={() => props.onSelect(option.value)}>{option.label}</div>
      ))}
    </div>
  );
}
