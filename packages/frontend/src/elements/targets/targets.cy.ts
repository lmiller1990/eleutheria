import { ROOT_ID, injectStylesBeforeElement } from "@cypress/mount-utils";
import { $createTargets } from ".";

export function render<T extends HTMLElement>(el: T) {
  const $root = document.querySelector<HTMLDivElement>(`#${ROOT_ID}`)!;
  $root.innerHTML = ``;
  $root.style.display = 'relative'
  $root.appendChild(el);
  return $root
}

it('works', () => {
  const $root = render($createTargets())

  injectStylesBeforeElement({
    style: `
      body {
        background: black;
      }
    `
  }, document, $root)

})
