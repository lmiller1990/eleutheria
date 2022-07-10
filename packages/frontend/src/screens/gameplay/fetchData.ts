import { padStart } from "@packages/audio-utils";
import { LoadSongData } from "@packages/game-data";
import { getGameDataUrl } from "./env";
import { PADDING_MS } from "./gameConfig";

export interface ParamData {
  id: string;
  difficulty: string;
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

export async function fetchData(id: string): Promise<LoadSongData> {
  const res = await window.fetch(getGameDataUrl(`/songs/${id}`));
  return res.json();
}

export function getSongId(): ParamData {
  const url = new URL(window.location.toString());
  const params = new URLSearchParams(url.search);
  const id = params.get("song");
  const difficulty = params.get("difficulty");
  if (!id || !difficulty) {
    throw Error(
      `Expected ${window.location} to have search params ?song=<ID> and ?difficulty=<difficulty>`
    );
  }
  return { id, difficulty };
}
