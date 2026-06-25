import { createSignal, Show } from "solid-js";
import { stylex, animate } from "@stylex3/solid";
import { Segments } from "@xcomponents2/segments";
import {
  Button,
  IconButton,
  ToggleButton,
  type ToggleButtonProps,
  ToggleIconButton,
  type ButtonProps,
} from "@xcomponents2/button";
import { Toggle, type ToggleProps } from "@xcomponents2/toggle";
import { MultiSelectItem } from "@xcomponents2/multi-select";
false && stylex;

export default function App() {
  return [
    Button({
      label: "Test",
    }),
    IconButton({
      icon: "lucide:apple",
    }),
    ToggleButton({
      label: "Toggle Test",
    }),
    ToggleIconButton({
      icon: "lucide:apple",
    }),
  ];
}

export function AppJsx() {
  return (
    <>
      <Button label="Test" />
      <Button label="Test" />
    </>
  );
}

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

//   //   {/* <Segments options={[{ value: "1", label: "Option 1" }, { value: "2", label: "Option 2" }, { value: "3", label: "Option 3" }]} /> */}
//   // </>
// }

export function Test(props: {
  constructor: { toggled: boolean; label: string };
}) {
  return <div>{props.constructor.label}</div>;
}
