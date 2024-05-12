import { escape, every } from "lodash";
import { chineseFuzzyEqual } from "src/utils";
import { Typo } from "./Article";
import { pinyin } from "src/utils/pinyin";

export const findTyposOfArticle = (article: string, refWord: string) => {
  const wLen = refWord.length;
  const typos: Typo[] = [];
  const refWordDict = refWord
    .split("")
    .reduce<{ [key: string]: boolean }>((acc, curr) => {
      acc[curr] = true;
      return acc;
    }, {});
  const refWordPinyin = pinyin(refWord);

  for (let i = 0; i <= article.length - wLen + 2; i++) {
    const compareWord = article.slice(i, i + wLen);
    if (compareWord === refWord) {
      i += wLen - 1;
      continue;
    }

    const isValid = !compareWord.includes("\n");
    const isWrongOrder =
      isValid && wLen >= 3 && every(compareWord, (c) => refWordDict[c]);
    const isFuzzyEqual =
      isValid && chineseFuzzyEqual(compareWord, refWordPinyin);
    if (isWrongOrder || isFuzzyEqual) {
      const id = `typo-${i}`;
      const cleanCompareWord = escape(compareWord);
      typos.push({ index: i, word: cleanCompareWord, id, refWord });
      i += wLen - 1;
    }
  }
  return typos;
};

export const toggleHighlightClasses = (ele: HTMLSpanElement) => {
  if (ele.className.includes("badge-error")) {
    ele.classList.remove("badge-error");
    ele.classList.add("badge-warning");
  } else if (ele.className.includes("badge-warning")) {
    ele.classList.remove("badge-warning");
    ele.classList.add("badge-error");
  }
};
