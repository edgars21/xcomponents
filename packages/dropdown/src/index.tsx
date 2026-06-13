import {
  type JSX,
  untrack,
  children,
  createSignal,
  createEffect,
  Show,
  onCleanup,
  onMount,
} from "solid-js";
import * as icons from "lucide-solid";
import {
  computePosition,
  offset,
  flip,
  shift,
  arrow,
  size,
  autoUpdate,
  type Placement as FloatingUIPlacement,
  type MiddlewareData,
  type OffsetOptions,
  type Strategy,
} from "@floating-ui/dom";
import {
  stylex,
  type StylexDefinition,
  type StylexDefinitionWithMtransition,
  type Mtransition,
  mergeStylexDefinitions,
  animate,
} from "@stylex3/solid";
import { createEventListenerWithCleanupFactory } from "@xcomponents2/shared/webApi";
import { Transition } from "@xcomponents2/shared/transition";
import { Portal } from "solid-js/web";
import { Popper, type PopperApi, type PopperProps } from "@xcomponents2/popper";
false && stylex;
declare module "solid-js" {
  namespace JSX {
    interface Directives {
      stylex: StylexDefinition;
    }
  }
}

export type DropdownProps = PopperProps;
export type DropdownApi = PopperApi;

export function Dropdown(props: DropdownProps) {
  return (
    // @ts-ignore
    <Popper
      {...{
        ...props,
        "pt:root": mergeStylexDefinitions(
          {
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "4px",
            overflow: "hidden",
            // @ts-ignore
            mtransition: {
              insert: {
                transform: animate(
                  "translateY(-10px)",
                  {
                    duration: 300,
                  },
                  "translateY(0)",
                ),
                opacity: animate(
                  0,
                  {
                    duration: 300,
                  },
                  1,
                ),
              },
              remove: {
                transform: animate(
                  "translateY(-10px)",
                  {
                    duration: 300,
                  },
                  "translateY(0)",
                ),
                opacity: animate(
                  0,
                  {
                    duration: 300,
                  },
                  1,
                ),
              },
            },
          },
          props["pt:root"],
        ),
        middlewares: { offset: 4 },
      }}
    />
  );
}
