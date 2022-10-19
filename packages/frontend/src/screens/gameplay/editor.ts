import type { WebSocketEmitData } from "@packages/shared";

// TODO: These
// let startAtSeconds = 4;
// let repeatIntervalSeconds = 2;

class EE {
  #events: Map<string, Function[]> = new Map();

  subscribe(name: string, cb: Function) {
    const t = this.#events.get(name);
    if (t) {
      this.#events.set(name, t.concat(cb));
    } else {
      this.#events.set(name, [cb]);
    }
  }

  emit(name: string, ...args: any[]) {
    (this.#events.get(name) ?? []).forEach((fn) => fn(...args));
  }
}

export function useEditor() {
  const ws = new window.WebSocket(`ws://localhost:5566`);
  const emitter = new EE();

  ws.addEventListener("open", () => {
    console.log("web socket open");
    ws.send(
      JSON.stringify({
        type: "editor:start",
      })
    );
  });

  ws.addEventListener("message", (msg) => {
    const payload = JSON.parse(msg.data) as WebSocketEmitData;
    console.log("received web socket message", msg, payload);

    if (payload.type === "editor:chart:updated") {
      emitter.emit("editor:chart:updated");
    }
  });

  return {
    ws,
    emitter,
  };
}
