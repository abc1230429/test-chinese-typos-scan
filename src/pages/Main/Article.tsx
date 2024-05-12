import { useEffect, useRef, useState } from "react";
import { highlightTypoCharJsx } from "src/utils";
import TyposModal from "./TyposModal";
import Quill from "quill";
import "./quill.ts";
import { findTyposOfArticle, toggleHighlightClasses } from "./utils.ts";
import { findLastIndex } from "lodash";

export type Typo = {
  index: number;
  word: string;
  id: string;
  refWord: string;
};

const Article: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const touchedRef = useRef<boolean>(false);
  const [typos, setTypos] = useState<Typo[]>([]);
  const [index, setIndex] = useState(0);
  const [quill, setQuill] = useState<Quill | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const quillInst = new Quill(ref.current, {
      placeholder: "請貼上你的文章",
    });
    setQuill(quillInst);
    const parentHeight = ref.current.parentElement?.scrollHeight || 500;
    ref.current.style.height = `calc(${parentHeight}px - 1rem)`;
  }, []);

  useEffect(() => {
    if (!quill) return;
    quill.off("selection-change");
    quill.on("selection-change", ({ index: selectIndex }) => {
      const nearest = findLastIndex(typos, (typo) => typo.index < selectIndex);
      setIndex(nearest);
      touchedRef.current = true;
    });
  }, [typos]);

  const goToIndex = (newIndex: number) => {
    touchedRef.current = false;
    const typo = typos[newIndex];
    if (!typo || !ref.current || !quill) return;
    quill.setSelection(typo.index, "silent");

    // cleanup previous color
    ref.current
      .querySelectorAll<HTMLSpanElement>("span.typo-highlight.badge-warning")
      .forEach(toggleHighlightClasses);

    // set color and scroll
    const newTarget = ref.current.querySelector<HTMLSpanElement>(`#${typo.id}`);
    if (!newTarget) return;
    toggleHighlightClasses(newTarget);
    newTarget.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleComparison = () => {
    if (!quill) return;
    const article = quill.getText();
    const typos = findTyposOfArticle(article, "愛麗娜");
    typos.forEach((typo) => {
      quill.formatText(
        typo.index,
        typo.word.length,
        "customHighlight",
        typo.id,
      );
    });
    if (!typos.length) alert("沒有找到錯字");
    setTypos(typos);
    setIndex(-1);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="h-full flex-grow pb-4">
        <div ref={ref} className="h-full" />
      </div>

      <div className="flex w-full justify-between">
        <div className="join">
          {!!typos.length && (
            <>
              <button
                disabled={index < 1}
                className="btn join-item btn-neutral"
                onClick={() => {
                  const newIndex = touchedRef.current ? index : index - 1;
                  setIndex(newIndex);
                  goToIndex(newIndex);
                }}
              >
                «
              </button>
              <button className="btn join-item btn-neutral">
                <span>
                  {highlightTypoCharJsx(
                    typos[index]?.word || "",
                    typos[index]?.refWord || "",
                  )}
                </span>
                <span>
                  {index + 1}/{typos.length}
                </span>
              </button>
              <button
                disabled={index >= typos.length - 1}
                className="btn join-item btn-neutral"
                onClick={() => {
                  const newIndex = index + 1;
                  setIndex(newIndex);
                  goToIndex(newIndex);
                }}
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
