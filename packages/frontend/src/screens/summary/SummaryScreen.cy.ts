import { mount } from "cypress/vue";
import SummaryScreen from "./SummaryScreen.vue";
import style from "../../../../breeze-css/dist/breeze.css";
import appStyle from "../../style.css";

describe("SummaryScreen", { viewportHeight: 660, viewportWidth: 1000 }, () => {
  it("displays score", () => {
    mount(SummaryScreen, {
      styles: [
        style,
        appStyle,
        "https://fonts.googleapis.com/css2?family=Comfortaa:wght@700&display=swap",
      ],
    });
  });
});
