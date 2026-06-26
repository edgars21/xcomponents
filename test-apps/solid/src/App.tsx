import { stylex } from "@stylex3/solid";
import {
  Button,
  IconButton,
  ToggleButton,
  type ToggleButtonProps,
  ToggleIconButton,
  type ButtonInterface,
  type ToggleButtonInterface,
  type ButtonProps,
} from "@xcomponents2/button";
false && stylex;

export type Prettify<T> = { [K in keyof T]: T[K] } & {};

export default function App() {
  return [ToggleIconButton({ icon: "lucide:apple", toggled: true })];
}

export function Test(props: {
  constructor: { toggled: boolean; label: string };
}) {
  return <div>{props.constructor.label}</div>;
}
