import { mount } from "cypress/vue";
import SummaryScreen from "./SummaryScreen.vue";
import style from "../../../../breeze-css/dist/breeze.css";
import appStyle from "../../style.css";
import { songs } from "../../../cypress/fixtures";
import { pinia } from "../../../cypress/support/component";
import { useSongsStore } from "../../stores/songs";
import { useSummaryStore } from "../../stores/summary";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({ history: createWebHistory(), routes: [] });

function setTestData() {
  const songsStore = useSongsStore();
  songsStore.$patch((state) => {
    state.songs = [{ ...songs[0], id: "0", order: 0, key: "0" }];
  });

  const summaryStore = useSummaryStore();
  summaryStore.$patch((state) => {
    state.summary = {
      achievements: ["Full Combo!"],
      percent: "96.54",
      timing: {
        absolute: {
          count: 405,
          early: 0,
          late: 0,
        },
        miss: {
          count: 10,
          early: 0,
          late: 0,
        },
        perfect: {
          count: 350,
          early: 0,
          late: 0,
        },
        great: {
          count: 250,
          early: 120,
          late: 130,
        },
      },
    };
  });
}

describe("SummaryScreen", { viewportHeight: 660, viewportWidth: 1000 }, () => {
  it("displays score", () => {
    setTestData();

    mount(SummaryScreen, {
      global: {
        plugins: [router, pinia],
      },
      styles: [
        style,
        appStyle,
        "https://fonts.googleapis.com/css2?family=Comfortaa:wght@700&display=swap",
      ],
    });
  });
});
