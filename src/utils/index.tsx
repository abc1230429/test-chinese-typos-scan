import { distance } from "fastest-levenshtein";
import { entries } from "lodash";
import { pinyin } from "./pinyin";
import { defaultThreshold } from "src/constants";

export const chineseFuzzyEqual = (
  a: string | string[][],
  b: string | string[][],
  threshold = defaultThreshold,
) => {
  const as = typeof a === "string" ? pinyin(a) : a;
  const bs = typeof b === "string" ? pinyin(b) : b;
  const allRatio = as.flatMap((v) =>
    bs.map((u) => {
      const vs = v.join(" ");
      const us = u.join(" ");
      const d = distance(vs, us);
      const ratio = d / Math.min(vs.length, us.length);
      return ratio;
    }),
  );
  const minRatio = Math.min(...allRatio);
  return minRatio <= threshold;
};

export const wrapHtmlString = (
  str: string,
  type: string,
  attribute: { [key: string]: string },
) => {
  const attributeStr = entries(attribute)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");
  return `<${type} ${attributeStr}>${str}</${type}>`;
};

export const highlightTypoCharJsx = (typoStr: string, refStr: string) => {
  const typoJsx = typoStr.split("").map((c, i) => (
    <span key={c + i} className={c !== refStr[i] ? "text-error" : ""}>
      {c}
    </span>
  ));
  return typoJsx;
};
