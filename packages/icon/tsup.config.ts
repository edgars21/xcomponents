// tsup.config.ts
import path from "path";
import fs from "fs/promises";
import { defineConfig } from "tsup";
import { solidPlugin } from "esbuild-plugin-solid";
import type { Plugin } from "esbuild";

const rawPlugin: Plugin = {
  name: "raw-loader",
  setup(build) {
    // 1) Catch any import ending with ?raw and resolve it to an absolute path
    //    while tagging it with a custom namespace.
    build.onResolve({ filter: /\?raw$/ }, (args) => {
      const realPath = path.resolve(
        args.resolveDir,
        args.path.replace(/\?raw$/, "")
      );
      // Helpful to see it's actually matching:
      console.log(`[raw-loader] onResolve -> ${args.path} -> ${realPath}`);
      return { path: realPath, namespace: "raw-file" };
    });

    // 2) Load the file content as text for our custom namespace.
    build.onLoad({ filter: /.*/, namespace: "raw-file" }, async (args) => {
      const content = await fs.readFile(args.path, "utf8");
      console.log(
        `[raw-loader] onLoad -> ${args.path} (${content.length} bytes)`
      );
      return {
        contents: `export default ${JSON.stringify(content)};`,
        loader: "js",
      };
    });
  },
};

export default defineConfig({
  entry: ["src/index.tsx"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  target: "es2019",
  external: ["solid-js", "solid-js/web"],
  esbuildPlugins: [solidPlugin(), rawPlugin],
  clean: true, // optional: clears out dist so you know you're seeing a fresh build
});
