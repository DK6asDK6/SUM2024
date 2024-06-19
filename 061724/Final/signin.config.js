import terser from "@rollup/plugin-terser";

export default {
  input: "client/login/signin.js",
  output: {
    dir: "client/output",
    format: "iife",
    sourcemap: "inline",
    name: "signBundled",
  },
  plugins: [terser()],
};
