// @ts-nocheck
import {
  createSignal,
  createEffect,
  JSX,
  children,
  untrack,
  onMount,
  Show,
} from "solid-js";
import { Dynamic } from "solid-js/web";
import { stylex, type StyleXJs } from "@stylex/solid";
import ProgressCircle from "@xcomponents/progress-circle";
import Icon, { type Props as IconProps } from "@xcomponents/icon";
import Tooltip from "@xcomponents/tooltip";
import Dropdown, { type Props as DropdownProps } from "@xcomponents/dropdown";
import { type ToAccessorsCfg } from "@xcomponents/shared";
false && stylex;

export type Props = Constructor & Slots & Events & ApiBindings;

type Constructor = {
  ref?: (api: Api) => void;
  size?: "small" | "medium" | "large";
  variant?: "solid" | "outline" | "ghost" | "link";
  caret?: boolean;
  caretLeading?: boolean;
  loadingTrailing?: boolean;
  icon?: IconProps["name"] | true;
  startIcon?: IconProps["name"];
  endIcon?: IconProps["name"];
  href?: string;
  submit?: boolean;
  togglable?: boolean;
  initToggled?: boolean;
  preventToogleOnClick?: boolean;
  align?: "start" | "center" | "end";
  "pt:root"?: ElementSetter;
  "pt:label"?: ElementSetter;
  "pt:icon"?: Partial<IconProps>;
  dropdown?: Omit<DropdownProps, "anchor">;
};

interface ElementSetter {
  attr?: Record<string, string>;
  stylex?: (() => StyleXJs) | StyleXJs;
}

interface Slots {
  children?: JSX.Element | string;
  labelSlot?: JSX.Element | string;
  startSlot?: JSX.Element;
  endSlot?: JSX.Element;
  tooltipSlot?: JSX.Element | string;
}

type ApiBindings = ToAccessorsCfg<Api, true, true>;
interface Api {
  setDisabled: (state: boolean) => void;
  setLoading: (state: boolean) => void;
}

interface Events {
  onClick?: (e: MouseEvent) => void;
  onMouseDown?: (e: MouseEvent) => void;
  onToggle?: (toggled: boolean) => void;
}
enum TagType {
  Button = "button",
  Link = "a",
}

enum ButtonType {
  Normal = "normal",
  Icon = "icon",
  IconLabel = "icon-label",
}

const sizeStyles = {};

const typeStyles = {
  [ButtonType.Normal]: {
    small: { height: "24px", fontSize: "11px" },
    medium: { height: "28px", fontSize: "13px" },
    large: { height: "32px", fontSize: "15px" },
    styles: {
      padding: "8px",
    },
  },
  [ButtonType.Icon]: {
    small: { height: "24px", width: "24px", fontSize: "12px" },
    medium: { height: "32px", width: "32px", fontSize: "14px" },
    large: { height: "40px", width: "40px", fontSize: "16px" },
    styles: {
      padding: "8px",
    },
  },
  [ButtonType.IconLabel]: {
    small: { height: "24px", width: "24px", fontSize: "12px" },
    medium: { height: "32px", width: "32px", fontSize: "14px" },
    large: { height: "40px", width: "40px", fontSize: "16px" },
    styles: {
      padding: "8px",
    },
  },
};

const variantStyles = {
  solid: {
    backgroundColor: "blue",
    color: "white",
    border: "none",
    outline: "none",
    boxShadow: "none",
  },
  outline: {
    log: true,
    backgroundColor: [
      ["@toggled", "oklch(94% 0% 68deg)"],
      [":active", "oklch(94% 0% 68deg)"],
      [":hover", "oklch(97% 0% 68deg)"],
      "transparent",
    ],
    border: "1px solid oklch(0.3867 0 0)",
    color: [["@toggled&:hover", "oklch(35% 0% 0deg)"], "oklch(0% 0% 0deg)"],
    overflow: "hidden",
    borderRadius: "5px",
  },
  ghost: {
    backgroundColor: [
      ["@toggled", "oklch(94% 0% 68deg)"],
      [":active", "oklch(94% 0% 68deg)"],
      [":hover", "oklch(97% 0% 68deg)"],
      "transparent",
    ],
    overflow: "hidden",
    borderRadius: "5px",
    color: [["@toggled&:hover", "oklch(35% 0% 0deg)"], "oklch(0% 0% 0deg)"],
    border: "none",
    outline: "none",
    boxShadow: "none",
  },
  link: {
    backgroundColor: "transparent",
    color: "blue",
    textDecoration: "underline",
  },
} satisfies Record<string, StyleXJs>;

interface State {
  isDisabled: boolean;
  isLoading: boolean;
}

export default function Button(p: Props) {
  const props = untrack(() => p);

  const constructor = {
    ...({
      size: "medium",
      variant: "solid",
      caret: false,
      caretLeading: false,
      submit: false,
      align: "center",
      togglable: false,
    } as const),
    ...(props as Constructor),
  };
  const events = { ...props } as Events;
  const apiBindings = { ...props } as ApiBindings;
  const slots = {
    ...props,
    ...(!props.labelSlot &&
      props.children && {
        labelSlot: children(() => props.children)(),
      }),
  } as Slots;

  const state = {
    isDisabled: false,
    isLoading: false,
  };

  let isToggled = constructor.initToggled || false;
  const [rToggleOnOff, setrToggleOnOff] = createSignal(isToggled);

  const api: Api = {
    toggle: () => {
      isToggled = !isToggled;
      setrToggleOnOff(isToggled);
      if (events.onToggle) {
        events.onToggle(isToggled);
      }
    },
    toggleOn: () => {
      if (isToggled) return;
      isToggled = true;
      setrToggleOnOff(isToggled);
      if (events.onToggle) {
        events.onToggle(isToggled);
      }
    },
    toggleOff: () => {
      if (!isToggled) return;
      isToggled = false;
      setrToggleOnOff(isToggled);
      if (events.onToggle) {
        events.onToggle(isToggled);
      }
    },
    setDisabled: (s: boolean) => {
      state.isDisabled = s;
      setrIsDisabledState(s);
    },
    setLoading: (s: boolean) => {
      state.isLoading = s;
      setrIsLoadingState(s);
    },
  };

  if (apiBindings.setDisabled) {
    createEffect(() => {
      api.setDisabled(
        typeof apiBindings.setDisabled === "function"
          ? apiBindings.setDisabled()
          : apiBindings.setDisabled || false
      );
    });
  }

  if (apiBindings.setLoading) {
    createEffect(() => {
      api.setLoading(
        typeof apiBindings.setLoading === "function"
          ? apiBindings.setLoading()
          : apiBindings.setLoading || false
      );
    });
  }

  const [rIsDisabledState, setrIsDisabledState] = createSignal(
    state.isDisabled
  );
  const [rIsLoadingState, setrIsLoadingState] = createSignal(state.isLoading);

  const elementTagType = constructor.href ? TagType.Link : TagType.Button;

  const labelJsx = slots.labelSlot;

  const buttonType = constructor.icon
    ? labelJsx
      ? ButtonType.IconLabel
      : ButtonType.Icon
    : ButtonType.Normal;

  let rootElRef: HTMLElement | undefined;

  const [rMounted, setrMounted] = createSignal(false);

  const haveTooltip = !!slots.tooltipSlot;

  onMount(() => {
    if (constructor.ref) {
      constructor.ref(api);
    }
    setrMounted(true);
  });

  const caretJsx = constructor.caret ? <Icon name="chevron-down" /> : null;
  const loadingJsx = <ProgressCircle indeterminate />;

  const startAdornmentJsx = (() => {
    let inside = null;
    if (slots.startSlot) {
      inside = slots.startSlot;
    } else if (constructor.startIcon) {
      inside = <Icon name={constructor.startIcon} />;
    } else if (caretJsx && props.caretLeading) {
      inside = caretJsx;
    }

    if (!inside) {
      return null;
    }
    return (
      <div
        use:stylex={{
          display: ["", [rIsLoadingState() && !props.loadingTrailing, "none"]],
        }}
      >
        {inside}
      </div>
    );
  })();

  const endAdornmentJsx = (() => {
    let inside = null;
    if (slots.endSlot) {
      inside = slots.endSlot;
    } else if (constructor.endIcon) {
      inside = <Icon name={constructor.endIcon} />;
    } else if (caretJsx && !props.caretLeading) {
      inside = caretJsx;
    }

    if (!inside) {
      return null;
    }
    return (
      <div
        use:stylex={{
          display: ["", [rIsLoadingState() && !!props.loadingTrailing, "none"]],
        }}
      >
        {inside}
      </div>
    );
  })();

  const rootEvents = {
    ...((constructor.togglable || events.onClick) && {
      "on:click": (e: MouseEvent) => {
        if (constructor.togglable) {
          if (!props.preventToogleOnClick) {
            api.toggle();
          }
        }
        if (events.onClick) {
          events.onClick(e);
        }
      },
    }),
  };

  const { stylex: stylexValue, attr } = constructor["pt:root"] || {};
  return (
    <>
      <Dynamic
        component={elementTagType}
        ref={(el: HTMLElement) => {
          rootElRef = el;
          const values = {
            ...{
              boxSizing: "border-box",
              cursor: "pointer",
              position: "relative",
              display: "flex",
              ...(buttonType !== ButtonType.Normal
                ? {
                    justifyContent: "center",
                    alignItems: constructor.align,
                    flexDirection: "column",
                  }
                : {
                    justifyContent: constructor.align,
                    alignItems: "center",
                  }),
              gap: "8px",
              color: "currentColor",
            },
            ...typeStyles[buttonType][constructor.size],
            ...typeStyles[buttonType].styles,
            ...variantStyles[constructor.variant],
            ...(stylexValue && typeof stylexValue === "function"
              ? stylexValue()
              : stylexValue),
          };
          stylex(el, () => ({
            ...{
              boxSizing: "border-box",
              cursor: "pointer",
              position: "relative",
              display: "flex",
              ...(buttonType !== ButtonType.Normal
                ? {
                    justifyContent: "center",
                    alignItems: constructor.align,
                    flexDirection: "column",
                  }
                : {
                    justifyContent: constructor.align,
                    alignItems: "center",
                  }),
              gap: "8px",
              color: "currentColor",
            },
            ...typeStyles[buttonType][constructor.size],
            ...typeStyles[buttonType].styles,
            ...variantStyles[constructor.variant],
            ...(stylexValue && typeof stylexValue === "function"
              ? stylexValue()
              : stylexValue),
          }));
        }}
        data-button-type={buttonType}
        {...{
          ...(constructor.submit && { type: "submit" }),
          ...(constructor.href && { href: constructor.href }),
          ...(rIsDisabledState() && { disabled: state.isDisabled }),
          ...(rIsLoadingState() && { "data-loading": "" }),
          ...attr,
          ...(rToggleOnOff() && {
            "data-stylex-toggled": "",
          }),
        }}
        {...rootEvents}
        on:mousedown={events.onMouseDown}
      >
        {buttonType === ButtonType.Normal ? (
          <>
            {rIsLoadingState() && !props.loadingTrailing && loadingJsx}
            {startAdornmentJsx}
            <div
              {...{
                ...constructor["pt:label"]?.attr,
              }}
              use:stylex={{
                ...(constructor["pt:label"]?.stylex &&
                typeof constructor["pt:label"]?.stylex === "function"
                  ? constructor["pt:label"]?.stylex()
                  : constructor["pt:label"]?.stylex),
              }}
            >
              {slots.labelSlot}
            </div>
            {endAdornmentJsx}
            {rIsLoadingState() && props.loadingTrailing && loadingJsx}
          </>
        ) : (
          <>
            <div
              use:stylex={{
                display: "grid",
                placeItems: "center",
                gridAutoFlow: "row",
                opacity: ["", [rIsLoadingState(), "0.3"]],
              }}
            >
              {(() => {
                if (constructor.icon === true) {
                  return slots.labelSlot;
                } else {
                  return (
                    <Icon
                      {...{
                        name: constructor.icon!,
                        ...(constructor["pt:icon"] && constructor["pt:icon"]),
                      }}
                    />
                  );
                }
              })()}
              <span>{slots.labelSlot}</span>
            </div>
            {rIsLoadingState() && (
              <ProgressCircle
                stylex={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                }}
                indeterminate
              />
            )}
          </>
        )}
      </Dynamic>
      {haveTooltip && (
        <>
          <Show when={rMounted()}>
            <Tooltip anchor={rootElRef!} tooltipSlot={slots.tooltipSlot} />
          </Show>
        </>
      )}
      {constructor.dropdown && (
        <>
          <Show when={rMounted()}>
            <Dropdown {...constructor.dropdown} anchor={rootElRef!} />
          </Show>
        </>
      )}
    </>
  );
}
