import { defineComponent, h, onUnmounted } from "vue";
import { createRouter as _createRouter, createWebHistory } from "vue-router";
import { InputManager } from "@packages/engine";
import SongSelectScreen from "./screens/SongSelectScreen";

export const createRouter = () => {
  const router = _createRouter({
    history: createWebHistory("/app"),
    routes: [
      {
        path: "/",
        component: SongSelectScreen,
      },
      {
        path: "/game",
        component: () => import("./screens/gameplay/GameplayScreen.vue"),
        meta: {
          requiresSongSelected: true,
        },
      },
      {
        path: "/summary",
        component: () => import("./screens/summary/SummaryScreen.vue"),
        meta: {
          requiresSongSelected: true,
        },
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

  return router;
};
