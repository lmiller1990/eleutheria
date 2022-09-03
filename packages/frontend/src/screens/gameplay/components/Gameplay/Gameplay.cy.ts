import { mount } from "../../../../../cypress/support/component";
import Gameplay from "./Gameplay.vue";
import { GameplayProps } from "./types";
import appStyle from "../../../../style.css";
import { noteSkins } from "../../../../../cypress/fixtures/modifiers";
import { songData, testSong } from "../../../../../cypress/fixtures/songs";
import { AudioProvider } from "@packages/engine";

const audioProvider: AudioProvider = (..._args) => {
  return Promise.resolve(() => {
    const audioContext = new AudioContext();
    return {
      audioContext,
      startTime: 0,
      source: audioContext.createBufferSource(),
    };
  });
};

function waitFor<T>(win: Window, key: string) {
  let to = win.setTimeout(() => {
    throw Error("Could not find ${key} on window after 5000ms!");
  }, 5000);

  return new Promise<T>((resolve) => {
    let i = win.setInterval(() => {
      if (win[key as any]) {
        win.clearTimeout(to);
        win.clearInterval(i);
        resolve(win[key as any] as any as T);
      }
    }, 500);
  });
}

describe("Gameplay", () => {
  before(() => {
    cy.viewport(1500, 820);
  });

  it("renders", () => {
    mount<GameplayProps>(Gameplay, {
      props: {
        __testingDoNotStartSong: false,
        __testingManualMode: true,
        startGameArgs: {
          songData,
          userData: {
            js: "",
            css: "",
          },
          noteSkinData: noteSkins,
          audioProvider,
          paramData: {
            id: testSong.id,
            difficulty: songData.charts[0].difficulty,
          },
          songCompleted: () => {},
        },
      },
      styles: [
        appStyle,
        "https://fonts.googleapis.com/css2?family=Comfortaa:wght@700&display=swap",
      ],
    });

    let manualTick: typeof window["manualTick"];

    // Move note to targets. note_ms=100, padding_start=2000
    cy.window().then(async (win) => {
      manualTick = await waitFor<typeof window["manualTick"]>(
        win,
        "manualTick"
      );
      manualTick(2100);
    });

    // Trigger key and tick again to update game state!
    cy.document()
      .trigger("keydown", {
        timeStamp: 2100,
        code: "KeyD",
      })
      .then(() => {
        manualTick(2100);
      });
  });
});
