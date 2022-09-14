import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import VueTypeImports from "vite-plugin-vue-type-imports";

export default defineConfig({
  plugins: [vue(), VueTypeImports()],
  base: "./",
  build: {
    // generate manifest.json in outDir
    manifest: true,
    rollupOptions: {
      // overwrite default .html entry
      input: "/path/to/main.js",
    },
  },
  server: {
    fs: {
      strict: false,
    },
    proxy: {
      // "^/api/.*": {
      //   target: "http://localhost:5566",
      //   changeOrigin: true,
      //   rewrite: (path) => {
      //     const p = path.replace(/^\/api/, "");
      //     return p;
      //   },
      // },
    },
  },
});
