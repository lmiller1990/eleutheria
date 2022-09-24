import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import VueTypeImports from "vite-plugin-vue-type-imports";

export default defineConfig({
  plugins: [vue(), VueTypeImports()],
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
