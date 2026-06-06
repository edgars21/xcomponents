import { splitProps, JSX, onMount, createSignal, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import Icon, { type Props as IconProps } from "@xcomponents2/icon";
import ProgressCircle from "@xcomponents2/progress-circle";
import { stylex, } from "@stylex/solid";
false && stylex;

type KeysOfUnion<T> = T extends T ? keyof T : never;

type ConstructorNormal = {
  label: string;
  startIcon?: IconProps["name"];
  endIcon?: IconProps["name"];
};

type ConstructorWrap = {
  children: JSX.Element;
};

type ConstructorIcon = {
  icon: IconProps["name"];
};

type ConstructorIconWrap = {
  icon: true;
  children: JSX.Element;
};

type SharedConstructor<
  E extends Record<string, any>,
  T extends HTMLButtonElement | HTMLAnchorElement = HTMLButtonElement,
> = {
  ref?: (api: Api<T>) => void;
  "pt:root"?: any;
} & (T extends HTMLAnchorElement
  ? JSX.AnchorHTMLAttributes<HTMLAnchorElement>
  : JSX.ButtonHTMLAttributes<HTMLButtonElement>) &
  E;

export interface PropsOverloads {
  (props: PropsNormalOverload): JSX.Element;
  (props: PropsWrapOverload): JSX.Element;
  (props: PropsIconOverload): JSX.Element;
  (props: PropsIconWrapOverload): JSX.Element;
  (props: PropsNormalAnchorOverload): JSX.Element;
  (props: PropsWrapAnchorOverload): JSX.Element;
  (props: PropsIconAnchorOverload): JSX.Element;
  (props: PropsIconWrapAnchorOverload): JSX.Element;
}

export type Props =
  | PropsNormalOverload
  | PropsWrapOverload
  | PropsIconOverload
  | PropsIconWrapOverload
  | PropsNormalAnchorOverload
  | PropsWrapAnchorOverload
  | PropsIconAnchorOverload
  | PropsIconWrapAnchorOverload;

type PropsNormalOverload = SharedConstructor<ConstructorNormal>;
type PropsWrapOverload = SharedConstructor<ConstructorWrap>;
type PropsIconOverload = SharedConstructor<ConstructorIcon>;
type PropsIconWrapOverload = SharedConstructor<ConstructorIconWrap>;
type PropsNormalAnchorOverload = SharedConstructor<
  ConstructorNormal,
  HTMLAnchorElement
>;
type PropsWrapAnchorOverload = SharedConstructor<
  ConstructorWrap,
  HTMLAnchorElement
>;
type PropsIconAnchorOverload = SharedConstructor<
  ConstructorIcon,
  HTMLAnchorElement
>;
type PropsIconWrapAnchorOverload = SharedConstructor<
  ConstructorIconWrap,
  HTMLAnchorElement
>;

enum TagType {
  Button = "button",
  Link = "a",
}
export interface Api<
  T extends HTMLButtonElement | HTMLAnchorElement = HTMLButtonElement,
> {
  "pt:root": T;
  setDisabled: (state: boolean) => void;
  setLoading: (state: boolean) => void;
  isDisabled: boolean;
  isLoading: boolean;
}

enum ButtonType {
  Normal = "normal",
  Wrap = "wrap",
  Icon = "icon",
  IconWrap = "icon-wrap",
}

export const Button = ((props: Props): JSX.Element => {
  let rootElement: HTMLButtonElement | HTMLAnchorElement;

  const constructor =
    "icon" in props
      ? props.icon === true
        ? ({ kind: ButtonType.IconWrap, ...props } as {
            kind: ButtonType.IconWrap;
          } & SharedConstructor<ConstructorIconWrap>)
        : ({ kind: ButtonType.Icon, ...props } as {
            kind: ButtonType.Icon;
          } & SharedConstructor<ConstructorIcon>)
      : props.children
        ? ({ kind: ButtonType.Wrap, ...props } as {
            kind: ButtonType.Wrap;
          } & SharedConstructor<ConstructorWrap>)
        : ({ kind: ButtonType.Normal, ...props } as {
            kind: ButtonType.Normal;
          } & SharedConstructor<ConstructorNormal>);

  // @ts-ignore
  const elementTagType = props.href ? TagType.Link : TagType.Button;

  onMount(() => {});

  const [_, rest] = splitProps(props, [
    "label",
    "startIcon",
    "endIcon",
    "children",
    "icon",
  ] as any);

  let loading = false;
  let disabled = false;

  const [rLoadinState, setrLoadinState] = createSignal(loading);
  const [rDisabledState, setrDisabledState] = createSignal(loading);

  const api: Api<typeof rootElement> = {
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
  };

  return (
    // @ts-ignore
    <Dynamic
      component={elementTagType}
      {...rest}
      ref={(ref: HTMLButtonElement | HTMLAnchorElement) => {
        rootElement = ref;
        stylex(ref, () => (constructor["pt:root"] ? constructor["pt:root"] : {
          height: "28px",
          padding: "0 6px",
          boxSizing: "border-box",
        }));
        // @ts-ignore
        constructor.ref?.(api);
      }}
      {...{
        ...(rDisabledState() && { disabled: true }),
        ...(rLoadinState() && { loading: true }),
      }}
    >
      <div
        // @ts-ignore
        use:stylex={{
          height: "100%",
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        {(() => {
          switch (constructor.kind) {
            case ButtonType.Normal:
              return (
                <>
                  {constructor.startIcon && (
                    <Icon name={constructor.startIcon} />
                  )}
                  {constructor.label}
                  {constructor.endIcon && <Icon name={constructor.endIcon} />}
                </>
              );
            case ButtonType.Wrap:
              return constructor.children;
            case ButtonType.Icon:
              return <Icon name={constructor.icon} />;
            case ButtonType.IconWrap:
              return constructor.children;
          }
        })()}
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
    </Dynamic>
  );
}) as PropsOverloads;
