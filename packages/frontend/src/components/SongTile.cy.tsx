import SongTile from "./SongTile.vue";

describe("SongTile", () => {
  it("renders", () => {
    cy.mount(() => (
      <SongTile
        songTitle="Abyss Breaker"
        artist="D-D-Dice"
        file="abyss_breaker"
        selected={true}
      />
    ));
  });
});
