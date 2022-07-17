import { padStart } from "@packages/audio-utils";
import { LoadSongData } from "@packages/game-data";
import { NoteSkin } from "@packages/types/src";
import { getGameDataUrl } from "./env";
import { PADDING_MS } from "./gameConfig";

export interface ParamData {
  id: string;
  difficulty: string;
}

export async function fetchNoteSkins(): Promise<NoteSkin[]> {
  const res = await window.fetch(getGameDataUrl(`/note-skins`));
  return res.json();
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
