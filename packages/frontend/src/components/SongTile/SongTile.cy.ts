/// <reference types="cypress-real-events" />

import SongTile from "./SongTile.vue";
import { thumbails } from "../../thumbnails";
import { Props } from "./types";

function mountSongTile(props: Partial<Props> = {}) {
  // @ts-ignore
  return cy.mount(SongTile, {
    style: `
      [data-v-app] {
        height: 400px
      }

      body {
        background: black;
        margin: 10px;
      }
    `,
    props: {
      songTitle: "Azure Sky",
      imgSrc: thumbails[0],
      ...props,
    },
  });
}

describe("SongTile.cy.ts", () => {
  it("renders", () => {
    mountSongTile()
      .get('[data-cy="song-tile"]')
      .realHover()
      .get('[data-cy="play-symbol"]')
      .should("not.have.class", "opacity-1");
  });

  it("song is selected", () => {
    mountSongTile({ selected: true })
      .get('[data-cy="song-tile"]')
      .get('[data-cy="play-symbol"]')
      .should("have.class", "opacity-1");
  });
});
