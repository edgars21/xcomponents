// import Icon from "@xcomponents/icon";
import Button from "@xcomponents/button";
// import Test from "./Test";
import { createSignal } from "solid-js";

export default function App() {
  const [loading, setLoading] = createSignal(false);
  return (
    <div style="">
      <div style="display: flex; flex-gap: 10px">
        <Button
          rootStylex={{ width: "unset", height: "unset" }}
          size="large"
          icon="Activity"
          caret
          labelSlot="View"
          setLoading={loading}
          onClick={(e) => loading() ? setLoading(false) : setLoading(true)}
        >something else</Button>
      </div>
    </div>
  );
}
