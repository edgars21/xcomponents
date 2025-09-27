// tsup.config.ts (or your esbuild config)
import { defineConfig } from "tsup";
import { solidPlugin } from "esbuild-plugin-solid";

export default defineConfig({
  entry: ["src/index.tsx"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  target: "es2019",
  external: ["solid-js", "solid-js/web"],
  esbuildPlugins: [solidPlugin()],
});
