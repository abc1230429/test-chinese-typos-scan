import dict from "./dict.json";

export const getPinyins = (cChar: string) => {
  const unicode = cChar.charCodeAt(0).toString(16);
  // @ts-expect-error: dict unicode
  const pinyins = (dict[unicode] as string[]) || [cChar];
  return pinyins;
};

export const pinyinCombine = (pinyins: string[][]) => {
  return pinyins.reduce<string[][]>(
    (acc, curr) => {
      return acc.flatMap((prevCombination) => {
        return curr.map((item) => [...prevCombination, item]);
      });
    },
    [[]],
  );
};

export const pinyin = (word: string) => {
  return pinyinCombine(word.split("").map(getPinyins));
};
