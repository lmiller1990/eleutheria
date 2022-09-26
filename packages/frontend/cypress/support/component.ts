import { createPinia, setActivePinia } from "pinia";
import { mount as _mount } from "cypress/vue";
import type { Pinia } from "pinia";
import "./commands";
import "@packages/game-data/styles/global.css";
import { useSongsStore } from "../../src/stores/songs";
import { testSong } from "../fixtures/songs";
import { createRouterMock } from 'vue-router-mock'
import "./style.css";
import "../../src/output.css";
import { createClient } from "@urql/core";
import { defineComponent, h } from "vue";
import { provideClient } from "@urql/vue";
import { MountingOptions } from "cypress/vue/dist/@vue/test-utils";

let pinia: Pinia;

beforeEach(() => {
  pinia = createPinia();
  setActivePinia(pinia);
  const songsStore = useSongsStore();
  songsStore.$patch((state) => {
    state.selectedSongId = Number(testSong.id);
    state.selectedChartIdx = 0;
  });
});

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
declare global {
  interface Window {
    manualTick: (ms: number) => void
  }

  namespace Cypress {
    interface Chainable {
      mount: typeof _mount;
    }
  }
}

Cypress.Commands.add("mount", mount);

export function mount(comp: any, { props, ...rest }: MountingOptions<any> = {}) {
  const client = createClient({ url: 'http://' })
  const Parent = defineComponent({
    setup () {
      provideClient(client)
      return () => h(comp, { ...props })
    }
  })
  return _mount(Parent, {
    ...rest,
    global: {
      plugins: [pinia, createRouterMock({ 
        spy: {
          create: cy.spy,
          reset: () => {}
        }
      })]
    }
  });
}