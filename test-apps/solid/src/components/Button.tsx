import { Button as XButton, type Props as xProps } from "@xcomponents2/button";
import type { JSX } from "solid-js";

type Props = xProps & {
  size?: "small" | "medium" | "large";
};

const ForwardableXButton = XButton as (props: xProps) => JSX.Element;

export function Button(props: Props) {
  const [constructor, rest] = splitProps(props, ["size"]);
  const expect = rest;

  const forwardedProps = {
    "pt:root": props.size === "large" ? {
        height: "40px",
        backgroundColor: [[":hover","blue"]],
    } : undefined,
    ...rest,
  } satisfies xProps;

  return <ForwardableXButton {...forwardedProps} />;
}

function splitProps<T, K extends keyof T>(
  obj: T,
  keys: readonly K[],
): [Pick<T, K>, DistributiveOmit<T, K>] {
  const picked = {} as Pick<T, K>;
  const rest = { ...obj } as DistributiveOmit<T, K>;

  for (const key of keys) {
    picked[key] = obj[key];
    delete (rest as any)[key];
  }

  return [picked, rest];
}

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;
