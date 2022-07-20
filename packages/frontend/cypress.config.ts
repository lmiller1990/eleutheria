import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "vgqrwp",
  component: {
    devServer: {
      framework: "vue",
      bundler: "vite",
    },
  },
});
