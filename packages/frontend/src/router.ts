import { defineComponent, h, onUnmounted } from "vue";
import { createRouter as _createRouter, createWebHistory } from "vue-router";
import { InputManager } from "@packages/engine";
import SongSelectScreen from "./screens/SongSelectScreen.vue";
import GameplayScreen from "./screens/gameplay/GameplayScreen.vue";
import SummaryScreen from "./screens/summary/SummaryScreen.vue";

export const createRouter = () =>
  _createRouter({
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
      {
        path: "/debug",
        component: defineComponent({
          setup() {
            const inputManager = new InputManager(new Map([["KeyJ", 0]]));
            inputManager.setOrigin(0);
            inputManager.listen();
            onUnmounted(inputManager.teardown);
            return () => h("div");
          },
        }),
      },
    ],
  });
