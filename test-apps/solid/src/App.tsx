// import { Popover } from "@kobalte/core/popover";
// import "./style.css";
// // import Icon from "@xcomponents/icon";
import Button from "@xcomponents/button";
// // import Test from "./Test";
import { createSignal, untrack, type Accessor } from "solid-js";

// export default function App() {
//   const [loading, setLoading] = createSignal(false);
//   return (
//     <div style="">
//       <div style="display: flex; flex-gap: 10px">
//         <Button
//           setLoading={loading()}
//           startIcon="Activity"
//           caret
//           labelSlot={<>Click me</>}
//           size="large"
//           onClick={() => setLoading(!loading())}
//         >
//           <div>Here we go</div>
//         </Button>
//       </div>
//     </div>
//   );
// }

export default function App() {
  const [loading, setLoading] = createSignal(0);
  return (
    <div style="">
      <div>Outter</div>
      <button onClick={() => setLoading(loading() + 1)}>Count</button>
      <Inner test={loading} />
    </div>
  );
}

function Inner(p: { test: Accessor<number> }) {
  const props = untrack(() => ({ ...p }));
  return (
    <div style="">
      Inner here {props.test()}
    </div>
  );
}