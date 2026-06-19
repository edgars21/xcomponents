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

export type ButtonProps = {
  ref?: (api: ButtonApi) => void;
} & ButtonConstructor &
  JSX.ButtonHTMLAttributes<HTMLButtonElement>;

type ButtonConstructor = {
  placeholder?: string;
  value?: string | number;
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
          mergeStylexDefinitions(
            {
              height: "28px",
              padding: "0 6px",
              boxSizing: "border-box",
              backgroundColor: [[":hover", "#D3D3D3"], "#BCBCBC"],
              borderWidth: "1px",
              borderRadius: "3px",
            },
            constructor["pt:root"],
          ),
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

type NativeButtonEventsAndAttributes =
  JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export type IconButtonProps = {
  ref?: (api: IconButtonApi) => void;
} & IconButtonConstructor &
  JSX.ButtonHTMLAttributes<HTMLButtonElement>;

type IconButtonConstructor = {
  icon: IconProps["name"] | IconProps;
  "pt:root"?: StylexDefinition;
  "pt:container"?: StylexDefinition;
};

export interface IconButtonApi {
  element: HTMLButtonElement;
  setDisabled: (state: boolean) => void;
  setLoading: (state: boolean) => void;
  isDisabled: boolean;
  isLoading: boolean;
}
export function IconButton(props: IconButtonProps): JSX.Element {
  let rootElement: HTMLButtonElement;

  const [constructor, buttonElemetnAttributesAdnEventListeners] = splitProps(
    props,
    ["ref", "icon", "pt:root", "pt:container"],
  );

  let loading = false;
  let disabled = false;

  const [rLoadinState, setrLoadinState] = createSignal(loading);
  const [rDisabledState, setrDisabledState] = createSignal(loading);

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

  onMount(() => {
    constructor.ref?.(api);
  });

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
          color: "currentColor",
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

export type ToggleButtonProps = {
  ref?: (api: ToggleButtonApi) => void;
} & ToggleButtonConstructor &
  NativeButtonEventsAndAttributes & ToggleInterfaceEvents;
export type ToggleButtonConstructor = ButtonConstructor & ToggleConstructor;
export type ToggleButtonApi = ButtonApi & ToggleInterfaceApi;
export function ToggleButton(props: ToggleButtonProps): JSX.Element {
  return ToggleButtonInterface("button", props);
}

export type ToggleIconButtonProps = {
  ref?: (api: ToggleIconButtonApi) => void;
} & ToggleIconButtonConstructor &
  NativeButtonEventsAndAttributes & ToggleInterfaceEvents;
export type ToggleIconButtonConstructor = IconButtonConstructor &
  ToggleConstructor;
export type ToggleIconButtonApi = IconButtonApi & ToggleInterfaceApi;
export function ToggleIconButton(props: ToggleIconButtonProps): JSX.Element {
  return ToggleButtonInterface("icon-button", props);
}

export type ToggleInterfaceProps<T extends "button" | "icon-button"> =
  (T extends "button" ? ButtonConstructor : IconButtonConstructor) &
    JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
      ref?: (
        api: (T extends "button" ? ButtonApi : IconButtonApi) &
          ToggleInterfaceApi,
      ) => void;
    } & ToggleConstructor & ToggleInterfaceEvents;

type ToggleConstructor = {
  toggled?: boolean;
};



export interface ToggleInterfaceApi {
  isToggled: boolean;
  toggle: () => void;
  toggleOn: () => void;
  toggleOff: () => void;
}

export type ToggleInterfaceEvents = {
  onToggle?: (isToggled: boolean) => void;
};

export function ToggleButtonInterface<T extends "button" | "icon-button">(
  type: T,
  props: ToggleInterfaceProps<T>,
): JSX.Element {
  const [constructor, events, restProps] = splitProps(props, ["ref", "toggled"], ["onToggle"]);

  const {
    onClick: extractedOnClick,
    "pt:root": extractedPtRoot,
    ...restPropsWithoutExtracted
  } = restProps;

  let buttonOrIconButtonApi: T extends "button" ? ButtonApi : IconButtonApi;
  let toggled = constructor.toggled ?? false;

  const api: ToggleInterfaceApi = {
    get isToggled() {
      return toggled;
    },
    toggle() {
      toggled = !toggled;
      setToggleAttributeOnElement(toggled);
    },
    toggleOn() {
      toggled = true;
      setToggleAttributeOnElement(toggled);
    },
    toggleOff() {
      toggled = false;
      setToggleAttributeOnElement(toggled);
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
    constructor.ref?.({ ...buttonOrIconButtonApi, ...api });
  }

  if (type === "button") {
    return (
      // @ts-ignore
      <Button
        // @ts-ignore
        ref={(api: ButtonApi) => {
          // @ts-ignore
          buttonOrIconButtonApi = api;
          customOnMount();
        }}
        onClick={(e: Event) => {
          const prevToggled = toggled;
          api.toggle();
          // @ts-ignore
          extractedOnClick?.(e);
          if (events.onToggle && prevToggled !== toggled) {
            // @ts-ignore
            events.onToggle(toggled);
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
        {...restPropsWithoutExtracted}
      />
    );
  } else {
    return (
      // @ts-ignore
      <IconButton
        // @ts-ignore
        ref={(api: IconButtonApi) => {
          // @ts-ignore
          buttonOrIconButtonApi = api;
          customOnMount();
        }}
        onClick={(e: Event) => {
          const prevToggled = toggled;
          api.toggle();
          // @ts-ignore
          extractedOnClick?.(e);
          if (events.onToggle && prevToggled !== toggled) {
            // @ts-ignore
            events.onToggle(toggled);
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
        {...restPropsWithoutExtracted}
      />
    );
  }
}
