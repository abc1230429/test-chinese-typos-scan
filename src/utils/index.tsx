import { distance } from "fastest-levenshtein";
import { entries } from "lodash";
import { pinyin } from "./pinyin";
import { defaultThreshold } from "src/constants";

export const chineseFuzzyEqual = (
  a: string,
  b: string,
  threshold = defaultThreshold,
) => {
  const as = pinyin(a);
  const bs = pinyin(b);
  for (const v of as) {
    for (const u of bs) {
      const vs = v.join(" ");
      const us = u.join(" ");
      const d = distance(vs, us);
      const ratio = d / vs.length;
      if (ratio <= threshold) return true;
    }
  }
  return false;
};

export const createFuzzyEqualTo = (a: string) => {
  const as = pinyin(a);
  const aAll = as.map((v) => v.join(" "));
  return (b: string, threshold = defaultThreshold) => {
    const bs = pinyin(b);
    for (const v of aAll) {
      for (const u of bs) {
        const us = u.join(" ");
        const d = distance(v, us);
        const ratio = d / v.length;
        if (ratio <= threshold) return true;
      }
    }
    return false;
  };
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
