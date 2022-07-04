import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import { createRouter } from "./router";
import "./index.css";

const app = createApp(App);
app.use(createPinia());
app.use(createRouter());
app.mount("#app");
