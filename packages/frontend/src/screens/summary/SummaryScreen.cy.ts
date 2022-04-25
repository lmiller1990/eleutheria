import { mount } from 'cypress/vue'
import SummaryScreen from "./SummaryScreen.vue";

describe("SummaryScreen", () => {
  it("displays score", () => {
    mount(SummaryScreen)
  });
});
