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
import { DropdownMenu } from "@xcomponents2/dropdown-menu";
false && stylex;

export type Prettify<T> = { [K in keyof T]: T[K] } & {};

export default function App() {
  return [
    DropdownMenu({
      options: [
        { value: "1", label: "Option 1" },
        { value: "2", label: "Option 2" },
      ],
      // @ts-ignore
      child: <button>hey</button>,
    }),
  ];
}

export function Test(props: {
  constructor: { toggled: boolean; label: string };
}) {
  return <div>{props.constructor.label}</div>;
}
