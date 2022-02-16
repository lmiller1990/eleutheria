import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import SongSelectScreen from "./screens/SongSelectScreen.vue";
import GameplayScreen from "./screens/gameplay/GameplayScreen.vue";
import SummaryScreen from "./screens/summary/SummaryScreen.vue";
import { createPinia } from "pinia";
import "./index.css";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: SongSelectScreen,
    },
    {
      path: "/game",
      component: GameplayScreen,
    },
    {
      path: "/summary",
      component: SummaryScreen,
    },
  ],
});

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount("#app");
