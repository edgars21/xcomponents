import kebabCase from "lodash/kebabCase";
import * as allIcons from "lucide-static";

type KebabCase<S extends string> = S extends `${infer H}${infer T}`
  ? T extends Uncapitalize<T>
    ? `${Lowercase<H>}${KebabCase<T>}`
    : `${Lowercase<H>}-${KebabCase<Uncapitalize<T>>}`
  : S;

type KebabKeys<T> = {
  [K in keyof T as K extends string ? KebabCase<K> : never]: T[K];
};

function toKebabKeys<T extends Record<string, unknown>>(obj: T): KebabKeys<T> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    out[kebabCase(k)] = v;
  }
  return out as KebabKeys<T>;
}

export const icons = toKebabKeys(allIcons);

export * from "lucide-static";
