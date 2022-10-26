import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import VueTypeImports from "vite-plugin-vue-type-imports";
import vueJsx from "@vitejs/plugin-vue-jsx";

export default defineConfig({
  plugins: [vue(), vueJsx(), VueTypeImports()],
  base: "./",
  build: {
    manifest: true,
    rollupOptions: {
      input: "./src/main.ts",
    },
  },
  server: {
    hmr: false,
    fs: {
      strict: false,
    },
  },
});
