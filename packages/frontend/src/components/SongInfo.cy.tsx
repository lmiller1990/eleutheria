import { mount } from "cypress/vue";
import { SongInfo } from "./SongInfo";

describe("SongInfo", () => {
  it("playground", () => {
    mount(() => (
      <div style="margin: 80px 140px;">
        <SongInfo
          best="99.50"
          notes="1040"
          duration="1:50"
          bpm="150"
        />
      </div>
    ));
  });
});
