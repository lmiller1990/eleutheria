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
    baseUrl: "http://localhost:5566",
    setupNodeEvents(on, config) {
      on("task", {
        "start:server": () => {
          return null;
        },
      });
      // implement node event listeners here
    },
  },
});
