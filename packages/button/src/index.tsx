
import { splitProps, JSX, Component } from "solid-js";

type ElementEvents<T extends HTMLElement> = JSX.DOMAttributes<T>;

interface MyInputProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export function Button(props: MyInputProps) {
  const [local, rest] = splitProps(props, ["label"]);
  return <button {...rest}>{local.label}</button>
}