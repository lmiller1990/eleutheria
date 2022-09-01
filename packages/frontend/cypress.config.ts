import { defineConfig as defineVite } from "vite";
import { defineConfig } from "cypress";

const viteConfig = defineVite({
  optimizeDeps: {
    include: [
      "cypress/vue",
      "vue",
      "dedent",
      "pinia",
      "cypress-real-events/support",
      "css",
      "vue-router",
      "events",
    ],
  },
});

export default defineConfig({
  projectId: "vgqrwp",

  component: {
    experimentalSingleTabRunMode: true,
    devServer: {
      framework: "vue",
      bundler: "vite",
      viteConfig,
    },
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
