import { createSignal, Show } from "solid-js";
import { stylex, animate } from "@stylex3/solid";
import { Segments } from "@xcomponents2/segments";
import {
  Button,
  IconButton,
  ToggleButton,
  ToggleIconButton,
} from "@xcomponents2/button";
import { Toggle } from "@xcomponents2/toggle";
false && stylex;

export default function App() {
  let api: any;
  return (
    <>
      <Button
        constructor={{
          label: "Normal Button",
        }}
      />
      <IconButton
        constructor={{
          icon: "lucide:apple",
        }}
      />
      <ToggleIconButton
        constructor={{
          icon: "lucide:apple",
        }}
        events={{
          onToggle: (toggled) => {
            console.log("ToggleIconButton toggled:", toggled);
          },
          onClick: (e) => {
            console.log("ToggleIconButton clicked", e);
          }
        }}
      />
      <ToggleButton
        constructor={{
          label: "Toggle Normal Button",
        }}
      />
      {/* {() => {
        return Toggle(Button,
          { constructor: { toggled: true }, events: {} },
        );
      }} */}

      {/* <Segments options={[{ value: "1", label: "Option 1" }, { value: "2", label: "Option 2" }, { value: "3", label: "Option 3" }]} /> */}
    </>
  );
}
