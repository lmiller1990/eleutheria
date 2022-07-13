import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    setupNodeEvents(on) {
      on("task", {
        foo: () => {
          console.log(`Foo is ${process.env.CYPRESS_MY_FOO}`);
          return null;
        },
      });
    },

    devServer: {
      framework: "vue",
      bundler: "vite",
    },
  },
});
