import { untrack, onMount, onCleanup } from "solid-js";
import { editor as monacoEditor } from "monaco-editor";
import styles from "monaco-editor/min/vs/editor/editor.main.css?raw";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import type * as CSS from "csstype";
import { stylex, type StyleXValidSolidType } from "@stylex/solid";
false && stylex;

export type Props = Constructor & Events;

export interface Constructor {
  ref?: (api: Api) => void;
  width?: CSS.Properties["width"];
  height?: CSS.Properties["height"];
  value?: string;
  language?: monacoEditor.IStandaloneEditorConstructionOptions["language"];
  automaticLayout?: monacoEditor.IStandaloneEditorConstructionOptions["automaticLayout"];
  theme?: monacoEditor.IStandaloneEditorConstructionOptions["theme"];
  editorOptions?: monacoEditor.IStandaloneEditorConstructionOptions;
  "pt:root"?: StyleXValidSolidType;
}

export interface Api {
  readonly value: string;
  setValue: (value: string) => void;
  setTheme: (theme: string) => void;
}

interface Events {
  onChange?: (value: string) => void;
}

type MonacoEditor = typeof monacoEditor;

// @ts-ignore
self.MonacoEnvironment = {
  getWorker(_: any, label: string) {
    return new editorWorker();
  },
};

export default function MonacoEditor(p: Props) {
  const props = untrack(() => p);

  const constructor = {
    width: "100%",
    height: "500px",
    automaticLayout: true,
    theme: "vs-dark",
    editorOptions: { minimap: { enabled: false } },
    ...({} as const),
    ...(props as Constructor),
  };

  const events = { ...props } as Events;

  let rootEl: HTMLDivElement | undefined;
  let editor: monacoEditor.IStandaloneCodeEditor | undefined;

  const api: Api = {
    get value() {
      return editor!.getValue();
    },
    setValue: (value: string) => {
      editor!.setValue(value);
    },
    setTheme: (theme: string) => {
      editor!.updateOptions({ theme });
    },
  };

  onMount(() => {
    requestAnimationFrame(() => {
      editor = monacoEditor.create(rootEl!, {
        ...(constructor.value && { value: constructor.value }),
        ...(constructor.language && { language: constructor.language }),
        ...(constructor.automaticLayout && {
          automaticLayout: constructor.automaticLayout,
        }),
        ...(constructor.theme && { theme: constructor.theme }),
        ...constructor.editorOptions,
      });

      const sub = editor.onDidChangeModelContent((e) => {
        const value = editor!.getValue();
        events.onChange && events.onChange(value);
      });

      if (constructor.ref) {
        constructor.ref(api);
      }

      onCleanup(() => {
        sub.dispose();
        editor!.dispose();
      });
    });
  });

  return (
    <>
      <div
        use:stylex={{
          //@ts-ignore
          width: constructor.width,
          //@ts-ignore
          height: constructor.height,
          ...constructor["pt:root"],
        }}
        ref={rootEl}
      ></div>
      <style>{styles}</style>
    </>
  );
}
