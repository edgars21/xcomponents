import { Select } from "@xcomponents2/select";
import { Transition } from "solid-transition-group";
import { createSignal, Show } from "solid-js";

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
      <Transition
        appear
        onEnter={(el, done) => {
          el.animate(
            [
              { opacity: 0, transform: "translateY(calc(100%))" },
              { opacity: 1, transform: "translateY(calc(100% + 10px))" },
            ],
            { duration: 300, easing: "ease-out" },
          ).finished.then(done);
        }}
        onExit={(el, done) => {
          el.animate(
            [
              { opacity: 1, transform: "translateY(calc(100% + 10px))" },
              { opacity: 0, transform: "translateY(calc(100%))" },
            ],
            { duration: 300, easing: "ease-in" },
          ).finished.then(done);
        }}
      >
        <Show when={rOpenedState()}>
          <div
            style={{ width: "100px", height: "100px", background: "red" }}
          ></div>
        </Show>
      </Transition>
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
