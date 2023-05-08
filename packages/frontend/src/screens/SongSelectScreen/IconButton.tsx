import { FunctionalComponent } from "vue";

export const IconButton: FunctionalComponent = (_props, { slots, attrs }) => {
  return (
    <button
      {...attrs}
      class="bg-zinc-700 flex p-1 items-center justify-center mb-2"
      style={`height: ${attrs.size ?? "35px"}; width: ${attrs.size ?? "35px"};`}
    >
      {slots.default?.()}
    </button>
  );
};
