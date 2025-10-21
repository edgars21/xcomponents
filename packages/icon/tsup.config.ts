// tsup.config.ts
import path from "path";
import fs from "fs/promises";
import { defineConfig } from "tsup";
import { solidPlugin } from "esbuild-plugin-solid";
import type { Plugin } from "esbuild";

const rawPlugin: Plugin = {
  name: "raw-loader",
  setup(build) {
    build.onResolve({ filter: /\?raw$/ }, (args) => {
      const realPath = path.resolve(
        args.resolveDir,
        args.path.replace(/\?raw$/, "")
      );
      return { path: realPath, namespace: "raw-file" };
    });

    build.onLoad({ filter: /.*/, namespace: "raw-file" }, async (args) => {
      const content = await fs.readFile(args.path, "utf8");
      return {
        contents: `export default ${JSON.stringify(content)};`,
        loader: "js",
      };
    });
  },
};

export default defineConfig({
  entry: ["src/index.tsx", "src/libraries/lucide/index.tsx"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  target: "es2019",
  external: ["solid-js", "solid-js/web"],
  esbuildPlugins: [solidPlugin(), rawPlugin],
  clean: true, // optional: clears out dist so you know you're seeing a fresh build
});
