import terser from "@rollup/plugin-terser";

export default {
  input: "client/choosemap/choose.js",
  output: {
    dir: "client/output",
    format: "iife",
    sourcemap: "inline",
    name: "chsBundled",
  },
  plugins: [terser()],
};
