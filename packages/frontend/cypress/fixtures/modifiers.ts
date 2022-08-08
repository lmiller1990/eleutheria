import { NoteSkin } from "@packages/types";
import dedent from "dedent";

const dim = dedent`
  height: 35px;
  width: 47px;
`;

const blueNote = dedent`
  .note {
    ${dim}
    border: 2px solid white;
    border-radius: 13px;
    background: #0A6ED6;
  }
`;

const skyNote = dedent`
  .note {
      ${dim}
      border: 2px solid white;
      border-radius: 6px;
      background: #0A6ED6;
      background: linear-gradient(90deg, #0A6ED6 0%, #97CAFF 34.9%, #0A6ED6 100%);
    }
`;

const indigoNote = dedent`
  .note {
    ${dim}
    border: 1px solid white;
    transform: rotateY(180deg);
    background-image: radial-gradient(95.74% 95.74% at 95.71% 2.13%, #FFFFFF 0%, #A115B8 100%); 
  }
`;

const limeNote = dedent`
  .note {
    ${dim}
    border: 2px solid white;
      border-radius: 5px;
      height: 20px;
      background: linear-gradient(194.57deg, #00EB26 10.32%, #A6FFF4 50%, #00F361 89.68%);
      border: 1px solid #FFFFFF;
      border-radius: 21px;
    }
`;

export const noteSkins: NoteSkin[] = [
  {
    name: "default",
    css: blueNote,
  },
  {
    name: "indigo",
    css: indigoNote,
  },
  {
    name: "sky",
    css: skyNote,
  },
  {
    name: "lime",
    css: limeNote,
  },
];
