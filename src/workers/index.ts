import { Typo } from "src/types";

export let findTyposWorker: Worker;

export let findTyposAsync: (
  article: string,
  refWord: string,
  options?: { threshold: number },
) => Promise<Typo[]>;

if (window.Worker) {
  const findTyposWorker = new Worker(
    new URL("./findTyposOfArticle.ts", import.meta.url),
    {
      type: "module",
    },
  );

  findTyposAsync = (article, refWord, options) => {
    return new Promise((resolve, reject) => {
      findTyposWorker.postMessage([article, refWord, options]);
      findTyposWorker.onmessage = function (e) {
        resolve(e.data);
      };
      findTyposWorker.onerror = function (e) {
        reject(e);
      };
    });
  };
}
