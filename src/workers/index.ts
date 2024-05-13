import { Typo } from "src/types";

export let findTyposWorker: Worker;

export let findTyposAsync: (
  article: string,
  refWord: string,
) => Promise<Typo[]>;

if (window.Worker) {
  const findTyposWorker = new Worker(
    new URL("./findTyposOfArticle.ts", import.meta.url),
    {
      type: "module",
    },
  );

  findTyposAsync = (article, refWord) => {
    return new Promise((resolve, reject) => {
      findTyposWorker.postMessage([article, refWord]);
      findTyposWorker.onmessage = function (e) {
        resolve(e.data);
      };
      findTyposWorker.onerror = function (e) {
        reject(e);
      };
    });
  };
}
