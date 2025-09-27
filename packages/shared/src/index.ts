
import {
  type Accessor,
} from "solid-js";

type FirstArg<F> = F extends (...args: infer P) => any ? P[0] : never;

type _MappedValues<T, AllowRaw extends boolean> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? AllowRaw extends true
      ? Accessor<FirstArg<T[K]>> | FirstArg<T[K]>
      : Accessor<FirstArg<T[K]>>
    : never;
};

export type ToAccessorsCfg<
  T,
  AllowRaw extends boolean = false,
  MakeOptional extends boolean = false
> = MakeOptional extends true
  ? { [K in keyof _MappedValues<T, AllowRaw>]?: _MappedValues<T, AllowRaw>[K] }
  : {
      [K in keyof _MappedValues<T, AllowRaw>]-?: _MappedValues<T, AllowRaw>[K];
    };

export type ToAccessors<T> = ToAccessorsCfg<T, false, false>;
export type ToAccessorsOrValue<T> = ToAccessorsCfg<T, true, false>;
export type ToOptionalAccessors<T> = ToAccessorsCfg<T, false, true>;
export type ToOptionalAccessorsOrValue<T> = ToAccessorsCfg<T, true, true>;