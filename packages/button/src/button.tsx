import { type JSX, createSignal, Show, onMount } from "solid-js";
import { Icon, type IconProps } from "@xcomponents2/icon";
import ProgressCircle from "@xcomponents2/progress-circle";
import {
  stylex,
  type StylexDefinition,
  mergeStylexDefinitions,
} from "@stylex/solid";
import {
  type ComponentInterface,
  type ComponentProps,
  splitComponentProps,
} from "@xcomponents2/shared/component";
false && stylex;

export type ButtonProps = ComponentProps<ButtonInterface>;

export type ButtonInterface = ComponentInterface<
  ButtonConstructor,
  ButtonEvents,
  ButtonApi
>;

export type ButtonConstructor = {
  label: string | JSX.Element;
  startSlot?: JSX.Element;
  startIcon?: IconProps["constructor"]["name"] | IconProps;
  endIcon?: IconProps["constructor"]["name"] | IconProps;
  endSlot?: JSX.Element;
  "pt:root"?: StylexDefinition;
  "pt:container"?: StylexDefinition;
  "pt:label"?: StylexDefinition;
};

export type ButtonEvents = {
  onClick: (e: Event) => void;
  onFocus: (e: Event) => void;
  onBlur: (e: Event) => void;
};

export type ButtonApi = {
  "pt:root": HTMLButtonElement;
  setDisabled: (state: boolean) => void;
  setLoading: (state: boolean) => void;
  isDisabled: boolean;
  isLoading: boolean;
  setLabel: (state: string | JSX.Element) => void;
  focus: () => void;
  blur: () => void;
};

export function Button(props: ButtonProps): JSX.Element {
  const { constructor, events, setApi } =
    splitComponentProps<ButtonInterface>(props);

  let rootElement: HTMLButtonElement;

  let loading = false;
  let disabled = false;
  let focused = false;
  let label: string | JSX.Element = constructor.label;

  const [rLoadinState, setrLoadinState] = createSignal(loading);
  const [rDisabledState, setrDisabledState] = createSignal(loading);
  const [rLabelState, setrLabelState] = createSignal(label);
  const [rFocusedState, setrFocusedState] = createSignal(focused);

  const api: ButtonApi = {
    get "pt:root"() {
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
    setLabel(value: string | JSX.Element) {
      label = value;
      setrLabelState(value);
    },
    focus() {
      focused = true;
      setrFocusedState(true);
      rootElement!.focus();
    },
    blur() {
      focused = false;
      setrFocusedState(false);
      rootElement!.blur();
    },
  };

  const eventHandlers: ButtonEvents = {
    onClick: (e: Event) => {
      events?.onClick?.(e);
    },
    onFocus: (e: Event) => {
      api.focus();
      events?.onFocus?.(e);
    },
    onBlur: (e: Event) => {
      api.blur();
      events?.onBlur?.(e);
    },
  };

  onMount(() => {
    setApi?.(api);
  });

  return (
    <button
      ref={rootElement!}
      use:stylex={mergeStylexDefinitions(
        {
          height: "28px",
          padding: "0 6px",
          boxSizing: "border-box",
          backgroundColor: [
            [":active", "oklch(0.8669 0 0)"],
            [":hover", "oklch(0.8369 0 0)"],
            "oklch(0.8669 0 0)",
          ],
          borderWidth: "1px",
          borderRadius: "3px",
        },
        constructor["pt:root"],
      )}
      {...{
        ...(rDisabledState() && { disabled: true }),
        ...(rLoadinState() && { loading: true }),
        ...(rFocusedState() && { focused: true }),
      }}
      onClick={eventHandlers.onClick}
      onFocus={eventHandlers.onFocus}
      onBlur={eventHandlers.onBlur}
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
        <div
          use:stylex={{
            height: "100%",
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        ></div>
        {constructor.startSlot}
        {constructor.startIcon && (
          // @ts-ignore
          <Icon
            {...(typeof constructor.startIcon === "string"
              ? { name: constructor.startIcon }
              : constructor.startIcon)}
          />
        )}
        <div use:stylex={constructor["pt:label"]}>{rLabelState()}</div>
        {constructor.endIcon && (
          // @ts-ignore
          <Icon
            {...(typeof constructor.endIcon === "string"
              ? { name: constructor.endIcon } 
              : constructor.endIcon)}
          />
        )}
        {constructor.endSlot}
        <Show when={rLoadinState()}>
          <ProgressCircle
            stylex={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
            indeterminate
          />
        </Show>
      </div>
    </button>
  );
}
