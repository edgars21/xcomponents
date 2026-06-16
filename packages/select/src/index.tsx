import {
  splitProps,
  type JSX,
  onMount,
  createSignal,
  Show,
  Component,
} from "solid-js";
import { Dynamic } from "solid-js/web";
import Icon, { type Props as IconProps } from "@xcomponents2/icon";
import ProgressCircle from "@xcomponents2/progress-circle";
import {
  stylex,
  type StylexDefinition,
  mergeStylexDefinitions,
  animate,
} from "@stylex3/solid";
import {
  Button,
  type ButtonApi,
  IconButton,
  type ButtonProps,
} from "@xcomponents2/button";
import { Transition } from "solid-transition-group";
import {
  Dropdown,
  type DropdownProps,
  type DropdownApi,
} from "@xcomponents2/dropdown";

import { Menu } from "@xcomponents2/menu";
false && stylex;

export type SelectProps = Constructor &
  JSX.InputHTMLAttributes<HTMLInputElement>;

type Constructor = {
  ref?: (api: Api) => void;
  value?: Value;
  options: Options;
  placeholder?: string;
  startSlot?: JSX.Element;
  startIcon?: IconProps["name"];
  startLabel?: string;
  endLabel?: string;
  endIcon?: IconProps["name"];
  endSlot?: JSX.Element;
  clearable?: boolean;
  nativeDropdown?: boolean;
  trigger?: ButtonProps;
  "pt:root"?: StylexDefinition;
  "pt:input"?: StylexDefinition;
  "pt:placeholder"?: StylexDefinition;
  "pt:dropdown"?: Omit<DropdownProps, "ref" | "anchor" | "children">;
};

type Options = { value: string; label: string }[];
type Value = string | null;

export interface Api {
  element: HTMLDivElement;
  setDisabled: (state: boolean) => void;
  setLoading: (state: boolean) => void;
  isDisabled: boolean;
  isLoading: boolean;
  setValue: (state: Value) => void;
  get value(): string | number | null;
  focus: () => void;
  blur: () => void;
  open: () => void;
  close: () => void;
  toggleOpen: () => void;
}

enum InputType {
  Text = "text",
  Password = "password",
  Number = "number",
}

function getSelectedValue(value: Value, options: Options) {
  return options.find((option) => option.value === value) ?? null;
}

export function Select(props: SelectProps): JSX.Element {
  let rootElement: HTMLDivElement;
  let inputElement: HTMLSelectElement;
  let trigger: ButtonApi;
  let dropdown: DropdownApi;
  let clearButtonElement: HTMLButtonElement;

  const [constructor, elementAttributesAndEventListeners] = splitProps(props, [
    "placeholder",
    "value",
    "options",
    "ref",
    "startLabel",
    "startSlot",
    "startIcon",
    "endIcon",
    "endSlot",
    "endLabel",
    "nativeDropdown",
    "pt:root",
    "pt:input",
    "pt:placeholder",
    "clearable",
    "trigger",
    "pt:dropdown",
  ]);

  let value: Value = constructor.value ?? null;
  let loading = false;
  let disabled = false;
  let focused = false;
  let opened = false;

  const [rLoadinState, setrLoadinState] = createSignal(loading);
  const [rDisabledState, setrDisabledState] = createSignal(loading);
  const [rValueState, setrValueState] = createSignal<string | number | null>(
    value,
  );
  const [rFocusedState, setrFocusedState] = createSignal(focused);
  const [rOpenedState, setrOpenedState] = createSignal(opened);

  const api: Api = {
    get element() {
      return rootElement!;
    },
    setDisabled(state) {
      disabled = state;
      setrDisabledState(state);
    },
    setLoading(state) {
      loading = state;
      setrLoadinState(state);
    },
    get isDisabled() {
      return disabled;
    },
    get isLoading() {
      return loading;
    },
    setValue(state) {
      value = state;
      setrValueState(state);
      trigger.setLabel(
        getSelectedValue(state, constructor.options)?.label ?? state,
      );
    },
    get value() {
      return value;
    },
    focus() {
      focused = true;
      setrFocusedState(true);
      inputElement!.focus();
    },
    blur() {
      focused = false;
      setrFocusedState(false);
      inputElement!.blur();
    },
    open() {
      opened = true;
      setrOpenedState(true);
      dropdown.open();
    },
    close() {
      opened = false;
      setrOpenedState(false);
      dropdown.close();
    },
    toggleOpen() {
      opened = !opened;
      if (opened) {
        dropdown.open();
      } else {
        dropdown.close();
      }
      setrOpenedState(opened);
    },
  };

  onMount(() => {
    if (props.ref) {
      props.ref(api);
    }
  });

  const {
    onClick,
    onInput,
    onChange,
    onFocus,
    onBlur,
    ...restElementAttributesAndEventListeners
  } = elementAttributesAndEventListeners;

  const { onClick: ptDropdownOnClick, ...restPtDropdown } =
    constructor["pt:dropdown"] ?? {};

  return (
    <div
      ref={rootElement!}
      use:stylex={mergeStylexDefinitions(
        {
          height: "28px",
          width: "200px",
        },
        constructor["pt:root"],
      )}
    >
      <div
        use:stylex={{
          height: "100%",
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        <Button
          ref={(api: any) => (trigger = api)}
          label={rValueState() ?? constructor.placeholder}
          pt:label={{
            marginRight: "auto",
          }}
          endIcon={{
            name: "chevron-down",
            "pt:root": {
              order: "9999",
            },
          }}
          pt:root={{
            width: "100%",
            height: "100%",
          }}
          {...(constructor.trigger && { ...constructor.trigger })}
          onClick={(e) => {
            if (clearButtonElement) {
              if (!clearButtonElement!.contains(e.target)) {
                api.toggleOpen();
              }
            } else {
              api.toggleOpen();
            }
            // @ts-ignore
            onClick?.(e);
          }}
          {...(constructor.clearable && {
            endSlot: (
              <Show when={!!rValueState()}>
                <IconButton
                  ref={(api: any) => {
                    clearButtonElement = api.element;
                  }}
                  pt:root={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                  }}
                  icon={{
                    name: "lucide:x",
                    size: 12,
                  }}
                  onClick={(e) => {
                    api.setValue(null);
                  }}
                />
              </Show>
            ),
          })}
        />
        <select
          ref={(el: HTMLSelectElement) => (inputElement = el)}
          value={rValueState() ?? ""}
          use:stylex={{
            height: "100%",
            width: "100%",
            position: "absolute",
            visibility: "hidden",
            opacity: 0,
          }}
          onChange={(e) => {
            const value = e.currentTarget.value;
            api.setValue(value);
          }}
        >
          {constructor.options.map((option) => (
            <option value={option.value}>{option.label}</option>
          ))}
        </select>
        <Dropdown
          anchor={rootElement!}
          ref={(api) => (dropdown = api)}
          placement="bottom"
          sameWidth
          onClose={(e) => {
            api.close();
            // @ts-ignore
            ptDropdownOnClick?.(e);
          }}
          {...restPtDropdown}
        >
          <Menu
            selected={value}
            options={constructor.options}
            onSelect={(value) => {
              api.setValue(value);
              api.close();
            }}
          />
        </Dropdown>
      </div>
    </div>
  );
}
