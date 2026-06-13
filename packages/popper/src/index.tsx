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
false && stylex;
declare module "solid-js" {
  namespace JSX {
    interface Directives {
      stylex: StylexDefinition;
    }
  }
}

export type PopperProps = PopperConstructor & PopperEvents;

export interface PopperConstructor {
  ref?: ((api: PopperApi) => void) | null;
  children: JSX.Element;
  anchor: HTMLElement;
  placement?: FloatingUIPlacement;
  arrow?:
    | boolean
    | {
        size?: number;
        color?: string;
        bgColor?: string;
        stylex?: StylexDefinition;
      };
  trigger?: "hover" | "click" | "focus" | "manual";
  autoUpdate?: boolean;
  middlewares?: {
    offset?: OffsetOptions;
  } | null;
  "pt:root"?: StylexDefinitionWithMtransition | null;
  sameWidth?: boolean;
  strategy?: Strategy;
  teleportTo?: HTMLElement | null;
}

interface PopperEvents {
  onClick?: (e: Event) => void;
  onOpen?: (api: PopperApi) => void;
  onClose?: (api: PopperApi) => void;
}

export interface PopperApi {
  readonly isOpen: boolean;
  open: () => void;
  close: () => void;
}

type tety = Required<OptionalProps<PopperConstructor>>;

function setDefaults<T extends Record<string, any>>(
  value: T,
  defaults: Required<OptionalProps<T>>,
): Required<T> {
  return {
    ...defaults,
    ...Object.entries(value)
      .filter(([_, value]) => value !== undefined)
      .reduce((obj: any, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {} as Required<T>),
  };
}

type OptionalProps<T> = {
  [K in keyof T as {} extends Pick<T, K> ? K : never]?: T[K];
};

type RequiredProps<T> = {
  [K in keyof T as {} extends Pick<T, K> ? never : K]: T[K];
};

type test = OptionalProps<PopperConstructor>;
type test2 = RequiredProps<PopperConstructor>;

export function Popper(props: PopperProps) {
  const untrackedProps = untrack(() => props);
  const constructorProps = untrackedProps as PopperConstructor;
  const constructor = setDefaults(constructorProps, {
    ref: null,
    placement: "bottom",
    arrow: false,
    trigger: "manual",
    autoUpdate: false,
    sameWidth: false,
    strategy: "fixed",
    middlewares: null,
    "pt:root": null,
    teleportTo: null,
  });
  const events = { ...untrackedProps } as PopperEvents;

  const [addEventListenerWithCleanup, cleanupEventListeners] =
    createEventListenerWithCleanupFactory();
  let autoUpdateCleanup: (() => void) | undefined;

  let rootElement: HTMLDivElement;
  let arrowElement: HTMLDivElement | undefined;

  let isOpen = false;
  const [rIsOpen, setrIsOpen] = createSignal(false);

  let openCleanup: (() => void) | undefined;

  const api: PopperApi = {
    get isOpen() {
      return isOpen;
    },
    open: () => {
      if (isOpen) return;
      isOpen = true;
      setrIsOpen(true);
      if (events.onOpen) {
        events.onOpen(api);
      }
      setTimeout(() => {
        openCleanup = addEventListenerWithCleanup(
          window,
          "click",
          (e: Event) => {
            if (!rootElement!.contains(e.target as Node)) {
              api.close();
            }
          },
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
      if (events.onClose) {
        events.onClose(api);
      }
    },
  };

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
    if (autoUpdateCleanup) {
      autoUpdateCleanup();
    }
    if (openCleanup) {
      openCleanup();
    }
  });

  const mountTransition = constructor["pt:root"]?.mtransition;
  return (
    <OptionalWrapper
      when={!!mountTransition}
      wrap={(children: JSX.Element) => {
        const castMountTransition = mountTransition as Mtransition;
        // @ts-ignore
        return <Transition transition={castMountTransition}>{children}</Transition>;
      }}
    >
      <Show when={rIsOpen()}>
        {(() => {
          const staticSide = {
            top: "bottom",
            right: "left",
            bottom: "top",
            left: "right",
          }[constructor.placement.split("-")[0]!]!;

          const [rRootPos, setrRootPos] = createSignal<{
            x: number;
            y: number;
          }>();

          const [rArrowPos, setrArrowPos] = createSignal<{
            x: number;
            y: number;
          }>();

          return (
            <OptionalWrapper
              when={!!constructor.teleportTo}
              wrap={(children: JSX.Element) => {
                const casetTeleportTo = constructor.teleportTo as HTMLElement;
                return <Portal mount={casetTeleportTo}>{children}</Portal>;
              }}
            >
              <div
                ref={async (el) => {
                  rootElement = el;
                  const update = async () => {
                    const { x, y, placement, middlewareData } =
                      await computePosition(constructor.anchor, rootElement, {
                        strategy: constructor.strategy,
                        placement: constructor.placement,
                        middleware: [
                          ...(constructor.middlewares
                            ? [shift({ crossAxis: true, padding: 3 })]
                            : [offset(6)]),
                          // ...(constructor.middlewares
                          //   ? [
                          //       ...(constructor.middlewares.offset
                          //         ? []
                          //         : [
                          //             offset(
                          //               constructor?.middlewares?.offset ?? 6,
                          //             ),
                          //           ]),
                          //       // flip(),
                          //       shift({ crossAxis: true, padding: 3 }),
                          //     ])
                          //   : [],
                          ...(constructor.arrow
                            ? [arrow({ element: arrowElement! })]
                            : []),
                        ],
                      });

                    setrRootPos({ x, y });
                    if (middlewareData.arrow) {
                      setrArrowPos({
                        x: middlewareData.arrow.x || 0,
                        y: middlewareData.arrow.y || 0,
                      });
                    }
                  };
                  if (constructor.autoUpdate) {
                    autoUpdateCleanup = autoUpdate(
                      constructor.anchor,
                      rootElement,
                      update,
                    );
                  } else {
                    update();
                  }

                  stylex(rootElement!, () => ({
                    width: "max-content",
                    height: "max-content",
                    position: constructor.strategy,
                    zIndex: "9999",
                    top: `${rRootPos()?.y || 0}px`,
                    left: `${rRootPos()?.x || 0}px`,
                    ...(constructor.sameWidth && {
                      width: `${constructor.anchor.offsetWidth}px`,
                    }),
                  }));
                }}
                {...{
                  ...(events.onClick && {
                    "on:click": (e: Event) => {
                      events.onClick!(e);
                    },
                  }),
                }}
              >
                {constructor.arrow &&
                  (() => {
                    const {
                      size,
                      color,
                      bgColor,
                      stylex: stylexDeclaration,
                    } = typeof constructor.arrow === "object"
                      ? constructor.arrow
                      : {};
                    return (
                      <div
                        ref={arrowElement}
                        use:stylex={mergeStylexDefinitions(
                          {
                            boxSizing: "border-box",
                            width: "6px",
                            height: "6px",
                            position: "absolute",
                            top: (rArrowPos()?.y || 0) + "px",
                            left: (rArrowPos()?.x || 0) + "px",
                            transform: "rotate(45deg)",
                            [staticSide]: "-3px",
                            ...(color && {
                              borderColor: color,
                            }),
                            ...(size && {
                              borderWidth: size,
                            }),
                            ...(bgColor && {
                              backgroundColor: bgColor,
                            }),
                          },
                          stylexDeclaration,
                        )}
                      ></div>
                    );
                  })()}
                {constructor.children}
              </div>
            </OptionalWrapper>
          );
        })()}
      </Show>
    </OptionalWrapper>
  );
}

function OptionalWrapper({
  when,
  wrap,
  children,
}: {
  when: boolean;
  wrap: (children: JSX.Element) => JSX.Element;
  children: JSX.Element;
}) {
  return when ? wrap(children) : children;
}

type Side = "top" | "right" | "bottom" | "left";
