import type {
  NoteSkin,
  ParamData,
  UserScripts,
  LoadSongData,
} from "@packages/types";

export async function fetchNoteSkins(): Promise<NoteSkin[]> {
  const res = await window.fetch(`/note-skins`);
  return res.json();
}

export async function fetchUser(): Promise<UserScripts> {
  const res = await window.fetch(`/user`);
  return res.json();
}

export async function fetchData(id: string): Promise<LoadSongData> {
  const res = await window.fetch(`/songs/${id}`);
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
