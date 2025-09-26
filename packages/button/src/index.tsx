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
import { stylex } from "@stylex/solid";
import ProgressCircle from "@xcomponents/progress-circle";
import Icon, { type Props as IconProps } from "@xcomponents/icon";
export type InputRefComponent = Component<{
  ref?: (el: HTMLInputElement) => void;
}>;

interface Props {
  children?: JSX.Element;
  size?: "small" | "medium" | "large";
  variant?: "solid" | "outline" | "ghost" | "link";
  caret?: boolean;
  caretLeading?: boolean;
  loadingTrailing?: boolean;

  labelSlot: string | JSX.Element;
  startIcon?: IconProps["name"];
  startSlot?: JSX.Element;
  endIcon?: IconProps["name"];
  endSlot?: JSX.Element;

  setLoading?: boolean | Accessor<boolean>;
  setDisable?: boolean | Accessor<boolean>;

  onClick?: (e: MouseEvent) => void;
}

const sizeStyles = {
  small: { height: "24px", fontSize: "12px" },
  medium: { height: "32px", fontSize: "14px" },
  large: { height: "40px", fontSize: "16px" },
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

interface Api {
  disable: (state: boolean) => void;
  loading: (state: boolean) => void;
}

interface State {
  isDisabled: boolean;
  isLoading: boolean;
}

export default function Button(p: Props) {
 const props = untrack(() => ({ ...mergeProps({
      size: "medium",
      variant: "solid",
      disable: false,
      loading: false,
      caret: false,
      caretLeading: false,

 }, p) }));

  // @ts-ignore
  console.log("here we go");
  console.log(props.children);
  const c = children(() => props.children);
  const childArray = c.toArray();
  console.log(childArray);

  props.size;

  const style = {
    ...sizeStyles[props.size],
    ...variantStyles[props.variant],
  };

  const state = {
    isDisabled: props.disable,
    isLoading: props.loading,
  };

  const api: Api = {
    disable: (s: boolean) => {
      state.isDisabled = s;
      setrIsDisabledState(s);
    },
    loading: (s: boolean) => {
      state.isLoading = s;
      setrIsLoadingState(s);
    },
  };

  createEffect(() => {
    api.disable(props.disable);
    api.loading(props.loading);
  });

  const [rIsDisabledState, setrIsDisabledState] = createSignal(
    state.isDisabled
  );
  const [rIsLoadingState, setrIsLoadingState] = createSignal(state.isLoading);

  const caret = props.caret ? <Icon name="ChevronDown" /> : null;

  const startAdornment = (() => {
    if (props.startSlot) {
      return props.startSlot;
    } else if (props.startIcon) {
      return <Icon name={props.startIcon} />;
    } else if (caret && props.caretLeading) {
      return caret;
    }
  })();

  const endAdornment = (() => {
    if (props.endSlot) {
      return props.endSlot;
    } else if (props.endIcon) {
      return <Icon name={props.endIcon} />;
    } else if (caret && !props.caretLeading) {
      return caret;
    }
  })();

  return (
    <button
      onClick={props.onClick}
      {...{
        ...(rIsDisabledState() && { disabled: state.isDisabled }),
        ...(rIsLoadingState() && { "data-loading": "" }),
      }}
      ref={(el) => {
        stylex(() => [
          el,
          {
            ...{
              display: "grid",
              gap: "8px",
              "grid-auto-flow": "column",
              "place-items": "center",
              height: "36px",
              color: "currentColor",
              "font-size": "14px",
            },
            ...style,
          },
        ]);
      }}
    >
      {rIsLoadingState() && !props.loadingTrailing && (
        <ProgressCircle indeterminate />
      )}
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
        {startAdornment}
      </div>
      <span>{props.label}</span>
      {props.caret && !props.caretLeading && <Icon name="ChevronDown" />}
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
        {endAdornment}
      </div>
      {rIsLoadingState() && props.loadingTrailing && (
        <ProgressCircle indeterminate />
      )}
    </button>
  );
}
