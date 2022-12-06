import { FunctionalComponent } from "vue";

export const IconButton: FunctionalComponent = (_props, { slots, attrs }) => {
  return (
    <button
      {...attrs}
      class="bg-zinc-700 flex p-1 items-center justify-center mb-2"
      style="height: 35px; width: 35px;"
    >
      {slots.default?.()}
    </button>
  );
};
