import terser from "@rollup/plugin-terser";

export default {
  input: "client/register/register.js",
  output: {
    dir: "client/output",
    format: "iife",
    sourcemap: "inline",
    name: "registerBundled",
  },
  plugins: [terser()],
};
