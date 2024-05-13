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
  const regex = /[，。「」\n]/;

  for (let i = 0; i < article.length; i++) {
    const compareWord = article.slice(i, i + wLen).trim();

    if (
      !compareWord ||
      compareWord.length !== wLen ||
      regex.test(compareWord)
    ) {
      continue;
    }

    if (compareWord === refWord) {
      i += wLen - 1;
      continue;
    }

    const isWrongOrder = wLen >= 3 && every(compareWord, (c) => refWordDict[c]);
    const isFuzzyEqual = chineseFuzzyEqual(compareWord, refWordPinyin);
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
  ele.classList.toggle("badge-error");
  ele.classList.toggle("badge-warning");
};
