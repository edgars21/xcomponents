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
      <ToggleButton constructor={{
        label: "First toggle button",
        startIcon: "lucide:home",
      }} />
      <ToggleIconButton constructor={{
        icon: "lucide:apple",
        
      }} events={{
        onToggle: (toggled) => {
          console.log("toggle icon button toggled", toggled);
        }
      }} />

      {/* <Segments options={[{ value: "1", label: "Option 1" }, { value: "2", label: "Option 2" }, { value: "3", label: "Option 3" }]} /> */}
    </>
  );
}


export function Test(props: {constructor: { toggled: boolean; label: string }}) {
  return <div>{props.constructor.label}</div>
}