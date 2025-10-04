// import Icon from "@xcomponents/icon";
import Button from "@xcomponents/button";
import Popper from "@xcomponents/popper";
import Tooltip from "@xcomponents/tooltip";
// import Test from "./Test";
import { createSignal, Show } from "solid-js";
import ProgressCircle from "@xcomponents/progress-circle";

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
          tooltipSlot={
            <h1>
              some shit inside{" "}
              <div>
                <ProgressCircle indeterminate />
              </div>
            </h1>
          }
          ref={setButtonEl}
          rootStylex={{ width: "unset", height: "unset" }}
          size="large"
          icon="Activity"
          caret
          labelSlot="View"
        >
          Click Me
        </Button>
        <Button
        
          icon="Activity"
        >Here</Button>
      </div>
    </div>
  );
}
