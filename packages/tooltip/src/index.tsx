import { type JSX, untrack, children } from "solid-js";
import Popper, {
  type Constructor as PopperConstructor,
  type ApiBindings as PopperApiBindings,
} from "@xcomponents/popper";

export type Props = {
  children?: Slots["defaultSlot"];
} & Omit<Slots, "defaultSlot"> &
  Constructor &
  ApiBindings;

export interface Constructor {
  anchor?: HTMLElement;
  placement?: PopperConstructor["placement"];
  trigger?: PopperConstructor["trigger"];
  arrow?: boolean;
}

export type Slots = {
  defaultSlot?: JSX.Element;
  tooltipSlot: JSX.Element | string;
};

export type ApiBindings = PopperApiBindings;

export default function Tooltip(p: Props) {
  const props = untrack(() => p);

  const constructor = {
    ...({
      placement: "bottom",
      arrow: true,
      trigger: "hover",
    } as const),
    ...(props as Constructor),
  };
  // const events = { ...props } as Events;
  const apiBindings = { ...props } as ApiBindings;
  const slots = {
    ...props,
    defaultSlot: children(() => props.children)(),
  } as Slots;

  const validAnchorElementFromDefaultSlot = (() => {
    if (slots.defaultSlot) {
      const potentialElement = Array.isArray(slots.defaultSlot)
        ? slots.defaultSlot[0]
        : slots.defaultSlot;
      if (potentialElement instanceof HTMLElement) {
        return potentialElement;
      }
    }
  })();

  if (!validAnchorElementFromDefaultSlot && !constructor.anchor) {
    console.error("Popper: No anchor element provided");
    return null;
  }

  console.log("anchor is : ", constructor.anchor || validAnchorElementFromDefaultSlot)

  return (
    <>
      {!constructor.anchor ? validAnchorElementFromDefaultSlot : null}
      <Popper
        stylex={{
          padding: "5px",
          "font-size": "14px",
          "color": "#fff",
          border: "none",
          "box-shadow": "unset",
          "background-color": "#fff",
        }}
        anchor={(constructor.anchor || validAnchorElementFromDefaultSlot)!}
        placement={constructor.placement}
        arrow={constructor.arrow}
        trigger={constructor.trigger}
        setOpen={apiBindings.setOpen}
      >
        {slots.tooltipSlot}
      </Popper>
    </>
  );
}
