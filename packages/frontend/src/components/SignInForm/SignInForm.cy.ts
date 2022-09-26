import SignInForm from "./index";

describe("SignInForm", { viewportWidth: 700 }, () => {
  it("works", () => {
    cy.mount(SignInForm)
  });
});
