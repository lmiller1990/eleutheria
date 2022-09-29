import type { FunctionalComponent } from "vue";

export interface Timing {
  window: string;
  count: number;
}

export interface GameplayScoreProps {
  percent: string;
  timing: Timing[];
}

const TimingCount: FunctionalComponent<{ count: number }> = (props) => {
  const str = props.count.toString().padStart(4, "0").split("");
  let foundNonZero = false;
  let jsx: JSX.Element[] = [];
  for (const char of str) {
    if (char !== "0") {
      foundNonZero = true;
    }
    jsx.push(
      <span
        class={`${foundNonZero ? "text-white" : "text-stone-400"} font-mono`}
      >
        {char}
      </span>
    );
  }
  return jsx;
};

export const GameplayScore: FunctionalComponent<GameplayScoreProps> = (
  props
) => {
  return (
    <div class="flex flex-col text-white text-2xl uppercase">
      <div class="flex justify-end font-mono text-5xl">{props.percent}</div>
      {props.timing.map((timing) => (
        <div class="mt-5">
          <div
            class={`timing-${timing.window.toLowerCase()} flex justify-end`}
            key={timing.window}
          >
            {timing.window}
          </div>
          <div class="flex justify-end">
            <TimingCount count={timing.count} />
          </div>
        </div>
      ))}
    </div>
  );
};
