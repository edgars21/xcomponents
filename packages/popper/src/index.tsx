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
} from "@floating-ui/dom";
import { stylex, type StyleXJs } from "@stylex/solid";
import {
  createEventListenerWithCleanupFactory,
  type ToAccessorsCfg,
} from "@xcomponents/shared";
false && stylex;

export type Props = Constructor & {
  children: Slots["defaultSlot"];
} & ApiBindings &
  Events;

export interface Constructor {
  ref: (api: Api) => void;
  anchor: HTMLElement;
  placement?: FloatingUIPlacement;
  arrow?: boolean;
  trigger?: "hover" | "click" | "focus" | "manual";
  autoUpdate?: boolean;
  middlewares?:
    | {
        offset?: OffsetOptions | false;
      }
    | false;
  "pt:root"?: ElementSetter;
  sameWidth?: boolean;
}
interface ElementSetter {
  attr?: Record<string, string>;
  stylex?: (() => StyleXJs) | StyleXJs;
}

type Slots = {
  defaultSlot: JSX.Element;
};

export type ApiBindings = ToAccessorsCfg<Api, true, true>;

interface Events {
  onClick?: (e: Event) => void;
}

export interface Api {
  readonly isOpen: boolean;
  open: () => void;
  close: () => void;
}

export default function Popper(p: Props) {
  const props = Object.entries(untrack(() => p))
    .filter(([_, value]) => value !== undefined)
    .reduce<any>((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {}) as Props;

  const constructor = {
    ...({
      placement: "bottom",
      arrow: false,
      trigger: "manual",
      autoUpdate: false,
      sameWidth: false,
    } as const),
    ...(props as Constructor),
  };

  const events = { ...props } as Events;

  const slots = {
    ...props,
    defaultSlot: children(() => props.children)(),
  } as Slots;

  const [addEventListenerWithCleanup, cleanupEventListeners] =
    createEventListenerWithCleanupFactory();

  let rootEl: HTMLDivElement;
  let arrowEl: HTMLDivElement | undefined;

  let isOpen = false;
  const [rIsOpen, setrIsOpen] = createSignal(false);

  let openCleanup: (() => void) | undefined;

  const api: Api = {
    get isOpen() {
      return isOpen;
    },
    open: () => {
      if (isOpen) return;
      isOpen = true;
      setrIsOpen(true);
      setTimeout(() => {
        openCleanup = addEventListenerWithCleanup(
          window,
          "click",
          (e: Event) => {
            if (!rootEl!.contains(e.target as Node)) {
              api.close();
            }
          }
        );
      }, 0);
    },
    close: () => {
      if (!isOpen) return;
      isOpen = false;
      setrIsOpen(false);
      if (openCleanup) {
        openCleanup();
      }
    },
  };

  // if (apiBindings.setOpen) {
  //   createEffect(() => {
  //     api.setOpen(
  //       typeof apiBindings.setOpen === "function"
  //         ? apiBindings.setOpen()
  //         : apiBindings.setOpen || false
  //     );
  //   });
  // }

  onMount(() => {
    if (constructor.trigger !== "manual") {
      switch (constructor.trigger) {
        case "click":
          addEventListenerWithCleanup(constructor.anchor, "click", () => {
            if (isOpen) {
              api.close();
            } else {
              api.open();
            }
          });
          break;
        case "hover":
          addEventListenerWithCleanup(constructor.anchor, "mouseenter", () => {
            function onMouseLeave() {
              api.close();
            }
            constructor.anchor.addEventListener("mouseleave", onMouseLeave, {
              once: true,
            });
            api.open();
          });
          break;
      }
    }
    if (constructor.ref) {
      constructor.ref(api);
    }
  });

  onCleanup(() => {
    cleanupEventListeners();
  });

  const { stylex: stylexValue, attr } = constructor["pt:root"] || {};
  return (
    <Show when={rIsOpen()}>
      {(() => {
        const rootStyles = {
          border: "1px solid gray",
          borderRadius: "4px",
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;",
          backgroundColor: "#fff",
          ...(stylexValue && typeof stylexValue === "function"
            ? stylexValue()
            : stylexValue),
        };

        let [borderSize, borderTyp, borderColor] =
          typeof rootStyles.border === "string"
            ? rootStyles.border.split(" ")
            : [];

        // @ts-ignore
        if (rootStyles.borderColor) {
          // @ts-ignore
          borderColor = rootStyles.borderColor;
        }

        const haveBorder = !!borderSize && !!borderTyp && !!borderColor;

        const staticSide = {
          top: "bottom",
          right: "left",
          bottom: "top",
          left: "right",
        }[constructor.placement.split("-")[0]!]!;

        const arrowStyles = {
          // @ts-ignore
          backgroundColor: rootStyles.backgroundColor,
          ...(haveBorder && {
            border: `${borderSize} ${borderTyp}`,
            borderColor: diamondBorderColor(staticSide as Side, borderColor),
          }),
        };

        const [rArrowPos, setrArrowPos] = createSignal<{
          x: number;
          y: number;
        }>();

        return (
          <div
            {...(attr || {})}
            ref={async (el) => {
              rootEl = el;
              const update = async () => {
                const { x, y, placement, middlewareData } =
                  await computePosition(constructor.anchor, rootEl, {
                    strategy: "fixed",
                    placement: constructor.placement,
                    middleware: [
                      ...(constructor?.middlewares === false
                        ? []
                        : [
                            ...(constructor?.middlewares?.offset === false
                              ? []
                              : [
                                  offset(constructor?.middlewares?.offset ?? 6),
                                ]),
                            // flip(),
                            shift({ crossAxis: true, padding: 3 }),
                          ]),
                      ...(constructor.arrow
                        ? [arrow({ element: arrowEl! })]
                        : []),
                    ],
                  });
                stylex(rootEl!, () => ({
                  top: `${y}px`,
                  left: `${x}px`,
                  visibility: "visible",
                }));
                if (middlewareData.arrow) {
                  setrArrowPos({
                    x: middlewareData.arrow.x || 0,
                    y: middlewareData.arrow.y || 0,
                  });
                }
              };
              if (constructor.autoUpdate) {
                const cleanup = autoUpdate(constructor.anchor, rootEl, update);
              } else {
                update();
              }
            }}
            use:stylex={{
              ...{
                ...rootStyles,
                position: "fixed",
                zIndex: "9999",
                visibility: "hidden",
                top: 0,
                left: 0,
                ...(constructor.sameWidth && {
                  width: `${constructor.anchor.offsetWidth}px`,
                }),
              },
            }}
            {...{
              ...(events.onClick && {
                onClick: (e: Event) => {
                  events.onClick!(e);
                },
              }),
            }}
          >
            {constructor.arrow ? (
              <div
                ref={arrowEl}
                use:stylex={{
                  ...{
                    ...arrowStyles,
                    boxSizing: "border-box",
                    width: "6px",
                    height: "6px",
                    position: "absolute",
                    top: (rArrowPos()?.y || 0) + "px",
                    left: (rArrowPos()?.x || 0) + "px",
                    transform: "rotate(45deg)",
                    [staticSide]: "-3px",
                  },
                }}
              ></div>
            ) : null}
            <span>{slots.defaultSlot}</span>
          </div>
        );
      })()}
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
      return `${color} ${transparent} ${transparent} ${color}`;
    case "right":
      return `${color} ${color} ${transparent} ${transparent}`;
    case "bottom":
      return `${transparent} ${color} ${color} ${transparent}`;
    case "left":
      return `${transparent} ${transparent} ${color} ${color}`;
  }
}
