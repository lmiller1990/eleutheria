import type { FunctionalComponent } from "vue";

export const SongTitle: FunctionalComponent<{ title: string }> = (props) => {
  return (
    <div class="bg-zinc-700 text-white text-2xl flex items-center justify-center p-3 border border-black">
      {props.title}
    </div>
  );
};
