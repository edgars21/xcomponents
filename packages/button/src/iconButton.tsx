import { type JSX, createSignal, Show, onMount } from "solid-js";
import { Icon, type IconProps } from "@xcomponents2/icon";
import ProgressCircle from "@xcomponents2/progress-circle";
import {
  stylex,
  type StylexDefinition,
  mergeStylexDefinitions,
} from "@stylex/solid";
import { type Component } from "@xcomponents2/shared/component";
import { Props } from "@xcomponents2/shared/props";
false && stylex;

export type IconButtonComponent = Component<
  IconButtonConstructor,
  IconButtonEvents,
  IconButtonApi,
  true,
  typeof IconButton
>;

export type IconButtonProps = Props<
  IconButtonConstructor,
  IconButtonEvents,
  IconButtonApi,
  true
>;

export type IconButtonConstructor = {
  icon: IconProps["constructor"]["name"] | IconProps;
  "pt:root"?: StylexDefinition;
  "pt:container"?: StylexDefinition;
};

export type IconButtonEvents = {
  onClick: (e: Event) => void;
  onFocus: (e: Event) => void;
  onBlur: (e: Event) => void;
};

export type IconButtonApi = {
  element: HTMLButtonElement;
  setDisabled: (state: boolean) => void;
  setLoading: (state: boolean) => void;
  isDisabled: boolean;
  isLoading: boolean;
  focus: () => void;
  blur: () => void;
};

export function IconButton(props: IconButtonProps): JSX.Element {
  const { constructor, events, api: setApi } = props;

  let rootElement: HTMLButtonElement;

  let loading = false;
  let disabled = false;
  let focused = false;

  const [rLoadinState, setrLoadinState] = createSignal(loading);
  const [rDisabledState, setrDisabledState] = createSignal(loading);
  const [rFocusedState, setrFocusedState] = createSignal(focused);

  const api: IconButtonApi = {
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

  const eventHandlers: IconButtonEvents = {
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
          width: "28px",
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
      }}
      onClick={eventHandlers.onClick}
      onFocus={eventHandlers.onFocus}
      onBlur={eventHandlers.onBlur}
    >
      <div
        use:stylex={mergeStylexDefinitions(
          {
            height: "100%",
            width: "100%",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
          constructor["pt:container"],
        )}
      >
        <Icon
          {...(typeof constructor.icon === "string"
            ? { constructor: { name: constructor.icon } }
            : constructor.icon)}
        />
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
