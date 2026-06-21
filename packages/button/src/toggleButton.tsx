import { splitProps, type JSX } from "solid-js";
import { stylex, mergeStylexDefinitions } from "@stylex/solid";
import { type ToggleInterface } from "@xcomponents2/shared/toggleInterface";
import * as Index from "./index";
import { type Props } from "@xcomponents2/shared/props";
import {
  Toggle,
  type ToggleConstructor,
  type ToggleEvents,
  type ToggleApi,
} from "@xcomponents2/toggle";

false && stylex;

export type ToggleButtonProps = Props<
  ToggleButtonConstructor,
  ToggleButtonEvents,
  ToggleButtonApi,
  true
>;
export type ToggleButtonConstructor = ToggleConstructor<Index.ButtonConstructor>;
export type ToggleButtonEvents = ToggleEvents<Index.ButtonEvents>;
export type ToggleButtonApi = ToggleApi<Index.ButtonApi>;
export function ToggleButton(props: ToggleButtonProps): JSX.Element {
  const {
    constructor: { "pt:root": extractedPtRoot, ...forwardConstructor },
    ...forwardPropsEventsAndApi
  } = props;

  return Toggle(
    {
      constructor: {
        ...forwardConstructor,
        "pt:root": mergeStylexDefinitions(
          {
            [Symbol("backgroundColor")]: [
              ["@toggled&:hover", "darkBlue"],
              ["@toggled", "blue"],
            ],
          },
          extractedPtRoot,
        ),
      },
      events: forwardPropsEventsAndApi.events,
      // @ts-ignore
      api: forwardPropsEventsAndApi.api,
    },
    Index.Button,
  );
}

export type ToggleIconButtonProps = Props<
  ToggleIconButtonConstructor,
  ToggleIconButtonEvents,
  ToggleIconButtonApi,
  true
>;
export type ToggleIconButtonConstructor = ToggleConstructor<Index.IconButtonConstructor>;
export type ToggleIconButtonEvents = ToggleEvents<Index.IconButtonEvents>;
export type ToggleIconButtonApi = ToggleApi<Index.IconButtonApi>;
export function ToggleIconButton(props: ToggleIconButtonProps): JSX.Element {
  const {
    constructor: { "pt:root": extractedPtRoot, ...forwardConstructor },
    ...forwardPropsEventsAndApi
  } = props;

  return Toggle(
    {
      constructor: {
        ...forwardConstructor,
        "pt:root": mergeStylexDefinitions(
          {
            [Symbol("backgroundColor")]: [
              ["@toggled&:hover", "darkBlue"],
              ["@toggled", "blue"],
            ],
          },
          extractedPtRoot,
        ),
      },
      events: forwardPropsEventsAndApi.events,
      // @ts-ignore
      api: forwardPropsEventsAndApi.api,
    },
    Index.IconButton,
  );
}