import SummaryScreen from "./SummaryScreen.vue";
import { mount } from "../../../cypress/support/mount";

// TODO: Test this.
describe.skip(
  "SummaryScreen",
  { viewportHeight: 900, viewportWidth: 1600 },
  () => {
    it("displays score", () => {
      mount(SummaryScreen, {
        styles: [
          "https://fonts.googleapis.com/css2?family=Comfortaa:wght@700&display=swap",
        ],
      });
    });
  }
);
