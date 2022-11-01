import type { FunctionalComponent } from "vue";

export const GameplayLoading: FunctionalComponent<{ percent: number }> = (
  props
) => {
  return <div>{props.percent}%</div>;
};
