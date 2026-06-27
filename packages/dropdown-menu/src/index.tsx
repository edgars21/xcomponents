import { splitProps, type JSX, onMount, createSignal, Show } from "solid-js";
import { type IconProps } from "@xcomponents2/icon";
import ProgressCircle from "@xcomponents2/progress-circle";
import {
  stylex,
  type StylexDefinition,
  mergeStylexDefinitions,
} from "@stylex3/solid";
import { Dropdown } from "@xcomponents2/dropdown";

import { Menu, type MenuProps } from "@xcomponents2/menu";
import {
  type ComponentInterface,
  type ComponentProps,
  splitComponentProps,
} from "@xcomponents2/shared/component";
false && stylex;

export type DropdownMenuProps = ComponentProps<DropdownMenuInterface>;
export type DropdownMenuInterface = ComponentInterface<
  DropdownMenuConstructor,
  DropdownMenuEvents,
  DropdownMenuApi
>;
export type DropdownMenuConstructor = {
  child: HTMLElement;
  value?: Value;
  options: Options;
  "pt:root"?: StylexDefinition;
  "pt:menu"?: MenuProps;
};
export type DropdownMenuEvents = {};
export type DropdownMenuApi = {};
export interface Api {}
type Options = { value: string; label: string }[];
type Value = string | null;

function getSelectedValue(value: Value, options: Options) {
  return options.find((option) => option.value === value) ?? null;
}

export function DropdownMenu(props: DropdownMenuProps): JSX.Element {
  const { constructor, events, setApi } =
    splitComponentProps<DropdownMenuInterface>(props);

  const api: Api = {};

  onMount(() => {
    setApi?.(api);
  });

  return (
    <>
      {constructor.child}
      <Dropdown anchor={constructor.child} trigger="click" {...constructor["pt:root"]}>
        <Menu
          options={constructor.options}
          onSelect={(value) => {}}
          {...constructor["pt:menu"]}
        />
      </Dropdown>
    </>
  );
}
