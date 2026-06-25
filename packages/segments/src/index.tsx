import {type JSX, onMount } from "solid-js";
import {
  stylex,
  type StylexDefinition,
  mergeStylexDefinitions,
} from "@stylex/solid";
import { type ToggleButtonInterface } from "@xcomponents2/button";
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

export type SegmentsProps = ComponentProps<SegmentsInterface>;
export type SegmentsInterface = ComponentInterface<
  SegmentsConstructor,
  SegmentsEvents,
  SegmentsApi
>;
export type SegmentsConstructor = {
  "pt:root"?: StylexDefinition;
} & MultiSelectInterface<ToggleButtonInterface>["constructor"];
export type SegmentsEvents =
  MultiSelectInterface<ToggleButtonInterface>["events"];
export type SegmentsApi = MultiSelectInterface<ToggleButtonInterface>["api"];

export function Segments(props: SegmentsProps): JSX.Element {
  const { constructor, events, setApi } =
    splitComponentProps<SegmentsInterface>(props);

  let api: SegmentsApi;

  onMount(() => {
    setApi?.(api);
  });

  const { "pt:root": extractedPtItem, ...itemPropsWithoutExtarcted } =
    constructor["pt:item"].props;

  const itemProps = {
    ...itemPropsWithoutExtarcted,
    "pt:root": mergeStylexDefinitions(
      {
        backgroundColor: [[":hover", "#ccc"],"transparent"],
        border: "none"
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
        "pt:item": { function: constructor["pt:item"].function, props: itemProps },
        api: (a) => (api = a),
        ...(events.onSelect && {
          onSelect: events.onSelect,
        }),
      })}
    </div>
  );
}

// export function ButtonSegments(props: SegmentsProps): JSX.Element {
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
//         backgroundColor: [[":hover", "#ccc"],"transparent"],
//         border: "none"
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
//         "pt:item": { function: constructor["pt:item"].function, props: itemProps },
//         api: (a) => (api = a),
//         ...(events.onSelect && {
//           onSelect: events.onSelect,
//         }),
//       })}
//     </div>
//   );
// }
