import type { ParamData, UserScripts } from "@packages/shared";

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
  const title = params.get("title");
  const personalBest = params.get("personalBest");
  const artist = params.get("artist");
  const file = params.get("file");
  const chartId = params.get("chartId");
  if (!songId || !chartId || !file || !artist || !personalBest || !title) {
    throw Error(
      `Expected ${window.location} to have search params song, chartId, file, artist, personalBest, title`
    );
  }
  return { songId, chartId, file, artist, title, personalBest };
}
