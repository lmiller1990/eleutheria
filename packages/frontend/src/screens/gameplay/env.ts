export function getGameDataUrl(suffix: string) {
  return `${import.meta.env.VITE_GAME_DATA_URL}${suffix}`;
}
