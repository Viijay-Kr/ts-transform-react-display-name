import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["transform.ts"],
  external: ["typescript"],
  format: ["cjs"],
  minify: true,
  tsconfig: "tsconfig.build.json",
});
