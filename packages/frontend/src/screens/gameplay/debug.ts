import type { World } from "@packages/engine";
import type { Elements } from "./elements";

export function writeDebugToHtml(
  _world: World,
  fps: number,
  elements: Elements
) {
  const noteCount = document.querySelectorAll(".note");
  elements.debugLiveNoteCount.textContent = noteCount.length.toString();
  elements.debugFps.textContent = fps.toFixed();
}
