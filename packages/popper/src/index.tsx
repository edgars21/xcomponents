import {
  type JSX,
  untrack,
  children,
  createSignal,
  createEffect,
  Show,
  onCleanup,
} from "solid-js";
import * as icons from "lucide-solid";
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
import {
  createEventListenerWithCleanupFactory,
  type ToAccessorsCfg,
} from "@xcomponents/shared";

export type Props = Constructor & {
  children: Slots["defaultSlot"];
} & ApiBindings;

export interface Constructor {
  anchor: HTMLElement;
  placement?: FloatingUIPlacement;
  arrow?: boolean;
  trigger?: "hover" | "click" | "focus" | "manual";
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
      trigger: "manual",
    } as const),
    ...(props as Constructor),
  };
  // const events = { ...props } as Events;
  const apiBindings = { ...props } as ApiBindings;
  const slots = {
    ...props,
    defaultSlot: children(() => props.children)(),
  } as Slots;

  const [addEventListenerWithCleanup, cleanupEventListeners] =
    createEventListenerWithCleanupFactory();

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
      console.log("lettting trough");
      state.isOpen = open;
      setrIsOpenState(open);
      queueMicrotask(() => {
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

  if (constructor.trigger !== "manual") {
    switch (constructor.trigger) {
      case "click":
        addEventListenerWithCleanup(constructor.anchor, "click", () => {
          function onOutsideClick(e: MouseEvent) {
            console.log("outside click", e.target);

            if (!rootEl!.contains(e.target as Node)) {
              api.setOpen(false);
              window.removeEventListener("click", onOutsideClick);
            }
          }

          if (state.isOpen) {
            api.setOpen(false);
          } else {
            setTimeout(() => {
              window.addEventListener("click", onOutsideClick);
            }, 0);
            console.log("need to open: ", !state.isOpen);
            api.setOpen(true);
          }
        });
        break;
      case "hover":
        addEventListenerWithCleanup(constructor.anchor, "mouseenter", () => {
          function onMouseLeave() {
            api.setOpen(false);
          }
          constructor.anchor.addEventListener("mouseleave", onMouseLeave, {
            once: true,
          });
          api.setOpen(true);
        });
        break;
    }
  }

  async function computePopperPosition() {
    const { x, y, placement, middlewareData } = await computePosition(
      constructor.anchor,
      rootEl!,
      {
        strategy: "fixed",
        placement: constructor.placement,
        middleware: [
          offset(6),
          // flip(),
          shift({ crossAxis: true, padding: 3 }),
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

  onCleanup(() => {});

  return (
    <Show when={rIsOpenState()}>
      <div
        ref={(el: HTMLElement) => {
          rootEl = el;
          stylex(() => [
            el,
            {
              ...{
                position: "fixed",
                border: "1px solid gray",
                "border-radius": "4px",
                "box-shadow": "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;",
                "background-color": "#fff",
                "z-index": "9999",
                top: rComputedPosition() ? `${rComputedPosition()!.y}px` : "0",
                left: rComputedPosition() ? `${rComputedPosition()!.x}px` : "0",
              },
            },
          ]);
        }}
      >
        <div
          ref={(el: HTMLElement) => {
            arrowEl = el;
            stylex(() => [
              el,
              {
                ...{
                  position: "absolute",
                  border: "1px solid",
                  borderColor: rComputedPosition()
                    ? diamondBorderColor(
                        rComputedPosition()!.staticSide as Side,
                        "#9ca3af"
                      )
                    : "transparent",
                  "background-color": "#fff",
                  "box-sizing": "border-box",
                  width: "6px",
                  height: "6px",
                  top: rComputedPosition()
                    ? `${rComputedPosition()!.middlewareData?.arrow?.y}px`
                    : "0",
                  left: rComputedPosition()
                    ? `${rComputedPosition()!.middlewareData?.arrow?.x}px`
                    : "0",
                  transform: "rotate(45deg)",
                  ...(rComputedPosition()
                    ? { [rComputedPosition()!.staticSide]: "-3px" }
                    : {}),
                },
              },
            ]);
          }}
        ></div>
        <span>{slots.defaultSlot}</span>
      </div>
    </Show>
  );
}

type Side = "top" | "right" | "bottom" | "left";

function diamondBorderColor(
  outside: Side,
  color: string,
  transparent = "transparent"
) {
  switch (outside) {
    case "top":
      return `${color} ${transparent} ${transparent} ${color}`; // top + left
    case "right":
      return `${color} ${color} ${transparent} ${transparent}`; // top + right
    case "bottom":
      return `${transparent} ${color} ${color} ${transparent}`; // right + bottom
    case "left":
      return `${transparent} ${transparent} ${color} ${color}`; // bottom + left
  }
}
