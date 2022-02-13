import { $debugLiveNoteCount, $debugFps } from "./elements";

export function writeDebugToHtml(fps: number) {
  const noteCount = document.querySelectorAll(".note");
  $debugLiveNoteCount.textContent = noteCount.length.toString();
  $debugFps.textContent = fps.toFixed();
}
