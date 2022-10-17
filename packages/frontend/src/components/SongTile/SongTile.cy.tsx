/// <reference types="cypress-real-events" />

import SongTile from "./SongTile.vue";

describe("SongTile.cy.ts", () => {
  it("renders", () => {
    cy.mount(() => (
      <SongTile
        songTitle="Abyss Breaker"
        artist="D-D-Dice"
        selected={false}
        imgSrc=""
      />
    ));
  });
});
