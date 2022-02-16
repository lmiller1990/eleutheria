import type { Elements } from "./elements";

export function writeDebugToHtml(fps: number, elements: Elements) {
  const noteCount = document.querySelectorAll(".note");
  elements.debugLiveNoteCount.textContent = noteCount.length.toString();
  elements.debugFps.textContent = fps.toFixed();
}
