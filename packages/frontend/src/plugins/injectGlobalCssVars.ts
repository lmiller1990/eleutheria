import { NoteSkin } from "@packages/shared";

export const stylesheetInjectionKeys = {
  coverCss: "__COVER_CSS__",
  modsPaneOverrides: "__OVERRIDES__",
  noteSkin: "__NOTE_SKIN__",
  targetLine: "__TARGET_LINE__",
} as const;

export function removeAllInjectedStylesheets() {
  for (const id of Object.values(stylesheetInjectionKeys)) {
    document.getElementById(id)?.remove();
  }
}

export function injectStylesheet(style: string, id: string) {
  let el = document.querySelector<HTMLStyleElement>(`#${id}`);
  el?.remove();
  el = document.createElement("style");
  el.id = id;
  el.innerText = style;
  document.head.insertAdjacentElement("beforeend", el);
  return () => {
    el?.remove();
  };
}

export function injectNoteSkin(skin: NoteSkin) {
  return injectStylesheet(skin.css, stylesheetInjectionKeys.noteSkin);
}
