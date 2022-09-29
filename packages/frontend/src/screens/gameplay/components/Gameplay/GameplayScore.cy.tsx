import { GameplayScore } from "./GameplayScore";
import "../../../../style.css";

const timing = [
  {
    window: "absolute",
    count: 1120,
  },
  {
    window: "perfect",
    count: 50,
  },
  {
    window: "miss",
    count: 5,
  },
];

describe("GameplayScore", () => {
  it("scores", () => {
    cy.mount(() => (
      <div class="border border-2" style={{ width: "300px" }}>
        <GameplayScore timing={timing} percent="99.45%" />
      </div>
    ));
  });
});
