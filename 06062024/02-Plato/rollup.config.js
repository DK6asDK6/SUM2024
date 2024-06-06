import terser from "@rollup/plugin-terser";

module.exports = {
  input: "main.js",
  output: {
    dir: "output",
    format: "cjs",
  },
  plugins: [terser()],
};
