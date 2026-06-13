import { Select } from "@xcomponents2/select";
import { createSignal, Show } from "solid-js";
// import { Transition } from "@xcomponents2/shared/transition";
import { stylex, animate } from "@stylex3/solid";
false && stylex;

export default function App() {
  const [rOpenedState, setrOpenedState] = createSignal(true);
  return (
    <>
      <button onClick={() => setrOpenedState(!rOpenedState())}>Toggle</button>
      {rOpenedState() && <Inner />}
    </>
  );
}

export function Inner() {
  // @ts-ignore
  let api: ButtonApi;
  const [rOpenedState, setrOpenedState] = createSignal(true);

  return (
    <>
      <button onClick={() => setrOpenedState(!rOpenedState())}>Toggle</button>
      {/* <Transition
        insert={{
          transform: animate("translateY(50%)", {
            duration: 2000,
          }, "translateY(0)"),
          opacity: animate(0.5, {
            duration: 2000,
          }, 1),
          backgroundColor: animate("blue", {
            duration: 2000,
          }),
        }}
        remove={{
          transform: animate("translateY(50%)", {
            duration: 2000,
          }, "translateY(0)"),
          opacity: animate(0.5, {
            duration: 2000,
          }, 1),
          backgroundColor: animate("blue", {
            duration: 2000,
          }),
        }}
      >
        <Show when={rOpenedState()}>
          <div
            use:stylex={{ width: "100px", height: "100px", background: "red" }}
          ></div>
        </Show>
      </Transition> */}
      <Select
        clearable
        options={[
          { value: "1", label: "Option 1" },
          { value: "2", label: "Option 2" },
        ]}
      />
    </>
  );
}
