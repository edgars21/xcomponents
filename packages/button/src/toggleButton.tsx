import {
  splitProps,
  type JSX,
} from "solid-js";
import {
  stylex,
  mergeStylexDefinitions,
} from "@stylex/solid";
import { type ToggleInterface } from "@xcomponents2/shared/toggleInterface";
import * as Index from "./index";
import { type Props } from "@xcomponents2/shared/props";

false && stylex;

export type ToggleButtonProps = Props<ToggleButtonConstructor, ToggleButtonEvents, ToggleButtonApi, true>;
export type ToggleButtonConstructor = Index.ButtonConstructor & ToggleInterface["constructor"];
export type ToggleButtonEvents = Index.ButtonEvents & ToggleInterface["events"];
export type ToggleButtonApi = Index.ButtonApi & ToggleInterface["api"];
export function ToggleButton(props: ToggleButtonProps): JSX.Element {
  return ToggleButtonInterface("button", props);
}

export type ToggleIconButtonProps = Props<ToggleIconButtonConstructor, ToggleIconButtonEvents, ToggleIconButtonApi, true>;
export type ToggleIconButtonConstructor = Index.IconButtonConstructor & ToggleInterface["constructor"];
export type ToggleIconButtonEvents = Index.IconButtonEvents & ToggleInterface["events"];
export type ToggleIconButtonApi = Index.IconButtonApi & ToggleInterface["api"];
export function ToggleIconButton(props: ToggleIconButtonProps): JSX.Element {
  return ToggleButtonInterface("icon-button", props);
}

export type ToggleInterfaceProps<T extends "button" | "icon-button"> = Props<
  (T extends "button" ? Index.ButtonConstructor : Index.IconButtonConstructor) &
    ToggleInterface["constructor"],
  (T extends "button" ? Index.ButtonEvents : Index.IconButtonEvents) &
    ToggleInterface["events"],
  (T extends "button" ? Index.ButtonApi : Index.IconButtonApi) &
    ToggleInterface["api"],
  true
>;

function ToggleButtonInterface<T extends "button" | "icon-button">(
  type: T,
  props: ToggleInterfaceProps<T>,
): JSX.Element {
  const { constructor, events, api: setApi } = props;

  const [localConstructor, forwardConstructor] = splitProps(constructor, [
    "toggled",
  ]);

  const { "pt:root": extractedPtRoot, ...forwardConstructorWithoutExtracted } =
    forwardConstructor || {};

  const { onClick: extractedOnClick, ...forwardEvents } = events || {};

  let buttonOrIconButtonApi: Index.ButtonApi | Index.IconButtonApi;

  let toggled = localConstructor.toggled ?? false;

  const api: ToggleInterface["api"] = {
    isToggled() {
      return toggled;
    },
    toggle() {
      toggled = !toggled;
      setToggleAttributeOnElement(toggled);
    },
    setToggled(value: boolean) {
      if (toggled !== value) {
        toggled = value;
        setToggleAttributeOnElement(toggled);
      }
    },
  };

  const eventHandlers: ToggleInterface["events"] = {
    onToggle: (toggled: boolean) => {
      events?.onToggle?.(toggled);
    },
  };

  function setToggleAttributeOnElement(value: boolean) {
    const element = buttonOrIconButtonApi.element;
    if (value) {
      element.setAttribute("toggled", "");
    } else {
      element.removeAttribute("toggled");
    }
  }

  function customOnMount() {
    setToggleAttributeOnElement(toggled);
    // @ts-ignore
    setApi?.({ ...buttonOrIconButtonApi, ...api });
  }

  const ToggleButton = type === "button" ? Index.Button : Index.IconButton;
  return (
    <ToggleButton
      api={(api: Index.ButtonApi | Index.IconButtonApi) => {
        buttonOrIconButtonApi = api;
        customOnMount();
      }}
      onClick={(e: Event) => {
        extractedOnClick?.(e);
        const prevToggled = toggled;
        api.toggle();
        if (prevToggled !== toggled) {
          eventHandlers.onToggle(toggled);
        }
      }}
      pt:root={mergeStylexDefinitions(
        {
          [Symbol("backgroundColor")]: [
            ["@toggled&:hover", "darkBlue"],
            ["@toggled", "blue"],
          ],
        },
        extractedPtRoot,
      )}
      // @ts-ignore
      constructor={forwardConstructorWithoutExtracted}
      // @ts-ignore
      events={forwardEvents}
    />
  );
}
