export const toHumanTime = (s: number) => {
  const min = Math.floor(s / 60);
  const sec = s % 60;
  return `${min}:${sec.toFixed(0)}`;
};
