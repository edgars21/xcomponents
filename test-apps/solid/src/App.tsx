import { createSignal, Show } from "solid-js";
import { stylex, animate } from "@stylex3/solid";
import { Segments } from "@xcomponents2/segments";
import {
  Button,
  IconButton,
  ToggleButton,
  type ToggleButtonProps,
  ToggleIconButton,
  type ButtonInterface,
  type ToggleButtonInterface,
  type ButtonProps,
} from "@xcomponents2/button";
import { Toggle, type ToggleProps } from "@xcomponents2/toggle";
import { MultiSelect } from "@xcomponents2/multi-select";
import {type ComponentProps} from "@xcomponents2/shared/component";
false && stylex;

export type Prettify<T> = { [K in keyof T]: T[K] } & {};

type test = Prettify<ComponentProps<ToggleButtonInterface>>;
type test1 = ComponentProps<ToggleButtonInterface>;

export default function App() {
  return [
    Segments({
      options: [
        { value: "1", label: "Option 1", "pt:item": { label: "Option 1" } },
        { value: "2", label: "Option 2", "pt:item": { label: "Option 2" }},
        { value: "3", label: "Option 3", "pt:item": { label: "Option 3" }},
      ],
      "pt:item": {
        function: ToggleButton,
        props: { label: "Test" },
      },
    }),
    // MultiSelect<ToggleButtonInterface>({
    //   options: [
    //     { value: "1", label: "Option 1", "pt:item": { label: "Option 1" } },
    //     { value: "2", label: "Option 2", "pt:item": { label: "Option 2" }},
    //     { value: "3", label: "Option 3", "pt:item": { label: "Option 3" }},
    //   ],
    //   "pt:item": {
    //     function: ToggleButton,
    //     props: { label: "Test" },
    //   },
    // }),
  ];
}

// export default function App() {
//   return [
//     Button({
//       label: "Test",
//     }),
//     IconButton({
//       icon: "lucide:apple",
//     }),
//     ToggleButton({
//       label: "Toggle Test",
//     }),
//     ToggleIconButton({
//       icon: "lucide:apple",
//     }),
//   ];
// }

// export function AppJsx() {
//   return (
//     <>
//       <Button label="Test" />
//       <Button label="Test" />
//     </>
//   );
// }

// export function App1() {
//   return [
//     Ul({
//       id: "a-list",
//       class: "my-list",
//       attributes: { "data-foo": "bar" },
//       c: [
//         Li({ c: "Item 1" }),
//         Li({ c: B({ c: ["Item 2"] }) }),
//         Li({ c: "Item 3" }),
//       ],
//     }),
//   ];
// }

// export default function App() {
//   return [
//     Button({
//       label: "Test",
//     }),
//     Button({
//       label: "Second Test",
//     }),
//   ];
//   // <>
//   //   {/* <MultiSelectItem<ToggleButtonProps>
//   //     constructor={{
//   //       component: {
//   //         function: ToggleButton,
//   //         constructor: { toggled: true, label: "Test" },
//   //       },
//   //     }}
//   //   /> */}

//   // </>
// }

export function Test(props: {
  constructor: { toggled: boolean; label: string };
}) {
  return <div>{props.constructor.label}</div>;
}
