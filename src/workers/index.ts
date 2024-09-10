import { Typo } from "src/types";

export const findTyposAsync: (
  article: string,
  refWord: string,
  options?: { threshold: number; couldShuffle: boolean },
) => Promise<Typo[]> = (article, refWord, options) => {
  const findTyposWorker = new Worker(
    new URL("./findTyposOfArticle.ts", import.meta.url),
    {
      type: "module",
    },
  );
  return new Promise((resolve, reject) => {
    findTyposWorker.postMessage([article, refWord, options]);
    findTyposWorker.onmessage = function (e) {
      resolve(e.data);
      findTyposWorker.terminate();
    };
    findTyposWorker.onerror = function (e) {
      reject(e);
      findTyposWorker.terminate();
    };
  });
};
