import { mount } from "../../../cypress/support/component";
import Input from "./Input.vue";
import type { InputProps } from "./types";

describe("Input", () => {
  it("renders", () => {
    mount<InputProps>(Input, {
      props: {
        modelValue: "0:00",
      },
    });
  });
});
