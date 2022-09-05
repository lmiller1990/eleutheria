import { mount } from "../../../cypress/support/component";
import SignUpForm from "./SignUpForm.vue";
import type { SignUpFormProps } from "./types";

describe("SignUpForm", () => {
  it("renders", () => {
    mount<SignUpFormProps>(SignUpForm, {
      props: {

      },
    });
  });
});