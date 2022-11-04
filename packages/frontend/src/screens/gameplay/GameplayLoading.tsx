import type { FunctionalComponent } from "vue";
import { SongImage } from "../SongSelectScreen/SongImage";
import "./gameplay-loading.css";

interface GameplayLoadingProps {
  class?: string;
  percent: number;
  song: {
    file: string;
    title: string;
    artist: string;
  };
  personalBest: string;
}

export const GameplayLoading: FunctionalComponent<GameplayLoadingProps> = (
  props
) => {
  return (
    <div
      class={`w-full h-full flex items-center bg-zinc-500 absolute top-0 left-0 ${
        props.class ?? ""
      }`}
    >
      <div class="flex justify-center w-full mb-16">
        <div class="flex flex-col max-w-xs items-center fade-in">
          <h2 class="text-4xl text-white">{props.song.title}</h2>
          <h3 class="text-stone-300 text-2xl my-2">{props.song.artist}</h3>
          <div class="fade-in">
            <SongImage file={props.song.file} />
          </div>
          <div class="text-2xl text-white font-light my-2">
            Your Record: {props.personalBest}
          </div>
          <div class="w-full border border-zinc-700 h-10 border-4 p-1">
            <div
              class="bg-zinc-700 h-full"
              style={{ width: `${props.percent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
