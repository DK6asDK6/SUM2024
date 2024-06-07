import terser from "@rollup/plugin-terser";

export default {
  input: "main.js",
  output: {
    dir: "output",
    format: "iife",
    sourcemap: "inline",
  },
  plugins: [terser()],
};
