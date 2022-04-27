import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  base: "./",
  resolve: {
    alias: {
      "@packages/breeze-css": path.resolve(__dirname, "../packages/breeze-css"),
    },
  },
  server: {
    fs: {
      strict: false,
    },
  },
});
