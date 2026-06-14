import { type FlowComponent, type JSX } from "solid-js";
import { resolveFirst, resolveElements } from "@solid-primitives/refs";
import { Mtransition, Stylex } from "@stylex3/solid";

export type TransitionEvents = {
  /**
   * Function called before the enter transition starts.
   * The {@link element} is not yet rendered.
   */
  onBeforeEnter?: (element: Element) => void;
  /**
   * Function called when the enter transition starts.
   * The {@link element} is rendered to the DOM.
   *
   * Call {@link done} to end the transition - removes the enter classes,
   * and calls {@link TransitionEvents.onAfterEnter}.
   * If the parameter for {@link done} is not provided, it will be called on `transitionend` or `animationend`.
   */
  onEnter?: (element: Element, done: () => void) => void;
  /**
   * Function called after the enter transition ends.
   * The {@link element} is removed from the DOM.
   */
  onAfterEnter?: (element: Element) => void;
  /**
   * Function called before the exit transition starts.
   * The {@link element} is still rendered, exit classes are not yet applied.
   */
  onBeforeExit?: (element: Element) => void;
  /**
   * Function called when the exit transition starts, after the exit classes are applied
   * ({@link TransitionProps.enterToClass} and {@link TransitionProps.exitActiveClass}).
   * The {@link element} is still rendered.
   *
   * Call {@link done} to end the transition - removes exit classes,
   * calls {@link TransitionEvents.onAfterExit} and removes the element from the DOM.
   * If the parameter for {@link done} is not provided, it will be called on `transitionend` or `animationend`.
   */
  onExit?: (element: Element, done: () => void) => void;
  /**
   * Function called after the exit transition ends.
   * The {@link element} is removed from the DOM.
   */
  onAfterExit?: (element: Element) => void;
};

export type TransitionProps = {
  children: JSX.Element;
  transition: {
    insert?: Mtransition["insert"];
    remove?: Mtransition["remove"];
  };
};

const TRANSITION_MODE_MAP = {
  inout: "in-out",
  outin: "out-in",
} as const;

export function Transition(props: {
  children: JSX.Element;
  transition: {
    insert: Mtransition["insert"];
  };
}): JSX.Element;
export function Transition(props: {
  children: JSX.Element;
  transition: {
    remove: Mtransition["remove"];
  };
}): JSX.Element;
export function Transition(props: {
  children: JSX.Element;
  transition: {
    insert: Mtransition["insert"];
    remove: Mtransition["remove"];
  };
}): JSX.Element;
export function Transition(props: TransitionProps): JSX.Element {
  const { insert, remove } = props.transition;
  return createSwitchTransition(
    resolveFirst(() => props.children),
    {
      mode: TRANSITION_MODE_MAP["outin"],
      appear: false,
      onEnter(el, done) {
        if (insert) {
          // @ts-ignore
          const stylex = el?.stylex as Stylex;
          // @ts-ignore
          const newInsert = {};
          const startPoint = Object.entries(insert).reduce(
            (acc, [key, value]) => {
              // @ts-ignore
              acc[key] = value.value;
              // @ts-ignore
              newInsert[key] = {
                ...value,
                // @ts-ignore
                value: el.style[key],
                from: undefined,
              };
              if (value.from) {
                // @ts-ignore
                newInsert[key].value = value.from;
              }
              return acc;
            },
            {},
          );
          // @ts-ignore
          stylex.apply(startPoint);
          const allAfterEnd = Object.entries(insert).map(([key, value]) => {
            return new Promise((resolve) => {
              const oldAfterEnd = value.afterEnd;
              value.afterEnd = () => {
                oldAfterEnd?.();
                resolve("");
              };
            });
          });
          // @ts-ignore
          void el.offsetWidth;
          // @ts-ignore
          stylex.apply(newInsert);
          Promise.all(allAfterEnd).then(() => {
            done();
            console.log("insert done");
          });
        } else {
          done();
          console.log("insert done");
        }
      },
      onExit(el, done) {
        if (remove) {
          const allAfterEnd = Object.entries(remove).map(([key, value]) => {
            return new Promise((resolve) => {
              const oldAfterEnd = value.afterEnd;
              value.afterEnd = () => {
                oldAfterEnd?.();
                resolve("");
              };
            });
          });
          // @ts-ignore
          const stylex = el?.stylex as Stylex;
          // @ts-ignore
          stylex.apply(remove);
          Promise.all(allAfterEnd).then(() => {
            done();
            console.log("remove done");
          });
        } else {
          done();
          console.log("remove done");
        }
      },
    },
  ) as unknown as JSX.Element;
}

import {
  type Accessor,
  batch,
  createSignal,
  untrack,
  $TRACK,
  createComputed,
  createMemo,
  useTransition,
} from "solid-js";
import { isServer } from "solid-js/web";

const noop = () => {
  /* noop */
};
const noopTransition = (el: any, done: () => void) => done();

export type TransitionMode = "out-in" | "in-out" | "parallel";

export type OnTransition<T> = (el: T, done: () => void) => void;

export type SwitchTransitionOptions<T> = {
  /**
   * a function to be called when a new element is entering. {@link OnTransition}
   *
   * It receives the element and a callback to be called when the transition is done.
   */
  onEnter?: OnTransition<T>;
  /**
   * a function to be called when an exiting element is leaving. {@link OnTransition}
   *
   * It receives the element and a callback to be called when the transition is done.
   * The element is kept in the DOM until the done() callback is called.
   */
  onExit?: OnTransition<T>;
  /**
   * transition mode. {@link TransitionMode}
   *
   * Defaults to `"parallel"`. Other options are `"out-in"` and `"in-out"`.
   */
  mode?: TransitionMode;
  /** whether to run the transition on the initial elements. Defaults to `false` */
  appear?: boolean;
};

export function createSwitchTransition<T>(
  source: Accessor<T>,
  options: SwitchTransitionOptions<NonNullable<T>>,
): Accessor<NonNullable<T>[]> {
  const initSource = untrack(source);
  const initReturned = initSource ? [initSource] : [];

  if (isServer) {
    return () => initReturned;
  }

  const { onEnter = noopTransition, onExit = noopTransition } = options;

  const [returned, setReturned] = createSignal<NonNullable<T>[]>(
    options.appear ? [] : initReturned,
  );
  const [isTransitionPending] = useTransition();

  let next: T | undefined;
  let isExiting = false;

  function exitTransition(el: T | undefined, after?: () => void) {
    if (!el) return after && after();
    isExiting = true;
    onExit(el, () => {
      batch(() => {
        isExiting = false;
        setReturned((p) => p.filter((e) => e !== el));
        after && after();
      });
    });
  }

  function enterTransition(after?: () => void) {
    const el = next;
    if (!el) return after && after();
    next = undefined;
    setReturned((p) => {
      return [el, ...p];
    });
    setTimeout(() => {
      onEnter(el, after ?? noop);
    });
  }

  const triggerTransitions: (prev: T | undefined) => void =
    options.mode === "out-in"
      ? // exit -> enter
        (prev) => isExiting || exitTransition(prev, enterTransition)
      : options.mode === "in-out"
        ? // enter -> exit
          (prev) => enterTransition(() => exitTransition(prev))
        : // exit & enter
          (prev) => {
            exitTransition(prev);
            enterTransition();
          };

  createComputed(
    (prev: T | undefined) => {
      const el = source();

      if (untrack(isTransitionPending)) {
        // wait for pending transition to end before animating
        isTransitionPending();
        return prev;
      }

      if (el !== prev) {
        next = el;
        batch(() => untrack(() => triggerTransitions(prev)));
      }

      return el;
    },
    options.appear ? undefined : initSource,
  );

  return returned;
}
