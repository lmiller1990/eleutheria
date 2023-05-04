import Gameplay from "./Gameplay.vue";
import "../../../../style.css";

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

// TODO: How do we test actual gameplay?
describe.skip("Gameplay", () => {
  before(() => {
    cy.viewport(1500, 820);
  });

  it("renders", () => {
    // @ts-ignore
    cy.mount(Gameplay, {
      props: {
        __testingDoNotStartSong: false,
        __testingManualMode: true,
        getAudioData: () => {
          return {
            audioData: {},
            audioContext: new AudioContext(),
          };
        },
        gql: {
          song: {
            chart: {
              parsedTapNoteChart: [
                {
                  __typename: "BaseNote",
                  id: "1",
                  ms: 100,
                  column: 1,
                  measureNumber: 1,
                  char: "O",
                },
              ],
            },
          },
        },
      },
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
