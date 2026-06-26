import { splitProps, type JSX, onMount } from "solid-js";
import { stylex, mergeStylexDefinitions } from "@stylex/solid";
import * as Index from "./index";
import {
  Toggle,
  type ToggleConstructor,
  type ToggleEvents,
  type ToggleApi,
} from "@xcomponents2/toggle";
import {
  type ComponentInterface,
  type ComponentProps,
  splitComponentProps,
} from "@xcomponents2/shared/component";
false && stylex;

export type ToggleButtonProps = ComponentProps<ToggleButtonInterface>;
export type ToggleButtonInterface = ComponentInterface<
  ToggleButtonConstructor,
  ToggleButtonEvents,
  ToggleButtonApi
>;
export type ToggleButtonConstructor = Index.ButtonConstructor &
  ToggleConstructor;
export type ToggleButtonEvents = Index.ButtonEvents & ToggleEvents;
export type ToggleButtonApi = Index.ButtonApi & ToggleApi;
export function ToggleButton(props: ToggleButtonProps): JSX.Element {
  const { constructor, events, setApi } =
    splitComponentProps<ToggleButtonInterface>(props);
  const [toggleConstructor, buttonConstructor] = splitProps(constructor, [
    "toggled", "toggleAttributeName"
  ]);
  const [toggleEvents, buttonEvents] = splitProps(events, ["onToggle"]);
  const {
    "pt:root": extractedButtonPtRoot,
    ...forwardButtonConstructorWithoutExtract
  } = buttonConstructor;
  let toggleApi: ToggleApi;
  let buttonApi: Index.ButtonApi;

  function customOnMount() {
    if (setApi) {
      if (toggleApi && buttonApi) {
        setApi({ ...toggleApi, ...buttonApi });
      }
    }
  }

  return Toggle({
    ...toggleConstructor,
    ...toggleEvents,
    api: (api) => {
      toggleApi = api;
      customOnMount();
    },
    child: {
      function: Index.Button as (
        componentProps: ComponentProps<Index.ButtonInterface>,
      ) => JSX.Element,
      props: {
        ...forwardButtonConstructorWithoutExtract,
        ...buttonEvents,
        "pt:root": mergeStylexDefinitions(
          {
            [Symbol("backgroundColor")]: [
              ["@toggled&:hover", "darkBlue"],
              ["@toggled", "blue"],
            ],
          },
          extractedButtonPtRoot,
        ),
        api: (api) => {
          buttonApi = api;
          customOnMount();
        },
      },
    },
  });
}

export type ToggleIconButtonProps = ComponentProps<ToggleIconButtonInterface>;
export type ToggleIconButtonInterface = ComponentInterface<
  ToggleIconButtonConstructor,
  ToggleIconButtonEvents,
  ToggleIconButtonApi
>;
export type ToggleIconButtonConstructor = Index.IconButtonConstructor &
  ToggleConstructor;
export type ToggleIconButtonEvents = Index.IconButtonEvents & ToggleEvents;
export type ToggleIconButtonApi = Index.IconButtonApi & ToggleApi;
export function ToggleIconButton(props: ToggleIconButtonProps): JSX.Element {
  const { constructor, events, setApi } =
    splitComponentProps<ToggleIconButtonInterface>(props);
  const [toggleConstructor, buttonConstructor] = splitProps(constructor, [
    "toggled", "toggleAttributeName"
  ]);
  const [toggleEvents, buttonEvents] = splitProps(events, ["onToggle"]);
  const {
    "pt:root": extractedButtonPtRoot,
    ...forwardButtonConstructorWithoutExtract
  } = buttonConstructor;
  let toggleApi: ToggleApi;
  let buttonApi: Index.IconButtonApi;

  function customOnMount() {
    if (setApi) {
      if (toggleApi && buttonApi) {
        setApi({ ...toggleApi, ...buttonApi });
      }
    }
  }

  return Toggle({
    ...toggleConstructor,
    ...toggleEvents,
    api: (api) => {
      toggleApi = api;
      customOnMount();
    },
    child: {
      function: Index.IconButton as (
        componentProps: ComponentProps<Index.IconButtonInterface>,
      ) => JSX.Element,
      props: {
        ...forwardButtonConstructorWithoutExtract,
        ...buttonEvents,
        "pt:root": mergeStylexDefinitions(
          {
            [Symbol("backgroundColor")]: [
              ["@toggled&:hover", "darkBlue"],
              ["@toggled", "blue"],
            ],
          },
          extractedButtonPtRoot,
        ),
        api: (api) => {
          buttonApi = api;
          customOnMount();
        },
      },
    },
  });
}
