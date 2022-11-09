import { FunctionalComponent, onMounted } from "vue";
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

function easeOutCubic(start: number, end: number): number {
  return start - Math.pow(start - end, 3);
}

export function tweenTo(from: number, to: number, start:number, durationMs: number, el: HTMLElement) {
  // 0 -> 1000 over 200ms
  // 0, 200, 400, 600, 800, 1000
  // constantly rAF and take the diff, increment number to 
  // make it up
  const end = start + durationMs
  
  let now: number
  if ((now = performance.now()) < end) {
    // const d1 = now - start
    // const d2 = end - now
    // const diff = d1 / (d1 + d2)
    // https://easings.net/#easeOutCubic
    // const n = (100 - (to * diff))
    // Below you see the code of this easing function written in TypeScript. 
    // The variable x represents the absolute progress of the animation in the bounds of 0 
    // (beginning of the animation) and 1 (end of animation).
    // function easeOutCubic(x: number): number {
    //   return 1 - Math.pow(1 - x, 3);
    // }
    // console.log({n})
    const n = 1 - Math.pow(1 - (end - now), 3)

    console.log({ n})
    // el.innerText = `${(to * diff).toFixed(2)}%`
    // el.innerText = `${c.toFixed(2)}%`
    setTimeout(() => {
      tweenTo(from, to, start, durationMs, el)
    }, 50)
  } else {
    el.innerText = `${to.toFixed(2)}%`
  }
}

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
};
