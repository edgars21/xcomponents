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
} from "@stylex/solid";
import { Button, type ButtonApi, IconButton } from "@xcomponents2/button";
import { Transition } from "solid-transition-group";
import { Popper, type PopperApi } from "@xcomponents2/popper";
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
  "pt:root"?: StylexDefinition;
  "pt:input"?: StylexDefinition;
  "pt:placeholder"?: StylexDefinition;
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
  let popper: PopperApi;

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
      popper.open();
    },
    close() {
      opened = false;
      setrOpenedState(false);
      popper.close();
    },
    toggleOpen() {
      opened = !opened;
      if (opened) {
        popper.open();
      } else {
        popper.close();
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

  return (
    <div
      use:stylex={{
        height: "28px",
        width: "200px",
      }}
      ref={rootElement!}
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
          onClick={() => {
            api.toggleOpen();
          }}
          {...(constructor.clearable && {
            endSlot: (
              <Show when={!!rValueState()}>
                <IconButton
                  pt:root={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                  }}
                  icon={{
                    name: "lucide:x",
                    size: 12,
                  }}
                  onClick={() => {
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
            console.log("cange happended", trigger);
          }}
        >
          {constructor.options.map((option) => (
            <option value={option.value}>{option.label}</option>
          ))}
        </select>
        <Popper anchor={rootElement!} ref={(api) => (popper = api)} placement="bottom" >
          <div
            use:stylex={{
              border: "1px solid #ccc",
              width: "150px",
            }}
          >
            {constructor.options.map((option) => (
              <div>{option.label}</div>
            ))}
          </div>
        </Popper>
        {/* <Transition
          onEnter={(el, done) => {
            el.animate(
              [
                { opacity: 0, transform: "translateY(calc(100%))" },
                { opacity: 1, transform: "translateY(calc(100% + 10px))" },
              ],
              { duration: 300, easing: "ease-out" },
            ).finished.then(done);
          }}
          onExit={(el, done) => {
            el.animate(
              [
                { opacity: 1, transform: "translateY(calc(100% + 10px))" },
                { opacity: 0, transform: "translateY(calc(100%))" },
              ],
              { duration: 300, easing: "ease-in" },
            ).finished.then(done);
          }}
        >
          <Show when={rOpenedState()}></Show>
        </Transition> */}
      </div>
    </div>
  );
}
