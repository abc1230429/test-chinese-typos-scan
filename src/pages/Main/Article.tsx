import { useEffect, useRef, useState } from "react";
import {
  chineseFuzzyEqual,
  highlightTypoCharJsx,
  pinyinOptions,
  wrapHtmlString,
} from "src/utils";
import TyposModal from "./TyposModal";
import { escape, every } from "lodash";
import pinyin from "pinyin";

export type Typo = {
  index: number;
  word: string;
  id: string;
  refWord: string;
};

const highlight = (word: string, id: string) =>
  wrapHtmlString(word, "span", {
    id,
    class:
      "typo-highlight badge badge-error px-1 mx-1 rounded-sm whitespace-pre-wrap",
  });

const findTyposOfArticle = (article: string, refWord: string) => {
  const wLen = refWord.length;
  let articleWithHtml = "";
  const typos: Typo[] = [];
  const refWordDict = refWord
    .split("")
    .reduce<{ [key: string]: boolean }>((acc, curr) => {
      acc[curr] = true;
      return acc;
    }, {});
  const refWordPinyin = pinyin(refWord, pinyinOptions);

  for (let i = 0; i <= article.length - wLen + 2; i++) {
    const compareWord = article.slice(i, i + wLen);
    if (compareWord === refWord) {
      articleWithHtml += escape(refWord);
      i += wLen - 1;
      continue;
    }

    const isValid = !compareWord.includes("\n");
    const isWrongOrder =
      isValid && wLen >= 3 && every(compareWord, (c) => refWordDict[c]);
    const isFuzzyEqual =
      isValid && chineseFuzzyEqual(compareWord, refWordPinyin);
    if (isWrongOrder || isFuzzyEqual) {
      const id = `typo-${i}`;
      const cleanCompareWord = escape(compareWord);
      articleWithHtml += highlight(cleanCompareWord, id);
      typos.push({ index: i, word: cleanCompareWord, id, refWord });
      i += wLen - 1;
    } else {
      articleWithHtml += escape(article[i]);
    }
  }
  return { articleWithHtml, typos };
};

const Article: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [typos, setTypos] = useState<Typo[]>([]);
  const [index, setIndex] = useState(0);

  const currTypo = typos[index];

  useEffect(() => {
    if (!currTypo || !ref.current) return;

    ref.current
      .querySelectorAll<HTMLSpanElement>("span.typo-highlight.badge-warning")
      .forEach((v) => {
        v.classList.remove("badge-warning");
        v.classList.add("badge-error");
      });

    const newTarget = ref.current.querySelector(`#${currTypo.id}`);
    if (!newTarget) return;
    newTarget.classList.remove("badge-error");
    newTarget.classList.add("badge-warning");
    newTarget.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [index, currTypo]);

  const handleComparison = () => {
    if (!ref.current) return;
    const article = ref.current.innerText;
    const result = findTyposOfArticle(article, "愛麗娜");
    ref.current.innerHTML = result.articleWithHtml;
    if (!result.typos.length) alert("沒有找到錯字");
    setTypos(result.typos);
  };

  return (
    <div className="flex h-full w-full flex-col">
      <label className="form-control flex-grow pb-4">
        <div
          ref={ref}
          contentEditable
          // @ts-expect-error: placeholder
          placeholder="請貼上你的文章"
          className="textarea textarea-bordered h-96 flex-grow resize-y overflow-auto whitespace-pre-wrap empty:before:content-[attr(placeholder)]"
        />
      </label>

      <div className="flex w-full justify-between">
        <div className="join">
          {!!typos.length && (
            <>
              <button
                disabled={index < 1}
                className="btn join-item btn-neutral"
                onClick={() => setIndex(index - 1)}
              >
                «
              </button>
              <button className="btn join-item btn-neutral">
                <span>
                  {highlightTypoCharJsx(
                    currTypo?.word || "",
                    currTypo?.refWord || "",
                  )}
                </span>
                <span>
                  {index + 1}/{typos.length}
                </span>
              </button>
              <button
                disabled={index >= typos.length - 1}
                className="btn join-item btn-neutral"
                onClick={() => setIndex(index + 1)}
              >
                »
              </button>
            </>
          )}
        </div>
        <TyposModal typos={typos} />
        <button className="btn btn-neutral" onClick={handleComparison}>
          比對
        </button>
      </div>
    </div>
  );
};

export default Article;
