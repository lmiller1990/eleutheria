import LoadingScreen from "./LoadingScreen.vue";

describe("LoadingScreen", () => {
  it("renders", () => {
    cy.mount(() => <LoadingScreen />);
  });
});
