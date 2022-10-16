import { FunctionalComponent } from "vue";

interface Props {
  level?: number;
  src: string;
}

export const SongImage: FunctionalComponent<Props> = (props) => {
  return (
    <div class="relative">
      <img class="border border-2 border-white mb-2" src={props.src} />
      {props.level && (
        <div class="bg-zinc-700 text-white absolute top-2 right-2 h-10 w-10 text-xl font-mono flex items-center justify-center">
          {props.level.toString().padStart(2, "0")}
        </div>
      )}
    </div>
  );
};
