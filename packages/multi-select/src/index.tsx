export {MultiSelectItem} from "./item";
// import { splitProps, type JSX } from "solid-js";
// import {
//   Props,
//   type PropsConstructorType,
//   type PropsEventsType,
//   type PropsApiType,
// } from "@xcomponents2/shared/props";
// import { type Component } from "@xcomponents2/shared/component";
// import { stylex, mergeStylexDefinitions } from "@stylex/solid";
// false && stylex;

// type Options = { value: string; label: string }[];
// type Selected = string | null;

// export type MultiSelectProps = Props<
//   MultiSelectConstructor,
//   MultiSelectEvents,
//   MultiSelectApi,
//   true
// >;

// export type MultiSelectConstructor<
//   T extends PropsConstructorType | undefined = undefined,
// > = {
//   toggled?: boolean;
// } & (T extends undefined ? {} : T);

// export type MultiSelectEvents<T extends PropsEventsType | undefined = undefined> = {
//   onToggle: (toggled: boolean) => void;
// } & (T extends undefined ? {} : T);

// export type MultiSelectApi<T extends PropsApiType | undefined = undefined> = {
//   setToggled: (toggled: boolean) => void;
//   toggle: () => void;
//   isToggled: () => boolean;
// } & (T extends undefined ? {} : T);


// type Exact<T, Shape> = T extends Shape ? (keyof T extends keyof Shape ? T : never) : never;

// export function MultiSelect<
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
