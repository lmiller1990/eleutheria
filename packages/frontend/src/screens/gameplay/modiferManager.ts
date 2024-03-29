import { NoteSkin } from "@packages/shared";
import dedent from "dedent";
import { EventEmitter } from "events";
import TypedEmitter from "typed-emitter";
import { ScrollDirection } from "./types";

export const defaultNoteSkinFallback = dedent`
  .note {
    height: var(--note-height);
    border-radius: 12px;

    box-sizing: border-box;
    font-size: 2rem;

    border: 1px solid #a8bdc7;
    background: #a8bdc7;
  }

  .note-1,
  .note-4 {
    background: #0a6ed6 !important;
  }
`;

export interface CoverParams {
  id: string;
  visible: boolean;
  offset: number;
  location: "top" | "bottom";
  style: string;
  code: string;
  css: string;
}

type ModifierManagerEvents = {
  "set:noteSkin": (val: NoteSkin) => void;
  "set:multiplier": (val: number, oldVal: number) => void;
  "set:cover": (val: CoverParams, oldVal: CoverParams) => void;
  "set:globalOffset": (val: number, oldVal: number) => void;
  "set:scrollDirection": (
    val: ScrollDirection,
    oldVal: ScrollDirection
  ) => void;
};

export class ModifierManager extends (EventEmitter as new () => TypedEmitter<ModifierManagerEvents>) {
  #multiplier = 200;
  #scrollDirection: ScrollDirection = "up";
  #globalOffset = 0;
  #noteSkin: NoteSkin = {
    name: "default",
    css: defaultNoteSkinFallback,
  };
  #cover: CoverParams = {
    id: "default",
    visible: true,
    location: "top",
    offset: 0,
    css: "",
    code: "",
    style: "",
  };

  setMultipler(val: number) {
    this.emit("set:multiplier", val, this.#multiplier);
    this.#multiplier = val;
  }

  setGlobalOffset(val: number) {
    this.emit("set:globalOffset", val, this.#globalOffset);
    this.#globalOffset = val;
  }

  setCover(val: Partial<CoverParams>) {
    this.emit("set:cover", { ...this.#cover, ...val }, this.#cover);
    this.#cover = { ...this.#cover, ...val };
  }

  setOffset(val: number) {
    this.#cover.offset = val;
  }

  setScroll(val: "up" | "down") {
    this.emit("set:scrollDirection", val, this.#scrollDirection);
    this.setCover({ location: val === "up" ? "bottom" : "top" });
    this.#scrollDirection = val;
  }

  setNoteSkin(noteSkin: NoteSkin) {
    this.#noteSkin = noteSkin;
    this.emit("set:noteSkin", noteSkin);
  }

  get noteSkin() {
    return this.#noteSkin;
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

  get globalOffset() {
    return this.#globalOffset;
  }
}
