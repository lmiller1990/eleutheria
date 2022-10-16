import { FunctionalComponent } from "vue";

interface SongInfoProps {
  best: string;
  notes: number;
  duration: string;
  bpm: number;
}

const Info: FunctionalComponent<{ title: string; datum: string | number }> = (
  props
) => {
  return (
    <div class="mb-4 flex flex-col items-end">
      <div class="text-black text-2xl uppercase font-bold">{props.title}</div>
      <div class="text-white text-4xl font-mono">{props.datum}</div>
    </div>
  );
};

export const SongInfo: FunctionalComponent<SongInfoProps> = (props) => {
  return (
    <>
      <Info title="Best" datum={props.best} />
      <Info title="Notes" datum={props.notes} />
      <Info title="Duration" datum={props.duration} />
      <Info title="BPM" datum={props.bpm} />
    </>
  );
};
