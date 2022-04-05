import { Input } from "@packages/engine";

export interface InputManagerConfig {
  maxWindowMs: number;
  onKeyCallback?: Map<string, () => void>;
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
    if (this.t0 === undefined) {
      throw Error(
        `t0 must be set before listening for keyboard events! Set it with InputManager#setOrigin`
      );
    }

    const column = this.codeColumnMap.get(e.code);

    const cb = this.config?.onKeyCallback?.get(e.code);

    if (cb) {
      cb();
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
    console.log(input);

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

  get activeInputHash() {
    return this.activeInputs
      .reduce((acc, curr) => `${acc}-${curr.ms}`, "")
      .toString();
  }

  consume(ids: string[]) {
    const inactive = this.activeInputs.filter((x) => ids.includes(x.id));
    this.historicalInputs.push(...inactive);
    this.activeInputs = this.activeInputs.filter((x) => !ids.includes(x.id));
    this.updateLastUpdateHash();
  }

  update(now: number) {
    // no need to update - nothing has changed!
    // TODO: is this optimization useful, or does it introduce surface area for
    // mis-interpreted inputs?
    // if (this.activeInputHash === this.lastUpdateHash) {
    //   return;
    // }

    const activeInputs: Input[] = [];

    for (const input of this.activeInputs) {
      if (now - input.ms > this.config.maxWindowMs) {
        this.historicalInputs.push(input);
      } else {
        activeInputs.push(input);
      }
    }

    this.activeInputs = activeInputs;
    this.updateLastUpdateHash();
  }

  updateLastUpdateHash() {
    this.lastUpdateHash = this.activeInputHash;
  }

  listen() {
    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("keyup", this.onKeyUp);
  }

  teardown() {
    document.removeEventListener("keydown", this.onKeyDown);
    document.removeEventListener("keyup", this.onKeyUp);
  }
}
