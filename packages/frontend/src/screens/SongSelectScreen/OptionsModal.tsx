import type { NoteSkin } from "@packages/shared";
import { defineComponent, FunctionalComponent, reactive, ref } from "vue";
import { useGameplayOptions } from "../../composables/gameplayOptions";
import { CoverParams } from "../gameplay/modiferManager";
// import { getStyleByClass } from "../../components/ModifierPanel/css";
import { ScrollDirection } from "../gameplay/types";

function extractCss(style: string) {
  // return getStyleByClass(style, ".note");
}
// <div
//   v-for="note of notes"
//   :style="extractCss(note.css)"
//   class="note-mod"
//   :id="`note-${note.name}`"
//   @click="emit('changeNoteSkin', note)"
// />

// const NoteModPanel = defineComponent<{ notes: NoteSkin[] }>({
//   setup(props) {
//     const currentValue = ref<NoteSkin>(props.notes[0]);

//     function onClick(value: NoteSkin) {
//       currentValue.value = value
//     }

//     return () => (
//       <OptionsPanel title="Note" selected={currentValue.value}>
//         <div class="flex">
//           {props.notes.map((x) => (
//             <button
//               class="bg-zinc-700 border border-bg-black text-white py-1 w-16 mr-2"
//               style={extractCss(note.css)}
//               onClick={() => onClick(x)}
//             >
//               Note
//             </button>
//           ))}
//         </div>
//       </OptionsPanel>
//     );
//   },
// });

const ScrollModPanel: FunctionalComponent<{
  modValue: OptionsModalProps["currentScrollMod"];
  onChangeMod: OptionsModalProps["onChangeScrollMod"];
}> = (props) => {
  function onClick(direction: ScrollDirection) {
    props.onChangeMod(direction);
  }

  return (
    <OptionsPanel title="Scroll" selected={props.modValue.toUpperCase()}>
      <div class="flex">
        {(["up", "down"] as const).map((dir) => (
          <button
            class="bg-zinc-700 border border-bg-black text-white py-1 w-16 mr-2"
            onClick={() => onClick(dir)}
          >
            {dir}
          </button>
        ))}
      </div>
    </OptionsPanel>
  );
};

const CoverOffsetModPanel: FunctionalComponent<{
  onChangeMod: OptionsModalProps["onChangeCoverMod"];
  modValue: OptionsModalProps["currentCover"];
  id: string;
}> = (props) => {
  const options = Array(101)
    .fill(undefined)
    .reduce<JSX.Element[]>((acc, _curr, idx) => {
      const value = idx;
      if (value % 10 === 0) {
        return acc.concat(
          <option value={value} label={`${value}%`} key={value} />
        );
      }
      return acc;
    }, []);

  function input(event: Event) {
    const value = parseInt((event.target as HTMLInputElement).value, 10);
    props.onChangeMod({ offset: value });
  }

  return (
    <OptionsPanel title="Cover" selected={`${props.modValue.offset}%`}>
      <Slider
        options={options}
        max={100}
        step={1}
        id="cover-offset"
        onInput={input}
      />
    </OptionsPanel>
  );
};

const Slider: FunctionalComponent<{
  onInput: (event: Event) => void;
  id: string;
  options: JSX.Element[];
  step: number;
  max: number;
}> = (props) => {
  return (
    <>
      <input
        min={0}
        max={props.max}
        step={props.step}
        type="range"
        id={props.id}
        list={`${props.id}-tickmarks`}
        name={props.id}
        class="w-full"
        onInput={props.onInput}
      />
      <datalist
        id={`${props.id}-tickmarks`}
        class="flex justify-between w-full text-xs"
      >
        {props.options}
      </datalist>
    </>
  );
};

const SpeedModPanel: FunctionalComponent<{
  onChangeMod: OptionsModalProps["onChangeSpeedMod"];
  modValue: OptionsModalProps["currentSpeedMod"];
  id: string;
}> = (props) => {
  const options = Array(101)
    .fill(undefined)
    .reduce<JSX.Element[]>((acc, _curr, idx) => {
      const value = idx * 10;
      if (value % 100 === 0) {
        return acc.concat(
          <option value={value} label={value.toString()} key={value} />
        );
      }
      return acc;
    }, []);

  function input(event: Event) {
    const value = parseInt((event.target as HTMLInputElement).value, 10);
    props.onChangeMod(value);
  }

  return (
    <OptionsPanel title="Speed" selected={props.modValue}>
      <Slider
        options={options}
        max={1000}
        step={10}
        id="speed-mod"
        onInput={input}
      />
    </OptionsPanel>
  );
};

const OptionsPanel: FunctionalComponent<{
  title: string;
  selected: string | number;
}> = (props, { slots }) => {
  return (
    <div class="w-full text-white text-lg p-4 bg-neutral-600 my-6">
      <div class="flex justify-between w-full my-1">
        <div>{props.title}</div>
        <div>{props.selected}</div>
      </div>
      <div>{slots.default?.()}</div>
    </div>
  );
};

interface OptionsModalProps {
  currentScrollMod: ScrollDirection;
  currentSpeedMod: number;
  currentCover: CoverParams;
  onChangeSpeedMod: (val: number) => void;
  onChangeScrollMod: (val: ScrollDirection) => void;
  onChangeCoverMod: (cover: Partial<CoverParams>) => void;
}

export const OptionsModal: FunctionalComponent<OptionsModalProps> = (props) => {
  return (
    <div style={{ background: "#828282" }}>
      <SpeedModPanel
        onChangeMod={props.onChangeSpeedMod}
        modValue={props.currentSpeedMod}
        id="speed-mod"
      />
      <ScrollModPanel
        onChangeMod={props.onChangeScrollMod}
        modValue={props.currentScrollMod}
      />
      <CoverOffsetModPanel
        onChangeMod={props.onChangeCoverMod}
        modValue={props.currentCover}
        id="cover-offset"
      />
      {/* <NoteModPanel /> */}
    </div>
  );
};

export const OptionsModalWrapper = defineComponent({
  setup() {
    const modifiers = useGameplayOptions();

    const localMods = reactive({
      speed: modifiers.modifierManager.multiplier,
      scroll: modifiers.modifierManager.scrollDirection,
      cover: modifiers.modifierManager.cover,
    });

    modifiers.modifierManager.on("set:multiplier", (val) => {
      localMods.speed = val;
    });

    modifiers.modifierManager.on("set:scrollDirection", (val) => {
      localMods.scroll = val;
    });

    modifiers.modifierManager.on("set:cover", (val, oldVal) => {
      localMods.cover = { ...oldVal, ...val };
    });

    return () => (
      <OptionsModal
        currentCover={localMods.cover}
        currentSpeedMod={localMods.speed}
        currentScrollMod={localMods.scroll}
        onChangeSpeedMod={modifiers.handleChangeSpeedMod}
        onChangeScrollMod={modifiers.handleChangeScrollMod}
        onChangeCoverMod={modifiers.handleChangeCoverMod}
      />
    );
  },
});
