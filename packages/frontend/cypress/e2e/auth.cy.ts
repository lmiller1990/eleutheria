function randomNum() {
  return (Math.random() * 100000).toFixed(0);
}

describe("authentication flow", () => {
  beforeEach(() => {
    cy.clearCookies();
  });

  it("signs up", () => {
    cy.visit("/");
    cy.get('[data-cy="guest"]').contains("Guest").click();
    cy.get("button").contains("Sign Up").click();

    const username = randomNum();
    const email = `${username}@${randomNum()}.com`;
    const password = "password";

    cy.get("input[name='username']").clear().type(username);
    cy.get("input[name='email']").clear().type(email);
    cy.get("input[name='password']").clear().type(password);

    cy.get("button").contains("Submit").click();
    cy.get('[data-cy="viewer"]').should("have.text", email);
  });
});
