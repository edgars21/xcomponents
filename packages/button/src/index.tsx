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
false && stylex;

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      stylex: StylexDefinition;
    }
  }
}

export type ButtonProps = Constructor &
  JSX.ButtonHTMLAttributes<HTMLButtonElement>;

type Constructor = {
  placeholder?: string;
  value?: string | number;
  type?:
    | "text"
    | {
        kind: "text";
        minlength?: number;
        maxlength?: number;
        pattern?: string;
      }
    | "password"
    | {
        kind: "password";
        minlength?: number;
        maxlength?: number;
        pattern?: string;
      }
    | "number"
    | {
        kind: "password";
        min?: number;
        max?: number;
        step?: string;
      };
  ref?: (api: ButtonApi) => void;
  startSlot?: JSX.Element;
  startIcon?: IconProps["name"];
  endIcon?: IconProps["name"] | IconProps;
  endSlot?: JSX.Element;
  label: string | JSX.Element;
  "pt:root"?: StylexDefinition;
  "pt:container"?: StylexDefinition;
  "pt:label"?: StylexDefinition;
};

export interface ButtonApi {
  element: HTMLButtonElement;
  setDisabled: (state: boolean) => void;
  setLoading: (state: boolean) => void;
  isDisabled: boolean;
  isLoading: boolean;
  setLabel: (state: string | JSX.Element) => void;
  focus: () => void;
  blur: () => void;
}

enum TagType {
  Button = "button",
  Link = "a",
}

export function Button(props: ButtonProps): JSX.Element {
  let rootElement: HTMLButtonElement;

  // @ts-ignore
  const elementTagType = props.href ? TagType.Link : TagType.Button;

  onMount(() => {});

  const [constructor, buttonElemetnAttributesAdnEventListeners] = splitProps(
    props,
    [
      "ref",
      "label",
      "startSlot",
      "startIcon",
      "endIcon",
      "endSlot",
      "pt:root",
      "pt:container",
      "pt:label",
    ],
  );

  let loading = false;
  let disabled = false;
  let focused = false;
  let label: string | JSX.Element = constructor.label;

  const [rLoadinState, setrLoadinState] = createSignal(loading);
  const [rDisabledState, setrDisabledState] = createSignal(loading);
  const [rLabelState, setrLabelState] = createSignal(label);
  const [rFocusedState, setrFocusedState] = createSignal(focused);

  const api: ButtonApi = {
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

  const {
    onClick,
    onInput,
    onChange,
    onFocus,
    onBlur,
    ...restElementAttributesAndEventListeners
  } = buttonElemetnAttributesAdnEventListeners;

  return (
    // @ts-ignore
    <button
      // component={elementTagType}
      {...restElementAttributesAndEventListeners}
      ref={(ref: HTMLButtonElement) => {
        rootElement = ref;
        stylex(ref, () =>
          // @ts-ignore
          constructor["pt:root"]
            ? // @ts-ignore
              constructor["pt:root"]
            : {
                height: "28px",
                padding: "0 6px",
                boxSizing: "border-box",
              },
        );
        // @ts-ignore
        constructor.ref?.(api);
      }}
      {...{
        ...(rDisabledState() && { disabled: true }),
        ...(rLoadinState() && { loading: true }),
        ...(rFocusedState() && { focused: true }),
      }}
      onClick={(e: Event) => {
        // @ts-ignore
        onClick?.(e);
      }}
      onFocus={(e: Event) => {
        api.focus();
        // @ts-ignore
        onFocus?.(e);
      }}
      onBlur={(e: Event) => {
        api.blur();
        // @ts-ignore
        onBlur?.(e);
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
        {constructor.startIcon && <Icon name={constructor.startIcon} />}
        <div use:stylex={constructor["pt:label"]}>{rLabelState()}</div>
        {constructor.endIcon &&
          (typeof constructor.endIcon === "string" ? (
            <Icon name={constructor.endIcon} />
          ) : (
            <Icon {...(constructor.endIcon as IconProps)} />
          ))}
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

export type IconButtonProps = IconButtonConstructor &
  JSX.ButtonHTMLAttributes<HTMLButtonElement>;

type IconButtonConstructor = {
  ref?: (api: IconApi) => void;
  icon: IconProps["name"] | IconProps;
  "pt:root"?: StylexDefinition;
  "pt:container"?: StylexDefinition;
};

export interface IconApi {
  element: HTMLButtonElement;
  setDisabled: (state: boolean) => void;
  setLoading: (state: boolean) => void;
  isDisabled: boolean;
  isLoading: boolean;
}
export function IconButton(props: IconButtonProps): JSX.Element {
  let rootElement: HTMLButtonElement;

  onMount(() => {});

  const [constructor, buttonElemetnAttributesAdnEventListeners] = splitProps(
    props,
    ["ref", "icon", "pt:root", "pt:container"],
  );

  let loading = false;
  let disabled = false;

  const [rLoadinState, setrLoadinState] = createSignal(loading);
  const [rDisabledState, setrDisabledState] = createSignal(loading);

  const api: IconApi = {
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
  };

  onMount(() => {
    // @ts-ignore
    constructor.ref?.(api);
  });

  if (constructor["pt:root"]) {
    mergeStylexDefinitions(
      {
        width: "20px",
        height: "20px",
        boxSizing: "border-box",
        padding: "0",
      },
      constructor["pt:root"] as StylexDefinition,
    );
  }

  return (
    // @ts-ignore
    <button
      {...buttonElemetnAttributesAdnEventListeners}
      ref={rootElement!}
      use:stylex={mergeStylexDefinitions(
        {
          width: "20px",
          height: "20px",
          boxSizing: "border-box",
          padding: "0",
          border: "1px solid gray",
          color: "currentColor"
        },
        constructor["pt:root"],
      )}
      {...{
        ...(rDisabledState() && { disabled: true }),
        ...(rLoadinState() && { loading: true }),
      }}
    >
      <div
        use:stylex={{
          height: "100%",
          width: "100%",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon
          {...(typeof constructor.icon === "string"
            ? { name: constructor.icon }
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
