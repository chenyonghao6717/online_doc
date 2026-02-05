import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"], // your backend entry file
  outDir: "dist", // output folder
  format: ["esm"], // NodeNext expects ESM
  target: "esnext", // modern JS
  sourcemap: true, // helpful for debugging
  clean: true, // wipe dist before build
  dts: false, // backend usually doesn’t need .d.ts
  minify: false, // keep readable output
});
