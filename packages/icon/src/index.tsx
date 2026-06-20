import { untrack, createEffect, type JSX } from "solid-js";
import defaultLibrary from "./libraries/default";
import { Dynamic } from "solid-js/web";
import { lucideLibrary } from "./libraries/lucide";
import {
  stylex,
  type StylexDefinition,
  mergeStylexDefinitions,
} from "@stylex3/solid";
import { Props } from "@xcomponents2/shared/props";
import { Component } from "@xcomponents2/shared/component";
false && stylex;

const libraries = {
  default: defaultLibrary,
  lucide: lucideLibrary,
};
let defautltLibraryName = "default" as const;

export interface IconConfigLibraries {
  default: typeof defaultLibrary;
  lucide: typeof lucideLibrary;
}
export interface IconConfigSettings {}

export function IconConfig(config: {
  libraries?: Partial<IconConfigLibraries>;
  defaultLibrary?: keyof IconConfigLibraries;
}) {
  if (config.libraries) {
    Object.entries(
      config.libraries as Record<string, Record<string, string>>,
    ).forEach(([library, value]) => {
      let existing =
        (libraries as Record<string, Record<string, string>>)[library] ||
        ({} as Record<string, string>);
      existing = { ...existing, ...value };
      // @ts-ignore
      libraries[library as keyof IconConfigLibraries] =
        existing as IconConfigLibraries[keyof IconConfigLibraries];
    });
  }
  if (config.defaultLibrary) {
    // @ts-ignore
    defautltLibraryName = config.defaultLibrary;
  }
}

type ProvidedDefault = IconConfigSettings extends {
  defaultLibrary: infer D extends keyof IconConfigLibraries;
}
  ? D
  : typeof defautltLibraryName;

export type DefaultLibraryName = ProvidedDefault;

export type DefaultLibraryKeys = keyof IconConfigLibraries[DefaultLibraryName];

export type LibraryKeyUnion =
  | {
      [L in keyof IconConfigLibraries]: `${L &
        string}:${keyof IconConfigLibraries[L] & string}`;
    }[keyof IconConfigLibraries]
  | (DefaultLibraryKeys & string);

export type IconComponent = Component<
  IconConstructor,
  {},
  {},
  true,
  typeof Icon
>;

export type IconProps = Props<IconConstructor, {}, {}, true>;

export type IconConstructor = {
  name: LibraryKeyUnion;
  size?: number;
  color?: string;
  "pt:root"?: StylexDefinition;
};

export function Icon(props: IconProps): JSX.Element {
  const { constructor } = props;

  const defaults = {
    size: constructor.size ?? 16,
    color: "currentColor",
  };

  const [libraryKeyOrIconKey, iconKey] = constructor.name.split(":") as [
    string,
    string | undefined,
  ];
  let icon: string;
  if (!iconKey) {
    icon = (libraries as Record<string, Record<string, string>>)[
      defautltLibraryName
    ]?.[libraryKeyOrIconKey];
  } else {
    icon = (libraries as Record<string, Record<string, string>>)[
      libraryKeyOrIconKey
    ]?.[iconKey];
  }

  if (!icon) {
    console.error(`Icon "${constructor.name}" not found in library"`);
    icon = libraries["default"]["question-mark"];
  }

  const result = parseSvg(icon);
  if (result) {
    const { attributes, innerSvg } = result;
    return (
      <svg
        {...{
          ...(attributes && attributes),
        }}
        width={defaults.size}
        height={defaults.size}
        color={defaults.color}
        innerHTML={innerSvg}
        use:stylex={mergeStylexDefinitions(
          {
            width: `${defaults.size}px`,
            height: `${defaults.size}px`,
            color: defaults.color,
            fill: "currentColor",
            stroke: "currentColor",
          },
          constructor["pt:root"],
        )}
      />
    );
  } else {
    return (
      <span
        innerHTML={icon}
        use:stylex={mergeStylexDefinitions(
          {
            display: "inline-block",
            width: `${defaults.size}px`,
            height: `${defaults.size}px`,
            color: defaults.color,
            fill: "currentColor",
            stroke: "currentColor",
          },
          constructor["pt:root"],
        )}
      />
    );
  }
}

function parseSvg(
  icon: string,
): { attributes: Record<string, string | boolean>; innerSvg: string } | null {
  const match = icon.match(/<svg\b([^>]*)>([\s\S]*?)<\/svg>/i);
  if (!match) return null;

  const attrsChunk = match[1];
  const innerSvg = match[2];

  const attrRegex =
    /([a-zA-Z_:][\w:.\-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

  const attributes: Record<string, string | boolean> = {};
  let attrMatch: RegExpExecArray | null;

  while ((attrMatch = attrRegex.exec(attrsChunk)) !== null) {
    const name = attrMatch[1];
    const value = attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? true;
    attributes[name] = value;
  }

  return { attributes, innerSvg };
}

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      stylex: StylexDefinition;
    }
  }
}
