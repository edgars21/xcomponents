import { Select } from "@xcomponents2/select";
import { ToggleButton, Button } from "@xcomponents2/button";
import { createSignal, Show } from "solid-js";
// import { Transition } from "@xcomponents2/shared/transition";
import { stylex, animate } from "@stylex3/solid";
false && stylex;

export default function App() {
  const [rOpenedState, setrOpenedState] = createSignal(true);
  return (<>
    <ToggleButton label="Toggle" />    
    <Button label="works" />
  </>
  );
}

