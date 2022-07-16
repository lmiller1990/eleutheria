import { ScrollDirection } from "./types";

export class ModifierManager {
  #multiplier = 1;
  #scrollDirection: ScrollDirection = "up";

  setMultipler(val: number) {
    this.#multiplier = val;
  }

  get multiplier() {
    return this.#multiplier;
  }

  setScroll(val: "up" | "down") {
    this.#scrollDirection = val;
  }

  get scrollDirection() {
    return this.#scrollDirection;
  }
}
