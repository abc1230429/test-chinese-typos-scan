import { useEffect, useRef, useState } from "react";
import { highlightTypoCharJsx } from "src/utils";
import TyposModal from "./TyposModal";
import Quill from "quill";
import "./quill.ts";
import { findTyposOfArticle, toggleHighlightClasses } from "./utils.ts";
import { findLastIndex } from "lodash";
import { setupQuill } from "./quill.ts";
import { useTargetNounStore } from "src/stores/index.ts";

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
  const nouns = useTargetNounStore((state) => state.nouns);

  useEffect(() => {
    if (!ref.current) return;
    const quillInst = setupQuill(ref.current);
    setQuill(quillInst);
    quillInst.on("editor-change", () => {
      if (quillInst.editor.isBlank()) setTypos([]);
    });
  }, []);

  useEffect(() => {
    const resize = () => {
      if (!ref.current) return;
      const parentHeight = ref.current.parentElement?.scrollHeight || 500;
      ref.current.style.height = `calc(${parentHeight}px - 1rem)`;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [quill]);

  useEffect(() => {
    if (!quill) return;
    const setIndexOnSelect = (event: { index: number }) => {
      if (!event) return;
      const nearest = findLastIndex(typos, (typo) => typo.index < event.index);
      setIndex(nearest);
      touchedRef.current = true;
    };
    quill.on("selection-change", setIndexOnSelect);
    return () => {
      quill.off("selection-change", setIndexOnSelect);
    };
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
    quill.removeFormat(0, quill.getLength());

    const article = quill.getText();
    const typos = findTyposOfArticle(article, nouns[0]);
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
        <button
          className="btn btn-primary text-primary-content"
          onClick={handleComparison}
          disabled={!nouns.length}
        >
          比對
        </button>
      </div>
    </div>
  );
};

export default Article;
