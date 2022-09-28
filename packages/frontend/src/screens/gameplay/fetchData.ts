import type { NoteSkin, ParamData, UserScripts } from "@packages/shared";

export async function fetchNoteSkins(): Promise<NoteSkin[]> {
  const res = await window.fetch(`/note-skins`);
  return res.json();
}

export async function fetchUser(): Promise<UserScripts> {
  // TODO: User Data via GraphQL
  return {
    css: ``,
    js: ``,
  };
}

export function getParams(): ParamData {
  const url = new URL(window.location.toString());
  const params = new URLSearchParams(url.search);
  const songId = params.get("songId");
  const difficulty = params.get("difficulty");
  if (!songId || !difficulty) {
    throw Error(
      `Expected ${window.location} to have search params ?song=<ID> and ?difficulty=<difficulty>`
    );
  }
  return { songId, difficulty };
}
