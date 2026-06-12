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
import { IconButton } from "@xcomponents2/button";
false && stylex;

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      stylex: StylexDefinition;
    }
  }
}

export type TextInputProps = Constructor &
  JSX.InputHTMLAttributes<HTMLInputElement>;

type Constructor = {
  ref?: (api: Api) => void;
  value?: string | number;
  typee?:
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
        kind: "number";
        min?: number;
        max?: number;
        step?: string;
      };
  placeholder?: string;
  startSlot?: JSX.Element;
  startIcon?: IconProps["name"];
  startLabel?: string;
  endLabel?: string;
  endIcon?: IconProps["name"];
  endSlot?: JSX.Element;
  clearable?: boolean;
  "pt:root"?: StylexDefinition;
  "pt:input"?: StylexDefinition;
  "pt:placeholder"?: StylexDefinition;
};

export interface Api {
  element: HTMLInputElement;
  setDisabled: (state: boolean) => void;
  setLoading: (state: boolean) => void;
  isDisabled: boolean;
  isLoading: boolean;
  setValue: (state: number | string | null) => void;
  get value(): string | number | null;
  focus: () => void;
  blur: () => void;
}

enum InputType {
  Text = "text",
  Password = "password",
  Number = "number",
}

export function TextInput(props: TextInputProps): JSX.Element {
  let rootElement: HTMLInputElement;
  let inputElement: HTMLInputElement;

  const [constructor, elementAttributesAndEventListeners] = splitProps(props, [
    "typee",
    "placeholder",
    "value",
    "ref",
    "startLabel",
    "startSlot",
    "startIcon",
    "endIcon",
    "endSlot",
    "endLabel",
    "pt:root",
    "pt:input",
    "pt:placeholder",
    "clearable",
  ]);

  let value: string | number | null = constructor.value ?? null;
  let loading = false;
  let disabled = false;
  let focused = false;

  const [rLoadinState, setrLoadinState] = createSignal(loading);
  const [rDisabledState, setrDisabledState] = createSignal(loading);
  const [rValueState, setrValueState] = createSignal<string | number | null>(
    value,
  );
  const [rFocusedState, setrFocusedState] = createSignal(focused);

  const inputType = (() => {
    if (typeof constructor.typee === "string") {
      if (constructor.typee === "text") {
        return {
          kind: InputType.Text,
        };
      } else if (constructor.typee === "password") {
        return {
          kind: InputType.Password,
        };
      } else {
        return {
          kind: InputType.Number,
        };
      }
    } else if (typeof constructor.typee === "object") {
      if (constructor.typee.kind === "text") {
        return {
          ...constructor.typee,
          kind: InputType.Text,
        };
      } else if (constructor.typee.kind === "password") {
        return {
          ...constructor.typee,
          kind: InputType.Password,
        };
      } else {
        return {
          ...constructor.typee,
          kind: InputType.Number,
        };
      }
    } else {
      return {
        kind: InputType.Text,
      };
    }
  })();

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
    // @ts-ignore
    <div
      {...restElementAttributesAndEventListeners}
      use:stylex={mergeStylexDefinitions(
        {
          height: "28px",
          width: "200px",
          border: "1px solid #ccc",
          padding: "0 4px",
          boxSizing: "border-box",
          display: "inline-block",
          borderRadius: "4px",
          cursor: "text",
          outline: [["@focused", "1px solid blue"], "none"],
          outlineOffset: "-1px",
        },
        constructor["pt:root"],
      )}
      ref={rootElement!}
      {...{
        ...(rDisabledState() && { disabled: true }),
        ...(rLoadinState() && { loading: true }),
        ...(rFocusedState() && { focused: true }),
      }}
      onClick={(e) => {
        api.focus();
        if (onClick) {
          // @ts-ignore
          onClick(e);
        }
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
        {constructor.startSlot}
        {constructor.startIcon && <Icon name={constructor.startIcon} />}
        {constructor.startLabel && (
          <div use:stylex={{}}>{constructor.startLabel}</div>
        )}
        <div
          use:stylex={{
            position: "relative",
            height: "100%",
            flexShrink: 1,
            flexGrow: 1,
          }}
        >
          <input
            value={rValueState() == null ? "" : String(rValueState())}
            ref={inputElement!}
            use:stylex={mergeStylexDefinitions(
              {
                padding: "0",
                height: "100%",
                border: "none",
                outline: "none",
                background: "transparent",
                boxShadow: "none",
                position: "absolute",
                inset: "0",
                color: "currentColor",
              },
              constructor["pt:input"],
            )}
            type={inputType.kind}
            {...inputType}
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              let value: string | number | null = target.value;
              setrValueState(value);
              if (onInput) {
                // @ts-ignore
                onInput(e);
              }
            }}
            onChange={(e) => {
              // @ts-ignore
              onChange?.(e);
            }}
            onFocus={(e) => {
              api.focus();
              // @ts-ignore
              onFocus?.(e);
            }}
            onBlur={(e) => {
              api.blur();
              // @ts-ignore
              onBlur?.(e);
            }}
          />
          {constructor.placeholder && (
            <Show when={!rValueState()}>
              <div
                use:stylex={mergeStylexDefinitions(
                  {
                    position: "absolute",
                    inset: "0",
                    opacity: "0.6",
                    pointerEvents: "none",
                    display: "flex",
                    alignItems: "center",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  },
                  constructor["pt:placeholder"],
                )}
              >
                {constructor.placeholder}
              </div>
            </Show>
          )}
        </div>
        {constructor.clearable && (
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
                setrValueState(null);
                setTimeout(() => {
                  // @ts-ignore
                  onInput?.({ target: inputElement! } as any);
                  // @ts-ignore
                  onChange?.({ target: inputElement! } as any);
                });
              }}
            />
          </Show>
        )}
        {constructor.endSlot}
        {constructor.endIcon && (
          <Icon pt:root={{ flexShrink: 0 }} name={constructor.endIcon} />
        )}
        {constructor.endLabel && (
          <div
            use:stylex={{
              color: "#888",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            {constructor.endLabel}
          </div>
        )}
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
    </div>
  );
}
