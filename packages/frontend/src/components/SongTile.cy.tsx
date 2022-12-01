import { useImageLoader } from "../composables/imageLoader";
import SongTile from "./SongTile.vue";

describe("SongTile", () => {
  before(() => {
    useImageLoader("songSelectScreen", {
      onAllLoaded: () => {},
      minimumLoadTimeMs: 0,
      target: 1,
    });
  });

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
