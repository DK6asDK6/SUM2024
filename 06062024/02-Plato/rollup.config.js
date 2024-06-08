import terser from "@rollup/plugin-terser";

export default {
  input: "src/main.js",
  output: {
    dir: "output",
    format: "iife",
    sourcemap: "inline",
  },
  plugins: [terser()],
};
