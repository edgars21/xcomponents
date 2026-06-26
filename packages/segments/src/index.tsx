import { type JSX, onMount } from "solid-js";
import {
  stylex,
  type StylexDefinition,
  mergeStylexDefinitions,
} from "@stylex/solid";
import { ToggleButton,type ToggleButtonInterface, type ToggleButtonProps, ToggleIconButton,type ToggleIconButtonInterface, type ToggleIconButtonProps } from "@xcomponents2/button";
import {
  MultiSelect,
  type MultiSelectInterface,
} from "@xcomponents2/multi-select";
import {
  type ComponentProps,
  type ComponentInterface,
  splitComponentProps,
} from "@xcomponents2/shared/component";
false && stylex;

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      stylex: StylexDefinition;
    }
  }
}

export type ButtonSegmentsProps = ComponentProps<ButtonSegmentsInterface>;
export type ButtonSegmentsInterface = ComponentInterface<
  ButtonSegmentsConstructor,
  ButtonSegmentsEvents,
  ButtonSegmentsApi
>;
export type ButtonSegmentsConstructor = {
  "pt:root"?: StylexDefinition;
} & Omit<MultiSelectInterface<ToggleButtonInterface>["constructor"], "pt:item"> & {
  "pt:item": ToggleButtonProps;
};

export type ButtonSegmentsEvents =
  MultiSelectInterface<ToggleButtonInterface>["events"];
export type ButtonSegmentsApi =
  MultiSelectInterface<ToggleButtonInterface>["api"];

export function ButtonSegments(props: ButtonSegmentsProps): JSX.Element {
  const { constructor, events, setApi } =
    splitComponentProps<ButtonSegmentsInterface>(props);

  let api: ButtonSegmentsApi;

  onMount(() => {
    setApi?.(api);
  });

  const { "pt:root": extractedPtItem, ...itemPropsWithoutExtarcted } =
    constructor["pt:item"];

  const itemProps = {
    ...itemPropsWithoutExtarcted,
    "pt:root": mergeStylexDefinitions(
      {
        backgroundColor: [
          ["@selected", "oklch(0.7 0 0)"],
          [":hover", "#ccc"],
          "transparent",
        ],
        border: "none",
      },
      extractedPtItem,
    ),
  };

  return (
    <div
      use:stylex={mergeStylexDefinitions(
        {
          width: "max-content",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "2px",
          backgroundColor: "transparent",
          borderRadius: "4px",
          border: "1px solid #ccc",
          padding: "2px",
        },
        constructor["pt:root"],
      )}
    >
      {MultiSelect({
        options: constructor.options,
        "pt:item": {
          function: ToggleButton,
          props: itemProps,
        },
        api: (a) => (api = a),
        ...(events.onSelect && {
          onSelect: events.onSelect,
        }),
      })}
    </div>
  );
}

export type IconButtonSegmentsProps = ComponentProps<IconButtonSegmentsInterface>;
export type IconButtonSegmentsInterface = ComponentInterface<
  IconButtonSegmentsConstructor,
  IconButtonSegmentsEvents,
  IconButtonSegmentsApi
>;
export type IconButtonSegmentsConstructor = {
  "pt:root"?: StylexDefinition;
} & Omit<MultiSelectInterface<ToggleIconButtonInterface>["constructor"], "pt:item"> & {
  "pt:item": ToggleIconButtonProps;
};

export type IconButtonSegmentsEvents =
  MultiSelectInterface<ToggleIconButtonInterface>["events"];
export type IconButtonSegmentsApi =
  MultiSelectInterface<ToggleIconButtonInterface>["api"];

export function IconButtonSegments(props: IconButtonSegmentsProps): JSX.Element {
  const { constructor, events, setApi } =
    splitComponentProps<IconButtonSegmentsInterface>(props);

  let api: IconButtonSegmentsApi;

  onMount(() => {
    setApi?.(api);
  });

  const { "pt:root": extractedPtItem, ...itemPropsWithoutExtarcted } =
    constructor["pt:item"];

  const itemProps = {
    ...itemPropsWithoutExtarcted,
    "pt:root": mergeStylexDefinitions(
      {
        backgroundColor: [
          ["@selected", "oklch(0.7 0 0)"],
          [":hover", "#ccc"],
          "transparent",
        ],
        border: "none",
      },
      extractedPtItem,
    ),
  };

  return (
    <div
      use:stylex={mergeStylexDefinitions(
        {
          width: "max-content",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "2px",
          backgroundColor: "transparent",
          borderRadius: "4px",
          border: "1px solid #ccc",
          padding: "2px",
        },
        constructor["pt:root"],
      )}
    >
      {MultiSelect({
        value: constructor.value,
        options: constructor.options,
        "pt:item": {
          function: ToggleIconButton,
          props: itemProps,
        },
        api: (a) => (api = a),
        ...(events.onSelect && {
          onSelect: events.onSelect,
        }),
      })}
    </div>
  );
}

// export type SegmentsProps = ComponentProps<SegmentsInterface>;
// export type SegmentsInterface = ComponentInterface<
//   SegmentsConstructor,
//   SegmentsEvents,
//   SegmentsApi
// >;
// export type SegmentsConstructor = {
//   "pt:root"?: StylexDefinition;
// } & MultiSelectInterface<ToggleButtonInterface>["constructor"];
// export type SegmentsEvents =
//   MultiSelectInterface<ToggleButtonInterface>["events"];
// export type SegmentsApi = MultiSelectInterface<ToggleButtonInterface>["api"];

// export function Segments(props: SegmentsProps): JSX.Element {
//   const { constructor, events, setApi } =
//     splitComponentProps<SegmentsInterface>(props);

//   let api: SegmentsApi;

//   onMount(() => {
//     setApi?.(api);
//   });

//   const { "pt:root": extractedPtItem, ...itemPropsWithoutExtarcted } =
//     constructor["pt:item"].props;

//   const itemProps = {
//     ...itemPropsWithoutExtarcted,
//     "pt:root": mergeStylexDefinitions(
//       {
//         backgroundColor: [
//           ["@selected", "oklch(0.7 0 0)"],
//           [":hover", "#ccc"],
//           "transparent",
//         ],
//         border: "none",
//       },
//       extractedPtItem,
//     ),
//   };

//   return (
//     <div
//       use:stylex={mergeStylexDefinitions(
//         {
//           width: "max-content",
//           display: "flex",
//           flexDirection: "row",
//           alignItems: "center",
//           gap: "2px",
//           backgroundColor: "transparent",
//           borderRadius: "4px",
//           border: "1px solid #ccc",
//           padding: "2px",
//         },
//         constructor["pt:root"],
//       )}
//     >
//       {MultiSelect({
//         options: constructor.options,
//         "pt:item": {
//           function: constructor["pt:item"].function,
//           props: itemProps,
//         },
//         api: (a) => (api = a),
//         ...(events.onSelect && {
//           onSelect: events.onSelect,
//         }),
//       })}
//     </div>
//   );
// }
