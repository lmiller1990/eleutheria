import { SummaryScreenContainer } from "./SummaryScreenContainer";
import { Timing } from "../gameplay/components/Gameplay/GameplayScore";
import { mount } from "../../../cypress/support/mount";

const timing: Timing[] = [
  {
    window: "absolute",
    count: 1768,
  },
  {
    window: "perfect",
    count: 256,
  },
  {
    window: "miss",
    count: 40,
  },
];

describe("SummaryScreen", { viewportHeight: 900, viewportWidth: 1600 }, () => {
  it("displays score", () => {
    mount(
      () => (
        <SummaryScreenContainer
          percent="99.50"
          timing={timing}
          level={15}
          songTitle="Abyss Breaker"
          records={{
            world: "98.58",
            personal: "92.60",
          }}
        />
      ),
      {
        styles: [
          "https://fonts.googleapis.com/css2?family=Comfortaa:wght@700&display=swap",
        ],
      }
    );
  });
});
