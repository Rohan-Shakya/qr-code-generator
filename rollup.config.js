import ts from "rollup-plugin-typescript2";
import terser from "@rollup/plugin-terser";

import pkg from "./package.json" assert { type: "json" };

const banner =
  "/*!" +
  "\n * vue-qr-code " +
  pkg.version +
  "\n * " +
  pkg.description +
  "\n * © " +
  new Date().getFullYear() +
  " Rohan-Shakya(https://github.com/Rohan-Shakya)" +
  "\n * MIT License." +
  "\n */";

function createEntry(options) {
  const config = {
    input: "src/index.ts",
    external: ["vue"],
    output: {
      name: "VueQRCode",
      file: options.file,
      format: options.format,
      exports: "default",
      globals: {
        vue: "Vue",
      },
      banner,
    },
    plugins: [
      ts({
        check: options.format === "es",
        tsconfigOverride: {
          compilerOptions: {
            declaration: options.format === "es",
          },
          exclude: ["src", "lib"],
        },
      }),
    ],
  };

  if (Array.isArray(options.plugins)) {
    config.plugins.push(...options.plugins);
  }

  return config;
}

const browserPlugins = [
  terser({
    format: {
      comments: function (node, comment) {
        const { value, type } = comment;
        return type === "comment2" && /^!/.test(value);
      },
    },
    compress: {
      pure_getters: true,
      unsafe: true,
      unsafe_comps: true,
      drop_console: true,
    },
  }),
];

export default [
  createEntry({ format: "cjs", file: pkg.main }),
  createEntry({ format: "es", file: pkg.module }),
  createEntry({ format: "umd", file: pkg.browser }),
  createEntry({ format: "umd", file: pkg.unpkg, plugins: browserPlugins }),
];
