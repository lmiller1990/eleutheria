import { createApp } from "vue";
// https://vitejs.dev/guide/backend-integration.html
import "vite/modulepreload-polyfill";
import "@packages/game-data/styles/global.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import { createRouter } from "./router";
import "./output.css";

const app = createApp(App);
app.use(createPinia());
app.use(createRouter());
app.mount("#app");
