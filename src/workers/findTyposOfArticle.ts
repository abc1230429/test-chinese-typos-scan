import { findTypos } from "src/utils/findTypos";

self.onmessage = function (e) {
  const [article, refWord] = e.data;
  const result = findTypos(article, refWord);
  self.postMessage(result);
};
