// import Icon from "@xcomponents/icon";
import Button from "@xcomponents/button";
import Popper from "@xcomponents/popper";
// import Test from "./Test";
import { createSignal, Show } from "solid-js";

export default function App() {
  const [open, setOpen] = createSignal(false);
  const [buttonEl, setButtonEl] = createSignal<HTMLButtonElement | undefined>(
    undefined
  );

  return (
    <div
      style={{
        position: "fixed",
        width: "100%",
        height: "100%",
        display: "grid",
        "place-items": "center",
      }}
    >
      <div style="display: flex; flex-gap: 10px">
        <Button
          ref={setButtonEl}
          rootStylex={{ width: "unset", height: "unset" }}
          size="large"
          icon="Activity"
          caret
          labelSlot="View"
        >
          Click Me
        </Button>
        <Show when={buttonEl()}>
          <Popper anchor={buttonEl()!} setOpen={open} placement="bottom" arrow trigger="click">
            Stuff inside
          </Popper>
        </Show>
      </div>
    </div>
  );
}
