import { escape, filter } from "lodash";
import { defaultThreshold } from "src/constants";
import { Typo } from "src/types";
import { chineseFuzzyEqual } from "src/utils";
import { pinyin } from "src/utils/pinyin";

export const findTypos = (
  article: string,
  refWord: string,
  options = { threshold: defaultThreshold },
) => {
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

    const sameChars = filter(compareWord, (c) => refWordDict[c]);

    // 如果每個字都不一樣，就採嚴格拼音相同
    const threshold = sameChars.length === 0 ? 0 : options.threshold;

    const isWrongOrder = wLen >= 3 && sameChars.length === wLen;
    const isFuzzyEqual = () =>
      chineseFuzzyEqual(compareWord, refWordPinyin, threshold);

    if (isWrongOrder || isFuzzyEqual()) {
      const id = `typo-${i}`;
      const cleanCompareWord = escape(compareWord);
      typos.push({ index: i, word: cleanCompareWord, id, refWord });
      i += wLen - 1;
    }
  }
  return typos;
};
