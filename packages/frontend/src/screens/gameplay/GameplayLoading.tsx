import type { FunctionalComponent } from "vue";
import NonGameplayScreen from "../../components/NonGameplayScreen";
import { SongImage } from "../SongSelectScreen/SongImage";

interface GameplayLoadingProps {
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
    <NonGameplayScreen screenTitle="Eleutheria">
      <div class="flex justify-center w-full mb-16">
        <div class="flex flex-col max-w-xs items-center">
          <h2 class="text-4xl text-white">{props.song.title}</h2>
          <h3 class="text-stone-300 text-2xl my-2">{props.song.artist}</h3>
          <SongImage file={props.song.file} />
          <div class="text-2xl text-white font-light my-2">
            Your Record {props.personalBest}
          </div>
          <div class="w-full border border-zinc-700 h-10 border-4 p-1">
            <div
              class="bg-zinc-700 h-full"
              style={{ width: `${props.percent}%` }}
            />
          </div>
        </div>
      </div>
    </NonGameplayScreen>
  );
};
