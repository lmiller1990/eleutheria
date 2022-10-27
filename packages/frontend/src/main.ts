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
  cacheExchange,
} from "@urql/vue";
import { devtoolsExchange } from "@urql/devtools";
// import { cacheExchange } from "@urql/exchange-graphcache";
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
    cacheExchange,
    // cacheExchange({
    //   keys: {
    //     Viewer: () => null,
    //     App: () => null,
    //   },
    // }),
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
