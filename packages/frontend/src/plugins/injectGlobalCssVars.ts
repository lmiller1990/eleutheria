import { NoteSkin } from "@packages/types/src";

export function injectStylesheet(style: string, id: string) {
  let el = document.querySelector<HTMLStyleElement>(`#${id}`);
  el?.remove();
  el = document.createElement("style");
  el.id = id;
  el.innerText = style;
  document.head.insertAdjacentElement("beforeend", el);
}

const noteSkinStyleId = "__NOTE_SKIN__";

export function injectNoteSkin(skin: NoteSkin) {
  return injectStylesheet(skin.css, noteSkinStyleId);
}
