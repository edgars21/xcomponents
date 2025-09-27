import {
  type JSX,
  untrack,
  children,
  createSignal,
  createEffect,
  Show,
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
import Popper, {type Constructor as PopperConstructor} from "@xcomponents/popper";

export type Props = Constructor & {
  children: Slots["defaultSlot"];
} & ApiBindings;

interface Constructor {
  anchor?: HTMLElement;
  placement?: PopperConstructor["placement"];
  arrow?: boolean;
}

type Slots = {
  defaultSlot?: JSX.Element;
  tooltipSlot?: JSX.Element | string;
};

type ApiBindings = ToAccessorsCfg<Api, true, true>;

interface Api {
  setOpen: (open: boolean) => void;
}

export default function Tooltip(p: Props) {
  const props = untrack(() => p);

  const constructor = {
    ...({
      placement: "bottom",
      arrow: true,
    } as const),
    ...(props as Constructor),
  };
  // const events = { ...props } as Events;
  const apiBindings = { ...props } as ApiBindings;
  const slots = {
    ...props,
    defaultSlot: children(() => props.children)(),
  } as Slots;

  const anchorElement = (() => {
    let validAnchorElementFromSlot: HTMLElement | undefined;
    if (slots.defaultSlot) {
      const potentialElement = Array.isArray(slots.defaultSlot) ? slots.defaultSlot[0] : slots.defaultSlot;
      if (potentialElement instanceof HTMLElement) {
        validAnchorElementFromSlot = potentialElement;
      }
    }

    return validAnchorElementFromSlot || constructor.anchor;
  })()

  if (!anchorElement) {
    console.error("Popper: No anchor element provided");
    return null;
  }

  const state = {
    isOpen: false,
  };


  let rootEl: HTMLElement | undefined;
  let arrowEl: HTMLElement | undefined;

  const [rIsOpenState, setrIsOpenState] = createSignal(false);

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
    setOpen: (open: boolean) => {
      if (open === state.isOpen) return;

      console.log("calling set open", open, state.isOpen);
      state.isOpen = open;
      setrIsOpenState(open);
      queueMicrotask(() => {
        const el = document.getElementById("foo");
        computePopperPosition();
      });
    },
  };

  if (apiBindings.setOpen) {
    createEffect(() => {
      api.setOpen(
        typeof apiBindings.setOpen === "function"
          ? apiBindings.setOpen()
          : apiBindings.setOpen || false
      );
    });
  }


  return (
    <Show when={rIsOpenState()}>
      <Popper
        anchor={anchorElement}
        placement={constructor.placement}
        arrow={constructor.arrow}
        trigger={constructor.trigger}
      >
        {slots.tooltipSlot || slots.defaultSlot}
      </Popper>
    </Show>
  );
}
