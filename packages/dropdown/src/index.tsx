// @ts-nocheck
import { type JSX, untrack, children, For, createSignal } from "solid-js";
import Popper, {
  type Constructor as PopperConstructor,
  type ApiBindings as PopperApiBindings,
  type Api as PopperApi,
} from "@xcomponents/popper";
import { stylex, type StyleXJs } from "@stylex/solid";
import Button, { type Props as ButtonProps } from "@xcomponents/button";
import Menu, { type Props as MenuProps } from "@xcomponents/menu";
import { normalizeSlot } from "@xcomponents/shared";

false && stylex;

export type Props = Constructor & Events;

export interface Constructor {
  ref?: (api: Api) => void;
  menu?: MenuProps;
  anchor: HTMLElement | JSX.Element;
  placement?: PopperConstructor["placement"];
  trigger?: PopperConstructor["trigger"];
  closeOnMenuAction?: boolean;
  closeOnInsideClick?: boolean;
}

interface Slots {
  children?: JSX.Element;
}

interface ElementSetter {
  attr?: Record<string, string>;
  stylex?: (() => StyleXJs) | StyleXJs;
}

export type Api = PopperApi;

enum ContentType {
  Menu,
  Custom,
}

interface Events {
  onClick?: (e: Event) => void;
}

export default function Dropdown(p: Props) {
  const props = untrack(() => p);

  const constructor = {
    ...({
      trigger: "click",
      closeOnMenuAction: false,
      closeOnInsideClick: false,
    } as const),
    ...(props as Constructor),
  };

  const potentialAnchoreElement =
    constructor.anchor instanceof HTMLElement
      ? constructor.anchor
      : normalizeSlot(constructor.anchor);
  if (!(potentialAnchoreElement instanceof HTMLElement)) {
    console.error("Invalid anchor element");
    return null;
  }

  const anchor = potentialAnchoreElement;

  const slots = {
    ...props,
  } as Slots;

  const events = {
    ...props,
  } as Events;

  const contentType =
    slots.children && !constructor.menu ? ContentType.Custom : ContentType.Menu;

  let menuApi: PopperApi;

  const oldOnClick = events.onClick;
  events.onClick = (e: Event) => {
    if (oldOnClick) {
      oldOnClick(e);
    }
    if (constructor.closeOnInsideClick) {
      menuApi.close();
    }
  };

  return (
    <>
     {constructor.anchor instanceof HTMLElement ? null : constructor.anchor}
      <Popper
        sameWidth
        ref={(api) => {
          menuApi = api;
          if (constructor.ref) {
            constructor.ref(api);
          }
        }}
        pt:root={{
          stylex: {
            boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
            border: "1px solid #e0e0e0",
            backgroundColor: "#fff",
            borderRadius: "8px",
            overflow: "hidden",
          },
        }}
        anchor={anchor}
        placement={constructor.placement}
        trigger={constructor.trigger}
        {...{
          ...(events.onClick && {
            onClick: (e: Event) => {
              events.onClick!(e);
            },
          }),
        }}
      >
        {(() => {
          if (constructor.menu) {
            const oldMenuAction = constructor.menu?.onAction;
            constructor.menu.onAction = () => {
              if (oldMenuAction) {
                oldMenuAction();
              }
              if (constructor.closeOnMenuAction) {
                menuApi.close();
              }
            };

            return (
              <Menu
                {...constructor.menu}
                pt:root={{
                  stylex: {
                    width: "100%",
                  },
                }}
              />
            );
          } else {
            return slots.children!;
          }
        })()}
      </Popper>
    </>
  );
}
