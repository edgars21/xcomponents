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
import {
  Button,
  type ButtonApi,
  ButtonProps,
  type ButtonConstructor,
} from "@xcomponents2/button";
import {
  type MenuProps,
  type MenuEvents,
  type MenuConstructor,
  type MenuApi,
  Menu,
} from "@xcomponents2/menu";
false && stylex;

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      stylex: StylexDefinition;
    }
  }
}

export type SegmentsProps = MenuProps & Partial<SegmentsEvents>;
export type SegmentsEvents = MenuEvents;
export type SegmentsApi = MenuApi;

export function Segments(props: SegmentsProps): JSX.Element {
  const [constructor, elementAttributesAndEventListeners] = splitProps(props, [
    "pt:root",
  ]);

  return (
    <Menu
      {...{
        ...props,
        "pt:root": mergeStylexDefinitions(
          {
            width: "max-content",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "2px",
            backgroundColor: "red",
            padding: "2px"
          },
          constructor["pt:root"],
        ),
      }}
    />
  );
}
