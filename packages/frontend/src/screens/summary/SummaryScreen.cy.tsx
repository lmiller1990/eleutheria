import { SummaryScreenContainer } from "./SummaryScreenContainer";
import { Timing } from "../gameplay/components/Gameplay/GameplayScore";

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
    cy.mount(() => (
      <SummaryScreenContainer
        file="abyss_breaker"
        percent={99.5}
        timing={timing}
        level={15}
        songTitle="Abyss Breaker"
        records={{
          world: 98.58,
          personal: 92.6,
        }}
      />
    ));
  });

  it.only("new personal best record", () => {
    cy.mount(() => (
      <SummaryScreenContainer
        file="abyss_breaker"
        percent={90.5}
        timing={timing}
        level={15}
        songTitle="Abyss Breaker"
        records={{
          world: 98.58,
          personal: 80.5,
        }}
      />
    ));
  });
});
