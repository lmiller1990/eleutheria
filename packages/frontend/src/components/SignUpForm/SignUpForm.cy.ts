import { mount } from "../../../cypress/support/component";
import SignUpForm from "./SignUpForm.vue";
import type { SignUpFormProps } from "./types";

describe("SignUpForm", { viewportHeight: 600, viewportWidth: 1000 }, () => {
  it("renders", () => {
    mount<SignUpFormProps>(SignUpForm, {
      props: {},
      style: `[data-v-app] { height: 100vh; }`,
    });

    cy.get('[data-cy="username"]').within(() => {
      cy.contains("Min 5").should("have.attr", "role", "error");
      cy.contains("Max 10").should("have.attr", "role", "");
      cy.contains("Alphanumeric").should("have.attr", "role", "");
    });

    cy.get('[data-cy="password"]').within(() => {
      cy.contains("Min 5").should("have.attr", "role", "error");
      cy.contains("Max 20").should("have.attr", "role", "");
    });

    cy.get('input[name="username"]').type("lachlan");
    cy.get('input[name="password"]').type("password");

    // no longer error state
    cy.contains("Min 5").should("have.attr", "role", "");
  });
});
