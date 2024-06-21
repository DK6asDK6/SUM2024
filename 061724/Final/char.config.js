import terser from "@rollup/plugin-terser";

export default {
  input: "client/character/character.js",
  output: {
    dir: "client/output",
    format: "iife",
    sourcemap: "inline",
    name: "charBundled",
  },
  plugins: [terser()],
};
