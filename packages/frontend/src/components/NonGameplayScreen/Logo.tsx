import type { FunctionalComponent } from "vue";

export const Logo: FunctionalComponent = () => {
  const src = `${import.meta.env.VITE_CDN_URL}/eleutheria.png`;
  return <img src={src} class="h-full p-2" />;
};
