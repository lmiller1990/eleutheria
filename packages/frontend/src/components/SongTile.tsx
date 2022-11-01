import type { FunctionalComponent } from "vue";

export interface Props {
  file: string;
  songTitle: string;
  artist: string;
  selected: boolean;
}

export const SongTile: FunctionalComponent<Props> = (props) => {
  const className = props.selected ? "border-white" : "border-black";
  return (
    <button
      class={`w-full bg-zinc-700 ${className} border-2 h-20 flex items-center justify-between`}
    >
      <img
        class="h-full"
        src={`${import.meta.env.VITE_CDN_URL}/${props.file}.png`}
      />
      <div class="flex flex-col items-end p-2">
        <div class="text-white text-2xl">{props.songTitle}</div>
        <div class="text-gray-300 text-xl">{props.artist}</div>
      </div>
    </button>
  );
};
