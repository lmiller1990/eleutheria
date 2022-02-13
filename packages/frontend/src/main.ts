import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import SongSelectScreen from "./screens/SongSelectScreen.vue";
import GameplayScreen from "./screens/gameplay/GameplayScreen.vue";
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
  ],
});

const app = createApp(App);
app.use(router);
app.mount("#app");
