// @ts-ignore - API is here: https://github.com/reworkcss/css
import css from "css";

interface Declaration {
  // there are other properties, but these are the ones we use
  property: string; // eg "height"
  type: "declaration";
  value: string; // eg "var(--note-height)";
}

interface Rule {
  selectors: string[]; // eg [".note"]
  declarations: Declaration[];
}

interface CSSParserAST {
  stylesheet: {
    rules: Rule[];
  };
}

/**
 * Example:
 *
 * getStyleByClass(`.note { background: red; }`, '.note') //=> returns { background: red; }
 */
export function getStyleByClass(style: string, selector: string) {
  const ast: CSSParserAST = css.parse(style);
  const rules = ast.stylesheet.rules.find((x) =>
    x.selectors.includes(selector)
  );

  return (rules?.declarations ?? [])
    .map((rule) => `${rule.property}: ${rule.value};`)
    .join("\n");
}
