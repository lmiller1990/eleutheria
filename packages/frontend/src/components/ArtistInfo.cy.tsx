import ArtistInfo from "./ArtistInfo.vue";

const composer = {
  name: "Lachlan",
  socials: [
    {
      social: "twitter",
      link: "https://twitter.com/Lachlan19900",
    },
  ],
};

describe("<ArtistInfo />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(() => (
      <div style="width: 250px">
        <ArtistInfo
          artist="Litmus*"
          composer={composer}
          stepChart={composer}
          bannerCreator={composer}
        />
      </div>
    ));
  });
});
