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
        api={(valu) => {
          api = valu;
          console.log("Button API:", valu);
        }}
        // @ts-ignore
        events={{
          onClick: (e) => {
            console.log("Button clicked", e);
          },
        }}
      />
      <IconButton
        constructor={{
          icon: "lucide:apple",
        }}
      />
      {() => {
        return Toggle(Button,
          { constructor: { toggled: true }, events: {} },
        );
      }}

      {/* <Segments options={[{ value: "1", label: "Option 1" }, { value: "2", label: "Option 2" }, { value: "3", label: "Option 3" }]} /> */}
    </>
  );
}
