import {
  createSignal,
  mergeProps,
  createEffect,
  JSX,
  type Component,
  children,
  type Accessor,
  untrack,
} from "solid-js";
import { Dynamic } from "solid-js/web";
import { stylex, type StyleXValidSolidType } from "@stylex/solid";
import ProgressCircle from "@xcomponents/progress-circle";
import Icon, { type Props as IconProps } from "@xcomponents/icon";
import { type ToAccessorsCfg } from "@xcomponents/shared";
export type InputRefComponent = Component<{
  ref?: (el: HTMLInputElement) => void;
}>;


type Props = Constructor &
  Omit<Slots, "defaultSlot"> & { children?: Slots["defaultSlot"] } & Events &
  ApiBindings;

interface Constructor {
  rootStylex?: StyleXValidSolidType;
  size?: "small" | "medium" | "large";
  variant?: "solid" | "outline" | "ghost" | "link";
  caret?: boolean;
  caretLeading?: boolean;
  loadingTrailing?: boolean;
  icon?: IconProps["name"] | true;
  startIcon?: IconProps["name"];
  endIcon?: IconProps["name"];
  href?: string;
}

interface Slots {
  defaultSlot?: JSX.Element;
  labelSlot?: JSX.Element | string;
  startSlot?: JSX.Element;
  endSlot?: JSX.Element;
}

type ApiBindings = ToAccessorsCfg<Api, true, true>;
interface Api {
  setDisabled: (state: boolean) => void;
  setLoading: (state: boolean) => void;
}

interface Events {
  onClick?: (e: MouseEvent) => void;
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
    small: { height: "24px", fontSize: "12px" },
    medium: { height: "32px", fontSize: "14px" },
    large: { height: "40px", fontSize: "16px" },
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
  solid: { background: "blue", color: "white" },
  outline: {
    background: "transparent",
    border: "1px solid blue",
    color: "blue",
  },
  ghost: { background: "transparent", color: "blue" },
  link: {
    background: "transparent",
    color: "blue",
    textDecoration: "underline",
  },
};

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
    } as const),
    ...(props as Constructor),
  };
  const events = { ...props } as Events;
  const apiBindings = { ...props } as ApiBindings;
  const slots = {
    ...props,
    defaultSlot: children(() => props.children)(),
  } as Slots;

  const state = {
    isDisabled: false,
    isLoading: false,
  };

  const api: Api = {
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

  const labelJsx =
    slots.defaultSlot && !constructor.icon
      ? slots.defaultSlot
      : slots.labelSlot;

  const buttonType = constructor.icon
    ? labelJsx
      ? ButtonType.IconLabel
      : ButtonType.Icon
    : ButtonType.Normal;

  if (buttonType === ButtonType.Normal) {
    if (slots.defaultSlot) {
      slots.labelSlot = slots.defaultSlot;
    }
  }

  const caretJsx = constructor.caret ? <Icon name="ChevronDown" /> : null;

  const startAdornmentJsx = (() => {
    return <></>;
    // if (props.startSlot) {
    //   return props.startSlot;
    // } else if (props.startIcon) {
    //   return <Icon name={props.startIcon} />;
    // } else if (caretJsx && props.caretLeading) {
    //   return caretJsx;
    // }
  })();

  const endAdornmentJsx = (() => {
    // if (props.endSlot) {
    //   return props.endSlot;
    // } else if (props.endIcon) {
    //   return <Icon name={props.endIcon} />;
    // } else if (caretJsx && !props.caretLeading) {
    //   return caretJsx;
    // }
    return <></>;
  })();

  return (
    <Dynamic
      data-button-type={buttonType}
      component={elementTagType}
      {...{
        ...(constructor.href && { href: constructor.href }),
        ...(rIsDisabledState() && { disabled: state.isDisabled }),
        ...(rIsLoadingState() && { "data-loading": "" }),
      }}
      onClick={events.onClick}
      ref={(el: HTMLElement) => {
        stylex(() => [
          el,
          {
            ...{
              position: "relative",
              display: "grid",
              "place-items": "center",
              "place-content": "center",
              "grid-auto-flow":
                buttonType !== ButtonType.Normal ? "row" : "column",
              gap: "8px",
              color: "currentColor",
            },
            ...typeStyles[buttonType][constructor.size],
            ...typeStyles[buttonType].styles,
            ...constructor.rootStylex,
          },
        ]);
      }}
    >
      {buttonType === ButtonType.Normal ? (
        <>
          rIsLoadingState() && !props.loadingTrailing && (
          <ProgressCircle indeterminate />)
          <div
            ref={(el) => {
              stylex(() => [
                el,
                {
                  display: [
                    "",
                    [rIsLoadingState() && !props.loadingTrailing, "none"],
                  ],
                },
              ]);
            }}
          >
            {startAdornmentJsx}
          </div>
          <span>{slots.labelSlot}</span>
          props.caret && !props.caretLeading && <Icon name="ChevronDown" />
          <div
            ref={(el) => {
              stylex(() => [
                el,
                {
                  display: [
                    "",
                    [rIsLoadingState() && !!props.loadingTrailing, "none"],
                  ],
                },
              ]);
            }}
          >
            {endAdornmentJsx}
          </div>
          rIsLoadingState() && props.loadingTrailing && (
          <ProgressCircle indeterminate />)
        </>
      ) : (
        <>
          <div
            ref={(el: HTMLElement) => {
              stylex(() => [
                el,
                {
                  display: "grid",
                  "place-items": "center",
                  "grid-auto-flow": "row",
                  opacity: ["", [rIsLoadingState(), "0.3"]],
                },
              ]);
            }}
          >
            {(() => {
              if (constructor.icon === true) {
                return slots.labelSlot;
              } else {
                return <Icon name={constructor.icon!} />;
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
  );
}
