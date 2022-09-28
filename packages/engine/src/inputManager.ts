import type { Input } from ".";
import type { DevModeOptions } from "./api";

export interface InputManagerConfig {
  maxWindowMs: number;
  onKeyDownCallback?: Map<string, () => void>;
  dev?: DevModeOptions;
}

export class InputManager {
  historicalInputs: Input[] = [];
  #codeColumnMap: Map<string, number>;
  activeInputs: Input[] = [];
  config: InputManagerConfig;
  lastUpdateHash: string = "";
  #dt: number = 0;
  t0?: number;

  constructor(
    codeColumnMap: Map<string, number>,
    config: Partial<InputManagerConfig> = {}
  ) {
    this.config = {
      ...config,
      maxWindowMs: 500,
    };
    this.#codeColumnMap = codeColumnMap;
  }

  setOrigin(t0: number) {
    this.t0 = t0;
  }

  setTestOnlyDeltaTime(dt: number) {
    this.#dt = dt;
  }

  onKey = (e: KeyboardEvent, type: "up" | "down") => {
    if (!this.#codeColumnMap.has(e.code)) {
      return;
    }

    if (this.t0 === undefined) {
      throw Error(
        `t0 must be set before listening for keyboard events! Set it with InputManager#setOrigin`
      );
    }

    const column = this.#codeColumnMap.get(e.code);

    if (type === "up") {
      const cb = this.config?.onKeyDownCallback?.get(e.code);
      if (cb) {
        cb();
      }
    }

    if (column === undefined) {
      return;
    }

    const ms = this.config.dev?.manualMode
      ? this.#dt
      : e.timeStamp - this.t0 + (this.config.dev?.startAtMs ?? 0);

    const input: Input = {
      id: ms.toString(),
      column,
      ms,
      type,
    };

    this.activeInputs.push(input);
  };

  // arrow function for lexical this
  onKeyUp = (e: KeyboardEvent) => {
    return this.onKey(e, "up");
  };

  // arrow function for lexical this
  onKeyDown = (e: KeyboardEvent) => {
    return this.onKey(e, "down");
  };

  listen() {
    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("keyup", this.onKeyUp);
  }

  teardown() {
    document.removeEventListener("keydown", this.onKeyDown);
    document.removeEventListener("keyup", this.onKeyUp);
  }

  clear = () => {
    this.activeInputs = [];
  };
}
