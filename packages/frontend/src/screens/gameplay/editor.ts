import type { ParamData, WebSocketEmitData } from "@packages/types";

let startAtSeconds = 4;
let repeatIntervalSeconds = 2;

export function useEditor(data: ParamData) {
  const ws = new window.WebSocket(`ws://localhost:5566`);

  ws.addEventListener("open", () => {
    ws.send(
      JSON.stringify({
        type: "editor:start",
        data,
      })
    );
  });

  ws.addEventListener("message", (msg) => {
    const payload = JSON.parse(msg.data) as WebSocketEmitData;

    if (payload.type === "editor:chart:updated") {
      console.log("Got", payload.data);
      // stop();
      // start(payload.data);
    }
  });

  return {
    ws,
  };
}
