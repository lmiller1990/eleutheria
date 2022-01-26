import { Input } from "@packages/engine";

export interface InputManagerConfig {
  maxWindowMs: number;
}

export class InputManager {
  historicalInputs: Input[] = [];
  activeInputs: Input[] = [];
  config: InputManagerConfig;
  lastUpdateHash: string = "";
  t0?: number

  constructor(
    private codeColumnMap: Map<string, number>,
    config: Partial<InputManagerConfig>
  ) {
    this.config = {
      ...config,
      maxWindowMs: 500,
    };
  }

  setOrigin (t0: number) {
    this.t0 = t0
  }

  // arrow function for lexical this
  onKeyDown = (e: KeyboardEvent) => {
    if (!this.t0) {
      throw Error()
    }

    const column = this.codeColumnMap.get(e.code);
    if (column === undefined) {
      return;
    }

    this.activeInputs.push({
      id: (e.timeStamp - this.t0).toString(),
      column,
      ms: e.timeStamp - this.t0,
    });
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
    if (this.activeInputHash === this.lastUpdateHash) {
      return;
    }

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
  }

  teardown() {
    document.removeEventListener("keydown", this.onKeyDown);
  }
}
