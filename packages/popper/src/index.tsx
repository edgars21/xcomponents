import {
  Component,
  splitProps,
  onMount,
  type JSX,
  untrack,
  children,
  createSignal,
} from "solid-js";
import * as icons from "lucide-solid";
import { type ToAccessorsCfg } from "@xcomponents/shared";
import {
  computePosition,
  offset,
  flip,
  shift,
  arrow,
  size,
  type Placement as FloatingUIPlacement,
  type MiddlewareData,
} from "@floating-ui/dom";
import { stylex, type StyleXValidSolidType } from "@stylex/solid";

export type Props = Constructor & {
  children: Slots["defaultSlot"];
} & ApiBindings;

interface Constructor {
  anchor: HTMLElement;
  placement?: FloatingUIPlacement;
  arrow?: boolean;
}

type Slots = {
  defaultSlot: JSX.Element;
};

type ApiBindings = ToAccessorsCfg<Api, true, true>;

interface Api {
  setOpen: (open: boolean) => void;
}

export default function Popper(p: Props) {
  const props = untrack(() => p);

  const constructor = {
    ...({
      placement: "bottom",
      arrow: false,
    } as const),
    ...(props as Constructor),
  };
  // const events = { ...props } as Events;
  const apiBindings = { ...props } as ApiBindings;
  const slots = {
    ...props,
    defaultSlot: children(() => props.children)(),
  } as Slots;

  const state = {
    isOpen: true,
  };

  let rootEl: HTMLElement | undefined;
  let arrowEl: HTMLElement | undefined;

  const [rAvailableHeight, setrAvailableHeight] = createSignal<number | null>(
    null
  );

  const [rComputedPosition, setrComputedPosition] = createSignal<{
    x: number;
    y: number;
    placement: FloatingUIPlacement;
    middlewareData: MiddlewareData;
    staticSide: string;
  } | null>(null);

  const api: Api = {
    setOpen: (open: boolean) => {},
  };

  async function computePopperPosition() {
    const { x, y, placement, middlewareData } = await computePosition(
      constructor.anchor,
      rootEl!,
      {
        strategy: "fixed",
        placement: constructor.placement,
        middleware: [
          offset(6),
          flip(),
          shift(),
          ...(constructor.arrow ? [arrow({ element: arrowEl! })] : []),
          size({
            apply({ availableHeight }) {
              setrAvailableHeight(availableHeight - 6);
            },
          }),
        ],
      }
    );
    setrComputedPosition({
      x,
      y,
      placement,
      middlewareData,
      staticSide: {
        top: "bottom",
        right: "left",
        bottom: "top",
        left: "right",
      }[placement.split("-")[0]!]!,
    });

    // if (this.sameWidth) {
    //   const anchorWidth = this.anchorElement.offsetWidth;

    //   this._elTooltip.style.setProperty("width", anchorWidth + "px");
    // }

    const staticSide = {
      top: "bottom",
      right: "left",
      bottom: "top",
      left: "right",
    }[placement.split("-")[0]!];
  }

  return (
    <div
      ref={(el: HTMLElement) => {
        rootEl = el;
        stylex(() => [
          el,
          {
            ...{
              position: "fixed",
              "z-index": "9999",
              top: rComputedPosition() ? `${rComputedPosition()!.y}px` : "0",
              left: rComputedPosition() ? `${rComputedPosition()!.x}px` : "0",
              ...(rComputedPosition() ? { [rComputedPosition()!.staticSide]: "-3px" } : {})
            },
          },
        ]);
      }}
    >
      <div
        ref={(el: HTMLElement) => {
          rootEl = el;
          stylex(() => [
            el,
            {
              ...{
                position: "absolute",
                width: "6px",
                height: "6px",
                transform: "rotate(45deg)",
                top: rComputedPosition() ? `${rComputedPosition()!.y}px` : "0",
                left: rComputedPosition() ? `${rComputedPosition()!.x}px` : "0",
              },
            },
          ]);
        }}
      ></div>
      {slots.defaultSlot}
    </div>
  );
}
