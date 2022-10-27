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
  const file = params.get("file");
  const chartId = params.get("chartId");
  if (!songId || !chartId || !file) {
    throw Error(
      `Expected ${window.location} to have search params ?song=<ID> and ?chartId=<chartId> and ?file=<file.wav>`
    );
  }
  return { songId, chartId, file };
}
