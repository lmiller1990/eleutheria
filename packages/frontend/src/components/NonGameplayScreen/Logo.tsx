import type { FunctionalComponent } from "vue";

export const Logo: FunctionalComponent = () => {
  return (
    <div
      class="rounded-full border border-gray-300 h-10 w-10 flex items-center justify-center"
      style="border: 3px solid"
    >
      <span class="mb-4 klee-one" style="font-size: 40px">
        {" "}
        ε{" "}
      </span>
    </div>
  );
};
