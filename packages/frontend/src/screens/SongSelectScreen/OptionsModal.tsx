import type { Cover, NoteSkin } from "@packages/shared";
import { defineComponent, FunctionalComponent, reactive, ref, Ref } from "vue";
import { useGameplayOptions } from "../../composables/gameplayOptions";
import { CoverParams } from "../gameplay/modiferManager";
import { ScrollDirection } from "../gameplay/types";
import { injectNoteSkin } from "../../plugins/injectGlobalCssVars";
import { getStyleByClass } from "./css";
import dedent from "dedent";
import { OptionsModalQuery } from "../../generated/graphql";

function extractCss(style: string) {
  return getStyleByClass(style, ".note");
}

const noteStyle = dedent`
  height: 30px;
  width: 50px;
`;

const CoverSkinModPanel: FunctionalComponent<{
  covers: OptionsModalProps["covers"];
  onChangeMod: OptionsModalProps["onChangeCoverMod"];
}> = (props) => {
  return (
    <OptionsPanel title="Cover Style" selected={""}>
      <div class="flex">
        {props.covers.map((x) => {
          return (
            <div class="flex flex-col items-center mr-2">
              <button
                class="h-6 w-10 border border-white"
                onClick={() => props.onChangeMod(x)}
                style={{ background: x.thumbnailColor }}
              />
              <label class="text-xs mt-1 font-light">{x.name}</label>
            </div>
          );
        })}
      </div>
    </OptionsPanel>
  );
};

const NoteSkinModPanel: FunctionalComponent<{
  noteSkins: OptionsModalProps["noteSkins"];
  modValue: OptionsModalProps["currentNoteSkin"];
  onChangeMod: OptionsModalProps["onChangeNoteSkin"];
}> = (props) => {
  return (
    <OptionsPanel title="Note" selected={""}>
      <div class="flex">
        {props.noteSkins.map((x) => {
          const style = extractCss(x.css) + noteStyle;
          return (
            <div class="flex flex-col items-center mr-2">
              <button style={style} onClick={() => props.onChangeMod(x)} />
              <label class="text-xs mt-1 font-light">{x.name}</label>
            </div>
          );
        })}
      </div>
    </OptionsPanel>
  );
};

const ScrollModPanel: FunctionalComponent<{
  modValue: OptionsModalProps["currentScrollMod"];
  onChangeMod: OptionsModalProps["onChangeScrollMod"];
}> = (props) => {
  function onClick(event: Event, direction: ScrollDirection) {
    event.preventDefault();
    props.onChangeMod(direction);
  }

  return (
    <OptionsPanel title="Scroll" selected={props.modValue.toUpperCase()}>
      <div class="flex">
        {(["up", "down"] as const).map((dir) => (
          <button
            class="bg-zinc-700 text-sm border border-bg-black text-white py-1 w-14 mr-2"
            onClick={(event) => onClick(event, dir)}
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
    <OptionsPanel title="Cover Height" selected={`${props.modValue.offset}%`}>
      <Slider
        options={options}
        max={100}
        value={props.modValue.offset}
        step={5}
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
  min?: number;
  value: number;
}> = (props) => {
  return (
    <>
      <input
        min={0}
        list={`${props.id}-tickmarks`}
        name={props.id}
        type="range"
        class="w-full"
        {...props}
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
        value={props.modValue}
        max={1000}
        step={10}
        id="speed-mod"
        onInput={input}
      />
    </OptionsPanel>
  );
};

const GlobalOffsetPanel: FunctionalComponent<{
  onChangeMod: OptionsModalProps["onChangeGlobalOffset"];
  modValue: OptionsModalProps["globalOffset"];
  id: string;
}> = (props) => {
  const options = Array(2001)
    .fill(undefined)
    .reduce<JSX.Element[]>((acc, _curr, idx) => {
      const value = idx - 1000;
      if (value % 200 === 0) {
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
    <OptionsPanel title="Global Offset" selected={`${props.modValue} ms`}>
      <Slider
        options={options}
        value={props.modValue}
        max={1000}
        min={-1000}
        step={1}
        id="global-offset-mod"
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
    <div class="w-full text-white text-lg p-2 bg-neutral-600 mt-2 border border-black">
      <div class="flex justify-between w-full my-1">
        <div>{props.title}</div>
        <div>{props.selected}</div>
      </div>
      <div>{slots.default?.()}</div>
    </div>
  );
};

interface OptionsModalProps {
  gameplayRoot: Ref<HTMLDivElement | undefined>;

  currentSpeedMod: number;
  onChangeSpeedMod: (val: number) => void;

  currentScrollMod: ScrollDirection;
  onChangeScrollMod: (val: ScrollDirection) => void;

  globalOffset: number;
  onChangeGlobalOffset: (val: number) => void;

  currentCover: CoverParams;
  onChangeCoverMod: (cover: Partial<CoverParams>) => void;

  noteSkins: NoteSkin[];
  currentNoteSkin: NoteSkin;
  onChangeNoteSkin: (val: NoteSkin) => void;

  covers: Cover[];
}

const Col: FunctionalComponent = (_props, { slots }) => (
  <div class="h-full flex flex-col justify-center mx-10">
    {slots.default?.()}
  </div>
);

export const OptionsPane: FunctionalComponent<OptionsModalProps> = (props) => {
  function stopPropagation(e: Event) {
    e.stopPropagation();
  }

  const coverImage = /(https:.*?\.(png|jpg))/.exec(props.currentCover?.code);

  return (
    <div onClick={stopPropagation} class="flex">
      <Col>
        <h2 class="text-2xl text-white mb-4">Options</h2>
        <SpeedModPanel
          onChangeMod={props.onChangeSpeedMod}
          modValue={props.currentSpeedMod}
        />
        <GlobalOffsetPanel
          onChangeMod={props.onChangeGlobalOffset}
          modValue={props.globalOffset}
          id="global-offset-mod"
        />
        <ScrollModPanel
          onChangeMod={props.onChangeScrollMod}
          modValue={props.currentScrollMod}
        />
        <NoteSkinModPanel
          noteSkins={props.noteSkins}
          onChangeMod={props.onChangeNoteSkin}
          modValue={props.currentNoteSkin}
        />
        <CoverOffsetModPanel
          onChangeMod={props.onChangeCoverMod}
          modValue={props.currentCover}
          id="cover-offset"
        />
        <CoverSkinModPanel
          covers={props.covers}
          onChangeMod={props.onChangeCoverMod}
        />
        {coverImage?.[1] && (
          <div
            class="flex bg-cover h-[150px] w-full bg-center border-t-4 border-t-zinc-700 border-black border mt-2"
            style={{ backgroundImage: `url("${coverImage[1]}")` }}
            id="blah"
          />
        )}
      </Col>
    </div>
  );
};

export const OptionsModalWrapper = defineComponent({
  props: {
    gql: {
      type: Object as () => OptionsModalQuery,
      required: true,
    },
  },

  setup(props) {
    const modifiers = useGameplayOptions();
    const gameplayRoot = ref(undefined);

    const onChangeNoteSkin = (noteSkin: NoteSkin) => {
      injectNoteSkin(noteSkin);
      modifiers.handleChangeNoteSkin(noteSkin);
    };

    const localMods = reactive({
      speed: modifiers.modifierManager.multiplier,
      scroll: modifiers.modifierManager.scrollDirection,
      cover: modifiers.modifierManager.cover,
      noteSkin: modifiers.modifierManager.noteSkin,
      globalOffset: modifiers.modifierManager.globalOffset,
    });

    modifiers.modifierManager.on("set:globalOffset", (val) => {
      localMods.globalOffset = val;
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

    modifiers.modifierManager.on("set:noteSkin", (val) => {
      localMods.noteSkin = val;
    });

    const defaultNoteSkin = props.gql.noteSkins.find(
      (x) => x.name === "default"
    );

    if (!defaultNoteSkin) {
      throw Error(
        `Default note skin not found. This should not happen. Note skins are ${props.gql.noteSkins}`
      );
    }

    return () => (
      <OptionsPane
        gameplayRoot={gameplayRoot}
        currentCover={localMods.cover}
        currentSpeedMod={localMods.speed}
        currentScrollMod={localMods.scroll}
        globalOffset={localMods.globalOffset}
        onChangeGlobalOffset={modifiers.handleChangeGlobalOffset}
        onChangeSpeedMod={modifiers.handleChangeSpeedMod}
        onChangeScrollMod={modifiers.handleChangeScrollMod}
        onChangeCoverMod={modifiers.handleChangeCoverMod}
        noteSkins={props.gql.noteSkins ?? []}
        covers={props.gql.covers ?? []}
        currentNoteSkin={localMods.noteSkin}
        onChangeNoteSkin={onChangeNoteSkin}
      />
    );
  },
});
