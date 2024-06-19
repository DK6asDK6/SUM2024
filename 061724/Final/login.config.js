// import terser from "@rollup/plugin-terser";

export default {
  input: "client/login.js",
  output: {
    dir: "client/output",
    format: "iife",
    sourcemap: "inline",
    name: "loginBundled",
  },
  // plugins: [terser()],
};
