import { OptionsModal } from "./OptionsModal";

const response = {
  data: {
    noteSkins: [
      {
        id: "1",
        name: "default",
        css: ".note {\n  height: var(--note-height);\n  border-radius: 12px;\n  box-sizing: border-box;\n  font-size: 2rem;\n  border: 1px solid #a8bdc7;\n  background: #a8bdc7;\n}\n\n.note-1, .note-4 {\n  background: #0a6ed6 !important;\n}",
        __typename: "NoteSkin",
      },
      {
        id: "2",
        name: "indigo",
        css: ".note {\n  border: 1px solid white;\n  transform: rotateY(180deg);\n  background-image: radial-gradient(95.74% 95.74% at 95.71% 2.13%, #ffffff 0%, #a115b8 100%);\n  height: var(--note-height);\n  box-sizing: border-box;\n}\n\n.note-1, .note-4 {\n  border: 1px solid white;\n  transform: rotateY(180deg);\n  background-image: radial-gradient(95.74% 95.74% at 95.71% 2.13%, rgb(255, 255, 255) 0%, rgb(84, 169, 65) 100%);\n  height: var(--note-height);\n  box-sizing: border-box;\n}",
        __typename: "NoteSkin",
      },
    ],
    covers: [
      {
        id: "1",
        name: "blackcat",
        thumbnailColor: "#d7eeba",
        css: "#lane-cover { \n  background: #d7eeba; \n  display: flex; \n  align-items: center; \n} \n\n#cover-image-blackcat { \n  max-height: 100%; \n}",
        code: 'const el = document.createElement("img"); el.id = "cover-image-blackcat"; el.src = "https://wallpaperaccess.com/full/1295637.png"; document.querySelector("#lane-cover").appendChild(el);',
        __typename: "Cover",
      },
      {
        id: "2",
        name: "beach",
        thumbnailColor: "#ecd995",
        css: "#lane-cover { \n  background: #ecd995; \n  display: flex; \n  align-items: center; \n  justify-content: flex-end; \n}\n\n#cover-image-beach {\n  max-height: 100%;\n}",
        code: 'const el = document.createElement("img"); el.id = "cover-image-beach"; el.src = "https://wallpapercave.com/wp/SvEhAQT.jpg"; document.querySelector("#lane-cover").appendChild(el);',
        __typename: "Cover",
      },
    ],
  },
};

describe("OptionsModal", () => {
  before(() => {
    cy.viewport(1000, 1000);
  });

  it("works", () => {
    cy.intercept("POST", "/graphql", {
      body: response,
    });
    cy.mount(() => <OptionsModal />);
  });
});
