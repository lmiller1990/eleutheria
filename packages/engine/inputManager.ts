import { Input } from "@packages/engine";

export interface InputManagerConfig {
  maxWindowMs: number;
  onKeyDownCallback?: Map<string, () => void>;
}

export class InputManager {
  historicalInputs: Input[] = [];
  activeInputs: Input[] = [];
  config: InputManagerConfig;
  lastUpdateHash: string = "";
  t0?: number;

  constructor(
    private codeColumnMap: Map<string, number>,
    config: Partial<InputManagerConfig> = {}
  ) {
    this.config = {
      ...config,
      maxWindowMs: 500,
    };
  }

  setOrigin(t0: number) {
    this.t0 = t0;
  }

  onKey = (e: KeyboardEvent, type: "up" | "down") => {
    if (!this.codeColumnMap.has(e.code)) {
      return;
    }

    if (this.t0 === undefined) {
      throw Error(
        `t0 must be set before listening for keyboard events! Set it with InputManager#setOrigin`
      );
    }

    const column = this.codeColumnMap.get(e.code);

    if (type === "up") {
      const cb = this.config?.onKeyDownCallback?.get(e.code);
      if (cb) {
        cb();
      }
    }

    if (column === undefined) {
      return;
    }

    const input: Input = {
      id: (e.timeStamp - this.t0).toString(),
      column,
      ms: e.timeStamp - this.t0,
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
