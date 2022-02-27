export type Point = [number, number];

export function drawSvg(
  points: Point[],
  config: {
    colWidth: number;
    strokeWidth: number;
    yOffset: number;
    xOffset: number;
    fill: string;
    strokeColor: string;
  }
) {
  const svgNS = "http://www.w3.org/2000/svg";

  const svg = document.createElementNS(svgNS, "svg");

  function createNode(
    qualifiedName: string,
    attrs: Record<string, string | number>
  ) {
    const el = document.createElementNS(svgNS, qualifiedName);
    for (const [k, v] of Object.entries(attrs)) {
      el.setAttributeNS(null, k, v.toString());
    }
    return el;
  }

  const fill = points.reduce<Array<[number, number]>>((acc, curr) => {
    const x =
      curr[0] * config.colWidth + config.colWidth / 2 - config.strokeWidth;
    const y = curr[1] + config.colWidth / 2;
    return [...acc, [x, y]];
  }, []);

  const height = fill.at(-1)![1] - fill.at(0)![1];

  const allPoints = fill.map(([x, y]) => `${x},${y}`).join(" ");

  svg.setAttribute(
    "height",
    (height + config.colWidth - config.strokeWidth).toString()
  );
  svg.setAttribute(
    "width",
    (config.colWidth * 4 - config.colWidth / 4).toString()
  );

  const common = {
    "stroke-linejoin": "round",
    "stroke-linecap": "round",
    fill: "none",
  };

  svg.appendChild(
    createNode("polyline", {
      ...common,
      points: allPoints,
      stroke: config.strokeColor,
      "stroke-width": config.colWidth / 2,
    })
  );

  svg.appendChild(
    createNode("polyline", {
      ...common,
      points: allPoints,
      stroke: config.fill,
      "stroke-width": config.colWidth / 2 + config.strokeWidth,
    })
  );

  return svg;
}
