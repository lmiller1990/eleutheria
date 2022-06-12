import { h } from "vue";
import SongItemCompact from "./SongItemCompact.vue";

describe("SongItemCompact", () => {
  it("playground", () => {
    cy.viewport(600, 300)

    const el = h(
      SongItemCompact,
      {},
      {
        default: () =>
          h(
            "div",
            { style: { color: "white", fontSize: "2rem" } },
            "Text goes here..."
          ),
      }
    );

    cy.mount(() => el)
  })
})