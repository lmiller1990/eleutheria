import type { FunctionalComponent } from "vue";
import cs from "classnames";

export interface Timing {
  window: string;
  count: number;
}

export interface GameplayScoreProps {
  percent: number;
  classes?: {
    wrapper: string;
    percent: string;
  };
  timing: Timing[];
}

const TimingCount: FunctionalComponent<{ count: number }> = (props) => {
  const str = props.count.toString().padStart(4, "0");

  if (str === "0000") {
    return [
      <span class="text-stone-400 font-mono">0</span>,
      <span class="text-stone-400 font-mono">0</span>,
      <span class="text-stone-400 font-mono">0</span>,
      <span class="text-white font-mono">0</span>,
    ];
  }

  const strArr = str.split("");

  let foundNonZero = false;
  let jsx: JSX.Element[] = [];
  for (const char of strArr) {
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
    <div
      class={cs(
        "flex flex-col text-white uppercase",
        props.classes?.wrapper ?? "text-2xl"
      )}
    >
      <div
        class={cs(
          "flex justify-end font-mono",
          props.classes?.percent ?? "text-5xl"
        )}
      >
        {props.percent.toFixed(2)}%
      </div>
      {props.timing.map((timing) => (
        <div class="mt-8">
          <div
            class={`timing-${timing.window.toLowerCase()} flex justify-end no-animation`}
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
