import SongInfoPanel from "./SongInfoPanel.vue";

describe("SongInfoPanel", () => {
  it("renders", () => {
    cy.mount(SongInfoPanel, {
      props: {
        personalBest: '99.50',
        bpm: 155,
        noteCount: 1100,
        duration: '1:50'
      },
      style: `
        body {
          background: #828282;
        }
      `,
    });
  });
});
