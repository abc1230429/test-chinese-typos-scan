import { findTypos } from "src/utils/findTypos";

self.onmessage = function (e) {
  const [article, refWord, options] = e.data;
  const result = findTypos(article, refWord, options);
  self.postMessage(result);
};
