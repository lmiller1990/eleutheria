import ArtistInfo from "./ArtistInfo.vue";

describe("<ArtistInfo />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(() => (
      <div style="width: 250px">
        <ArtistInfo artist="Litmus*" />
      </div>
    ));
  });
});
