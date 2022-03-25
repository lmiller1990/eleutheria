import { padStart } from "@packages/audio-utils";
import type { ParsedTapNoteChart } from "@packages/chart-parser";
import { PADDING_MS } from "./config";

export async function fetchData(): Promise<ParsedTapNoteChart> {
  const res = await window.fetch(`http://localhost:8000/songs/${SONG.SONG_ID}`);
  return res.json();
}

const SONG = {
  // SONG_ID: "rave",
  // FORMAT: "mp3"
  SONG_ID: "165-bpm-test",
  FORMAT: "ogg",
} as const;

export const url = (song: typeof SONG) =>
  `http://localhost:4000/${song.SONG_ID}.${song.FORMAT}`;

export async function fetchAudio() {
  const audioContext = new AudioContext();

  const res = await window.fetch(url(SONG));
  const buf = await res.arrayBuffer();
  let buffer = await audioContext.decodeAudioData(buf);
  buffer = padStart(audioContext, buffer, PADDING_MS);

  var gainNode = audioContext.createGain();
  gainNode.gain.value = 1.0;
  gainNode.connect(audioContext.destination);

  return () => {
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    // use this for no assist tick
    // source.connect(audioContext.destination);
    source.connect(gainNode);
    source.start();
    const startTime = audioContext.getOutputTimestamp().performanceTime!;

    return { audioContext, source, startTime };
  };
}
