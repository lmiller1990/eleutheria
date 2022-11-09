import { defineConfig as defineVite, mergeConfig } from "vite";
import { defineConfig } from "cypress";
import viteConfig from "./vite.config";

const viteConfigTesting = defineVite({
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
      viteConfig: mergeConfig(viteConfig, viteConfigTesting),
    },
  },

  e2e: {
    baseUrl: "http://localhost:5566",
    setupNodeEvents(on, config) {
      // on("task", {
      //   "start:server": async () => {
      //     const cwd = path.join(__dirname, "..", "game-data");
      //     try {
      //       execa("node", ["dist"], { shell: true, cwd });
      //       await waitForServer("localhost", 5566);
      //       return null
      //     } catch (e) {
      //       console.log("error starting server", e);
      //     }
      //     return null;
      //   },
      // });
    },
  },
});
