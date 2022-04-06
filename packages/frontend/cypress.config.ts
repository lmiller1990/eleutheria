import { devServer } from "@cypress/vite-dev-server";

export default {
  component: {
    devServer,
    devServerConfig: {
      // optionally provide your Vite config overrides.
    },
  },
};
