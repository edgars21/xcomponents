import { Component, splitProps, onMount } from "solid-js";
import * as icons from "lucide-solid";

export type Props = {
  ref?: (el: HTMLInputElement) => void;
  name: keyof typeof icons;
  size?: number;
  color?: string;
  strokeWidth?: number | string;
  class?: string;
} & Record<string, any>;

export const Icon: Component<Props> = (allProps) => {
  const [props, rest] = splitProps(allProps, [
    "name",
    "size",
    "color",
    "strokeWidth",
    "class",
  ]);

  let rootEl!: HTMLInputElement;

  onMount(() => rest.ref?.(rootEl));

  // Get the component from the icons map
  const LucideIcon = icons[props.name] as unknown as Component<any> | undefined;

  if (!LucideIcon) {
    // fallback if the icon name doesn’t exist
    return (
      <span
        class={`inline-block align-middle rounded-sm bg-black/10 ${
          props.class ?? ""
        }`}
        style={{
          width: `${props.size ?? 24}px`,
          height: `${props.size ?? 24}px`,
        }}
      />
    );
  }

  return (
    <LucideIcon
      size={props.size ?? 24}
      color={props.color}
      strokeWidth={props.strokeWidth ?? 2}
      class={props.class}
      {...rest}
    />
  );
};

export default Icon;
