import { FunctionalComponent } from "vue";

interface Props {
  level?: number;
  file: string;
}

export const SongImage: FunctionalComponent<Props> = (props) => {
  const file = `${import.meta.env.VITE_CDN_URL}/${props.file}.png`;
  const stars = `${import.meta.env.VITE_CDN_URL}/stars.svg`;

  return (
    <div class="relative">
      <img
        class="border border-2 border-white mb-2 "
        src={file}
        style={`background-image: url(${stars})`}
      />
      {props.level && (
        <div class="bg-zinc-700 text-white absolute top-2 right-2 h-10 w-10 text-xl font-mono flex items-center justify-center">
          {props.level.toString().padStart(2, "0")}
        </div>
      )}
    </div>
  );
};
