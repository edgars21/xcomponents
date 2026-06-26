import { type JSX } from "solid-js";
import { stylex } from "@stylex/solid";
import {
  type ComponentInterface,
  type ComponentProps,
  splitComponentProps,
  CallableComponent,
} from "@xcomponents2/shared/component";
false && stylex;

export type Prettify<T> = { [K in keyof T]: T[K] } & {};

export type TogglableComponentInterface = ComponentInterface<
  {},
  { onClick: (e: Event) => void },
  {
    "pt:root": HTMLElement;
  }
>;

export type ToggleProps<T extends TogglableComponentInterface> = {
  child: CallableComponent<T>;
} & ComponentProps<ToggleInterface>;


export type ToggleInterface = ComponentInterface<
  ToggleConstructor,
  ToggleEvents,
  ToggleApi
>;

export type ToggleConstructor = {
  toggled?: boolean;
  toggleAttributeName?: string;
};

export type ToggleEvents = {
  onToggle: (toggled: boolean) => void;
};

export type ToggleApi = {
  setToggled: (toggled: boolean) => void;
  toggle: () => void;
  isToggled: () => boolean;
};

export function Toggle<T extends TogglableComponentInterface>(
  props: ToggleProps<T>,
): JSX.Element {
  const { constructor, events, setApi } =
    splitComponentProps<ToggleInterface>(props);
  let togglabeleComponentApi: T["api"];

  let toggled = constructor.toggled ?? false;

  const api: ToggleApi = {
    isToggled() {
      return toggled;
    },
    toggle() {
      toggled = !toggled;
      setToggleAttributeOnElement(toggled);
    },
    setToggled(value: boolean) {
      if (toggled !== value) {
        toggled = value;
        setToggleAttributeOnElement(toggled);
      }
    },
  };

  const eventHandlers: ToggleEvents = {
    onToggle: (toggled: boolean) => {
      events?.onToggle?.(toggled);
    },
  };


  function setToggleAttributeOnElement(value: boolean) {
    const toggleAttributeName = constructor.toggleAttributeName ?? "toggled";
    const element = togglabeleComponentApi["pt:root"];
    if (value) {
      element.setAttribute(toggleAttributeName, "");
    } else {
      element.removeAttribute(toggleAttributeName);
    }
  }

  function customOnMount() {
    setToggleAttributeOnElement(toggled);
    setApi?.(api);

  }

  return props.child.function({
    ...props.child.props,
    api: (api) => {
      togglabeleComponentApi = api;
      props.child.props.api?.(api);
      customOnMount();
    },
    onClick: (e: Event) => {
      props.child.props.onClick?.(e);
      const prevToggled = toggled;
      api.toggle();
      if (prevToggled !== toggled) {
        eventHandlers.onToggle(toggled);
      }
    },
  });
}

// export function Toggle<
//   T extends ToggleProps,
//   F extends (props: Props) => JSX.Element,
// >(props: T, type: F): JSX.Element {
//   const RenderedComponent = type;
//   return RenderedComponent(props);
// }

// export function Toggle<
//   ExtraConstructor extends PropsConstructorType,
//   ExtraEvents extends PropsEventsType<"onClick">,
//   ExtraApi extends PropsApiType<{ element: HTMLElement }>,
//   T extends Props<
//     ExtraConstructor,
//     ExtraEvents,
//     ExtraApi,
//     true
//   >,
//   F extends (props: T) => JSX.Element,
// >(
//   props: Exact<T, Props<
//     ToggleConstructor<ExtraConstructor>,
//     ToggleEvents<ExtraEvents>,
//     ToggleApi<ExtraApi>,
//     true
//   >>,
//   type: F
// ): JSX.Element {
//   const { constructor, events, api: setApi } = props;
//   const [localConstructor, forwardConstructor] = splitProps(constructor, [
//     "toggled",
//   ]);
//   const { onClick: extractedOnClick, ...forwardEvents } = events || {};
//   let componentApi: ExtraApi;

//   console.log("rendered toggle will forward these props constructor", forwardConstructor);

//   let toggled = localConstructor.toggled ?? false;

//   const api: ToggleApi = {
//     isToggled() {
//       return toggled;
//     },
//     toggle() {
//       toggled = !toggled;
//       setToggleAttributeOnElement(toggled);
//     },
//     setToggled(value: boolean) {
//       if (toggled !== value) {
//         toggled = value;
//         setToggleAttributeOnElement(toggled);
//       }
//     },
//   };

//   const eventHandlers: ToggleEvents = {
//     onToggle: (toggled: boolean) => {
//       events?.onToggle?.(toggled);
//     },
//   };

//   function setToggleAttributeOnElement(value: boolean) {
//     const element = componentApi.element;
//     if (value) {
//       element.setAttribute("toggled", "");
//     } else {
//       element.removeAttribute("toggled");
//     }
//   }

//   function customOnMount() {
//     setToggleAttributeOnElement(toggled);
//     setApi?.({ ...componentApi, ...api });
//   }

//   const RenderedComponent = type;
//   return (
//     // @ts-ignore
//     <RenderedComponent
//       api={(api) => {
//         componentApi = api;
//         customOnMount();
//       }}
//       constructor={
//         forwardConstructor
//       }
//       events={{
//         ...forwardEvents,
//         onClick: (e: Event) => {
//           extractedOnClick?.(e);
//           const prevToggled = toggled;
//           api.toggle();
//           if (prevToggled !== toggled) {
//             eventHandlers.onToggle(toggled);
//           }
//         },
//       }}
//     />
//   );
// }
