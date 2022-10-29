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

export function useEditor(openWebsocket: boolean) {
  const emitter = new EE();

  if (!openWebsocket) {
    return {
      emitter,
    };
  }

  const ws = new window.WebSocket(`ws://localhost:5566`);

  ws.addEventListener("open", () => {
    console.log("Connected to websocket");
    ws.send(
      JSON.stringify({
        type: "editor:start",
      })
    );
  });

  ws.addEventListener("message", (msg) => {
    const payload = JSON.parse(msg.data) as WebSocketEmitData;

    if (payload.type === "editor:chart:updated") {
      console.log("received websocket message");
      emitter.emit("editor:chart:updated");
    }
  });

  return {
    emitter,
  };
}
