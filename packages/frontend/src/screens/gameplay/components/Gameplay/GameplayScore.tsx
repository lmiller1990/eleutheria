import { defineComponent, FunctionalComponent, Ref, ref } from "vue";
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

export function tweenTo(
  durationMs: number,
  endNum: number,
  cb: (num: string) => void
) {
  /**
   * start = performance.now() //=> say 50000
   * end = 51000
   *
   * t=50600
   * end - t = 400
   * (1000-400)/1000 = 600/1000 = 60/100 = 0.6
   * easeOutCubic -> 1 - Math.pow(1 - 0.6, 3) //=> 0.935
   */

  const start = performance.now();
  const end = start + durationMs;

  const update = () => {
    const now = window.performance.now();
    if (now > end) {
      cb(`${endNum.toFixed(2)}%`);
      return;
    }
    const diff = end - now;
    const percent = (durationMs - diff) / durationMs;
    // https://easings.net/#easeOutCubic
    const cubic = 1 - Math.pow(1 - percent, 3);
    const n = (endNum * cubic).toFixed(2);
    cb(`${n}%`);
    // el.innerText = `${n}%`;
    window.requestAnimationFrame(update);
  };

  update();
}

function useCubicEasing(duration: number, to: number): Ref<string> {
  const percent = ref("00.00%");
  tweenTo(duration, to, (val) => {
    percent.value = val;
  });
  return percent;
}

export const GameplayScore = defineComponent<GameplayScoreProps>({
  setup(props) {
    const percent = useCubicEasing(1500, props.percent);
    return () => (
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
          {percent.value}
        </div>
        {props.timing.map((timing) => (
          <div class="mt-8">
            <div id="foo" />
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
  },
});
