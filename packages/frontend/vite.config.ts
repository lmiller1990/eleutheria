import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import VueTypeImports from "vite-plugin-vue-type-imports";
import path from "path";

export default defineConfig({
  plugins: [vue(), VueTypeImports()],
  base: "./",
  resolve: {
    alias: {
      "@packages/breeze-css": path.resolve(__dirname, "../packages/breeze-css"),
    },
  },
  server: {
    // hmr: false,
    fs: {
      strict: false,
    },
  },
});
