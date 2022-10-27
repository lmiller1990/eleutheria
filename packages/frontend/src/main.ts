import { createApp } from "vue";
// https://vitejs.dev/guide/backend-integration.html
import "vite/modulepreload-polyfill";
import "@packages/game-data/styles/global.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import urql, {
  createClient,
  dedupExchange,
  fetchExchange,
  ssrExchange,
  // cacheExchange,
} from "@urql/vue";
import { devtoolsExchange } from "@urql/devtools";
import { cacheExchange } from "@urql/exchange-graphcache";
import { createRouter } from "./router";
import "./output.css";

declare global {
  interface Window {
    __SSR_DATA__: Record<string, any>;
  }
}

const client = createClient({
  url: "/graphql",
  fetchOptions: {
    headers: {
      "x-graphql-from": "client",
    },
  },
  exchanges: [
    devtoolsExchange,
    dedupExchange,
    cacheExchange({
      keys: {
        Viewer: () => null,
      },
      updates: {
        Mutation: {
          signOut(_result, _args, cache, _info) {
            // Clear out `Chart` which contains personal best scores,
            // But keep the actual song list - that isn't user specific (yet, anyway).
            cache.invalidate({
              __typename: "Chart",
            });
          },
        },
      },
    }),
    ssrExchange({
      isClient: true,
      initialState: window.__SSR_DATA__,
    }),
    fetchExchange,
  ],
});

const app = createApp(App);

app.use(createPinia());
app.use(createRouter());
app.use(urql, client);
app.mount("#app");
