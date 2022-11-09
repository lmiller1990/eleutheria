import { createPinia, setActivePinia } from "pinia";
import { CyMountOptions, mount as _mount } from "cypress/vue";
import type { Pinia } from "pinia";
import "./commands";
import "@packages/game-data/styles/global.css";
import { createRouterMock } from 'vue-router-mock'
import "./style.css";
import "../../src/output.css";
import "../../src/style.css"
import { createClient } from "@urql/core";
import { defineComponent, h } from "vue";
import { provideClient } from "@urql/vue";

let pinia: Pinia;

beforeEach(() => {
  pinia = createPinia();
  setActivePinia(pinia);
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
      mount: typeof mount
      injectStylesheet: typeof injectStylesheet
    }
  }
}

Cypress.Commands.add("mount", mount);

Cypress.Commands.add('injectStylesheet', injectStylesheet)

function injectStylesheet (link: string) {
  if (document.getElementById(link)) {
    return
  }
  const $link = document.createElement('link')
  $link.rel = 'stylesheet'
  $link.id = link
  $link.href = link
  document.head.append($link)
}

export function mount(comp: any, options: CyMountOptions<any, any> = {}) {
  const { props, ... rest } = options

  const client = createClient({ url: 'http://localhost:5566/graphql' })
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

before(() => {
  cy.injectStylesheet(
    "https://fonts.googleapis.com/css2?family=Comfortaa:wght@700&display=swap"
  );
})