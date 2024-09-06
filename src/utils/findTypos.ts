import { escape, every } from "lodash";
import { Typo } from "src/types";
import { chineseFuzzyEqual } from "src/utils";
import { pinyin } from "src/utils/pinyin";

const hasIntersection = (str1: string, str2: string) =>
  str1.split("").some((char) => str2.includes(char));

export const findTypos = (article: string, refWord: string) => {
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

    // 如果名字小於三個字，但每個字都不一樣，就算了，否則會找到太多無關的
    if (wLen < 3 && !hasIntersection(compareWord, refWord)) {
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
