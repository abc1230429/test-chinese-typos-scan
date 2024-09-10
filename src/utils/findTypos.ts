import { escape, pullAt, some } from "lodash";
import { defaultThreshold } from "src/constants";
import { Typo } from "src/types";
import { chineseFuzzyEqual } from "src/utils";

export const findTypos = (
  article: string,
  refWord: string,
  options = { threshold: defaultThreshold, couldShuffle: false },
) => {
  const wLen = refWord.length;
  const typos: Typo[] = [];
  const refWordDict = refWord
    .split("")
    .reduce<{ [key: string]: boolean }>((acc, curr) => {
      acc[curr] = true;
      return acc;
    }, {});
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

    const hasSameChars = some(compareWord, (c) => refWordDict[c]);

    // 如果每個字都不一樣，就採嚴格拼音相同
    const threshold = hasSameChars ? options.threshold : 0;

    const isWrongOrder = () => {
      if (!options.couldShuffle) return false;
      if (wLen < 3) return false;
      const charsToTest = refWord.split("");
      return compareWord.split("").every((charA) => {
        return charsToTest.some((charB, index) => {
          const isFuzzyEqual = chineseFuzzyEqual(charA, charB, 0);
          if (isFuzzyEqual) {
            pullAt(charsToTest, index);
            return true;
          }
          return false;
        });
      });
    };

    const isFuzzyEqual = () =>
      chineseFuzzyEqual(compareWord, refWord, threshold);

    if (isWrongOrder() || isFuzzyEqual()) {
      const id = `typo-${i}`;
      const cleanCompareWord = escape(compareWord);
      typos.push({ index: i, word: cleanCompareWord, id, refWord });
      i += wLen - 1;
    }
  }
  return typos;
};
