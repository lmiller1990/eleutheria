import { ref } from "vue";
import { GameplayLoading } from "./GameplayLoading";

it("renders", () => {
  cy.viewport(1000, 600);
  const percent = ref(0);

  cy.mount(() => (
    <GameplayLoading
      percent={percent.value}
      song={{
        title: "Abyss Breaker",
        artist: "D-D-Dice",
        file: "abyss_breaker",
      }}
      personalBest="95.56%"
    />
  ));

  let i = 0;

  let j = window.setInterval(() => {
    if (i === 10) {
      window.clearInterval(j);
      return;
    }
    i++;
    percent.value = i * 10;
  }, 100);
});
