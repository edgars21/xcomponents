import { Component, untrack } from "solid-js";
import * as icons from "lucide-solid";
import { stylex, type StyleXValidSolidType } from "@stylex/solid";
import defaultLibrary from "./libraries/default";
import { Dynamic } from "solid-js/web";

const libraries = {
  default: defaultLibrary,
};
let defautltLibraryName = "default" as const;

export interface IconConfigLibraries {
  default: typeof defaultLibrary;
}
export interface IconConfigSettings {}

export function IconConfig(config: {
  libraries?: Partial<IconConfigLibraries>;
  defaultLibrary?: keyof IconConfigLibraries;
}) {
  if (config.libraries) {
    Object.entries(
      config.libraries as Record<string, Record<string, string>>
    ).forEach(([library, value]) => {
      let existing =
        (libraries as Record<string, Record<string, string>>)[library] ||
        ({} as Record<string, string>);
      existing = { ...existing, ...value };
      libraries[library as keyof IconConfigLibraries] =
        existing as IconConfigLibraries[keyof IconConfigLibraries];
    });
  }
  if (config.defaultLibrary) {
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

export type Props = Constructor;

export type Constructor = {
  // ref?: (el: HTMLInputElement) => void;
  name: LibraryKeyUnion;
  size?: number;
  color?: string;
  "pt:root"?: (() => StyleXValidSolidType) | StyleXValidSolidType;
};

export default function Icon(p: Props) {
  const props = untrack(() => p);

  const constructor = {
    ...({
      size: 16,
      color: "currentColor",
    } satisfies Partial<Constructor>),
    ...(props as Constructor),
  };

  const [libraryKeyOrIconKey, iconKey] = props.name.split(":") as [
    string,
    string | undefined
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
    console.error(`Icon "${props.name}" not found in library"`);
    icon = libraries["default"]["question-mark"];
  }
 
  const result = parseSvg(icon);  
  if (result) {
    const { attributes, innerSvg } = result;
    return (
      <Dynamic
        component="svg"
        {...(attributes && attributes)}
        width={constructor.size}
        height={constructor.size}
        color={constructor.color}
        innerHTML={innerSvg}
      />
    );
  } else {
    return <Dynamic component="span" innerHTML={icon} />;
  }
}

function parseSvg(
  icon: string
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
