import { $debugLiveNoteCount, $debugFps } from "./elements";

interface WriteDebugToHtml {
  ticks: number;
  afterUpdate: () => void;
}

export function writeDebugToHtml(options: WriteDebugToHtml) {
  const noteCount = document.querySelectorAll(".note");
  $debugLiveNoteCount.textContent = noteCount.length.toString();
  $debugFps.textContent = options.ticks.toFixed();
  options.afterUpdate();
}
