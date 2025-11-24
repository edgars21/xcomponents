import { type StyleXJs } from "@stylex/solid";
import { type Props as ButtonProps } from "@xcomponents/button";
export type Props = Constructor;
export interface Constructor {
    items: {
        value: string;
        label: string;
        "pt:button"?: ButtonProps;
    }[];
    align?: "start" | "center" | "end";
    "pt:root"?: ElementSetter;
}
interface ElementSetter {
    attr?: Record<string, string>;
    stylex?: (() => StyleXJs) | StyleXJs;
}
export default function Menu(p: Props): any;
export {};
//# sourceMappingURL=index.d.ts.map