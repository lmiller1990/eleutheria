import { EventEmitter } from "events"
import TypedEmitter from 'typed-emitter';
import { ScrollDirection } from "./types";

interface CoverParams {
  visible: boolean;
  offset: number;
  location: "top" | "bottom";
  background: string;
}

type ModifierManagerEvents = {
  "set:multiplier": (val: number, oldVal: number) => void;
  "set:cover": (val: CoverParams, oldVal: CoverParams) => void;
  "set:scrollDirection": (val: ScrollDirection, oldVal: ScrollDirection) => void;
}

export class ModifierManager extends (EventEmitter as new () => TypedEmitter<ModifierManagerEvents>) {
  #multiplier = 1;
  #scrollDirection: ScrollDirection = "up";
  #cover: CoverParams = {
    visible: true,
    location: "top",
    offset: 200,
    background: "none",
  };

  setMultipler(val: number) {
    this.emit("set:multiplier", val, this.#multiplier);
    this.#multiplier = val;
  }

  setCover(val: Partial<CoverParams>) {
    this.emit("set:cover", { ...this.#cover, ...val }, this.#cover);
    this.#cover = { ...this.#cover, ...val };
  }

  setScroll(val: "up" | "down") {
    this.emit("set:scrollDirection", val, this.#scrollDirection);
    this.#scrollDirection = val;
  }

  get cover() {
    return this.#cover;
  }

  get multiplier() {
    return this.#multiplier;
  }

  get scrollDirection() {
    return this.#scrollDirection;
  }
}
