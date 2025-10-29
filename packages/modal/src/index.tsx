import {
  untrack,
  onMount,
  onCleanup,
  type JSX,
  createSignal,
  Show,
} from "solid-js";
import type * as CSS from "csstype";
import { stylex, type StyleXValidSolidType } from "@stylex/solid";
import Button from "@xcomponents/button";
false && stylex;

export type Props = Constructor & Slots & Events;

interface ElementSetter {
  attr?: Record<string, string>;
  stylex?: (() => StyleXValidSolidType) | StyleXValidSolidType;
}

export interface Constructor {
  ref?: (api: Api) => void;
  offset?: CSS.Properties["width"];
  position?:
    | "top"
    | "center"
    | "bottom"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "bottom-left"
    | "bottom-right";
  width?: CSS.Properties["width"];
  height?: CSS.Properties["height"];
  value?: string;
  closeOnOutsideClick?: boolean;
  showCloseButton?: boolean;
  autoOpen?: boolean;
  "pt:root"?: ElementSetter;
  "pt:floating"?: ElementSetter;
  "pt:shadow"?: ElementSetter;
  "pt:actions"?: ElementSetter;
}

interface Slots {
  children?: JSX.Element;
}

export interface Api {
  readonly isOpen: boolean;
  open: () => void;
  close: () => void;
}

interface Events {
  onClose?: () => void;
}

export default function Modal(p: Props) {
  const props = untrack(() => p);

  const constructor = {
    position: "center",
    width: "600px",
    height: "max-content",
    offset: "20px",
    closeOnOutsideClick: true,
    showCloseButton: true,
    autoOpen: false,
    ...({} as const),
    ...(props as Constructor),
  };

  const events = { ...props } as Events;

  const state = {
    isOpen: false,
  };

  let overflow: { x: string; y: string } | null = null;

  const [rOpeningClosing, setrOpeningClosing] = createSignal(state.isOpen);

  const api: Api = {
    get isOpen() {
      return state.isOpen;
    },
    open: () => {
      const bodyStyles = window.getComputedStyle(document.body);
      overflow = {
        y: bodyStyles.getPropertyValue("overflow-y"),
        x: bodyStyles.getPropertyValue("overflow-x"),
      };
      document.body.style.overflowY = "hidden";
      document.body.style.overflowX = "hidden";
      state.isOpen = true;
      setrOpeningClosing(true);
    },
    close: () => {
      if (overflow) {
        document.body.style.overflowY = overflow.y;
        document.body.style.overflowX = overflow.x;
        overflow = null;
      }
      state.isOpen = false;
      setrOpeningClosing(false);
      events.onClose?.();
    },
  };

  if (constructor.autoOpen) {
    api.open();
  }

  if (constructor.ref) {
    constructor.ref(api);
  }

  return (
    <Show when={rOpeningClosing()}>
      <div
        {...constructor?.["pt:root"]?.attr}
        use:stylex={{
          position: "fixed",
          inset: "0",
          zIndex: "9999",
          display: "flex",
          padding: constructor.offset + "",
          ...(constructor?.["pt:root"]?.stylex &&
            (typeof constructor["pt:root"].stylex === "function"
              ? constructor["pt:root"].stylex()
              : constructor["pt:root"].stylex)),
        }}
      >
        <div
          {...constructor?.["pt:shadow"]?.attr}
          use:stylex={{
            position: "absolute",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            inset: "0",
            zIndex: "-1",
            ...(constructor?.["pt:shadow"]?.stylex &&
              (typeof constructor["pt:shadow"].stylex === "function"
                ? constructor["pt:shadow"].stylex()
                : constructor["pt:shadow"].stylex)),
          }}
          {...(constructor?.closeOnOutsideClick && {
            onClick: () => {
              api.close();
            },
          })}
        ></div>
        <div
          {...constructor?.["pt:floating"]?.attr}
          use:stylex={{
            overflow: "auto",
            position: "relative",
            width: constructor.width + "",
            height: constructor.height + "",
            maxWidth: "100%",
            maxHeight: "100%",
            backgroundColor: "#fff",
            color: "#000",
            borderRadius: "8px",
            padding: "20px",
            margin: "auto",
            boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
            boxSizing: "border-box",
            ...(constructor?.["pt:floating"]?.stylex &&
              (typeof constructor["pt:floating"].stylex === "function"
                ? constructor["pt:floating"].stylex()
                : constructor["pt:floating"].stylex)),
          }}
        >
          {constructor.showCloseButton && (
            <div
              {...constructor?.["pt:actions"]?.attr}
              use:stylex={{
                position: "absolute",
                top: "2px",
                right: "2px",
                ...(constructor?.["pt:actions"]?.stylex &&
                  (typeof constructor["pt:actions"].stylex === "function"
                    ? constructor["pt:actions"].stylex()
                    : constructor["pt:actions"].stylex)),
              }}
            >
              <Button icon="x" size="small" onClick={() => api.close()} />
            </div>
          )}
          {props.children}
        </div>
      </div>
    </Show>
  );
}
