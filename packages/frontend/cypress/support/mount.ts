import { mount as _mount } from "cypress/vue";
import type { Router } from "vue-router";
import { createPinia, setActivePinia } from "pinia";
import type { Pinia } from "pinia";
import { createRouter } from "../../src/router";

let pinia: Pinia;
let router: Router;

beforeEach(() => {
  pinia = createPinia();
  router = createRouter();
  setActivePinia(pinia);
});

export function mount(
  component: any, // Parameters<typeof _mount>[0],
  args: Parameters<typeof _mount>[1]
) {
  return _mount(component, {
    ...args,
    global: {
      ...args?.global,
      plugins: [pinia, router],
    },
  });
}
