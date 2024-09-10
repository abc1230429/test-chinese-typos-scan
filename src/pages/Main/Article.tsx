import { useEffect, useRef, useState } from "react";
import { highlightTypoCharJsx } from "src/utils";
import TyposModal from "./TyposModal";
import Quill from "quill";
import "./quill.ts";
import { findIndex } from "lodash";
import { setupQuill } from "./quill.ts";
import {
  useReservedNounStore,
  useSettingStore,
  useTargetNounStore,
} from "src/stores/index.ts";
import { findTyposAsync } from "src/workers/index.ts";
import { Typo } from "src/types/index.js";
import { useAlert } from "src/components/ConfirmModal/useConfirm.tsx";

const toggleHighlightClasses = (ele: HTMLSpanElement) => {
  ele.classList.toggle("badge-error");
  ele.classList.toggle("badge-warning");
};

const Article: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const touchedRef = useRef<boolean>(false);
  const [typos, setTypos] = useState<Typo[]>([]);
  const [index, setIndex] = useState(0);
  const [quill, setQuill] = useState<Quill | null>(null);
  const nouns = useTargetNounStore((state) => state.nouns);
  const reservedNouns = useReservedNounStore((state) => state.nouns);
  const threshold = useSettingStore((state) => state.threshold);
  const [loading, setLoading] = useState(false);
  const alert = useAlert();

  useEffect(() => {
    if (!ref.current) return;
    const quillInst = setupQuill(ref.current);
    setQuill(quillInst);
    quillInst.on("editor-change", () => {
      if (quillInst.editor.isBlank()) setTypos([]);
    });
  }, []);

  useEffect(() => {
    if (!quill) return;
    const setIndexOnSelect = (event: { index: number }) => {
      if (!event) return;
      let nearest = findIndex(typos, (typo) => typo.index > event.index);
      if (nearest === -1) nearest = typos.length - 1;
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

  const handleComparison = async () => {
    if (!quill) return;
    setLoading(true);
    quill.removeFormat(0, quill.getLength() - 1);

    const article = quill.getText();

    const typos: Typo[] = [];
    for (const noun of nouns) {
      try {
        const newTypos = await findTyposAsync(article, noun, { threshold });
        typos.push(...newTypos);
      } catch (err) {
        console.error(err);
      }
    }

    const validTypos = typos
      .filter(
        ({ word }) => !nouns.includes(word) && !reservedNouns.includes(word),
      )
      .sort((a, b) => a.index - b.index);

    validTypos.forEach((typo) => {
      quill.formatText(
        typo.index,
        typo.word.length,
        "customHighlight",
        typo.id,
      );
    });
    if (!validTypos.length) alert("沒有找到錯字");
    setTypos(validTypos);
    setIndex(0);
    setLoading(false);
  };

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <div className="flex-1 overflow-auto pb-4">
        <div ref={ref} className="h-full" />
      </div>

      <div className="flex w-full justify-between">
        <div className="join flex-1 basis-32 sm:basis-0">
          {!!typos.length && (
            <>
              <button
                disabled={index < 1}
                className="btn join-item btn-neutral btn-sm sm:btn-md"
                onClick={() => {
                  const newIndex = touchedRef.current ? index : index - 1;
                  setIndex(newIndex);
                  goToIndex(newIndex);
                }}
              >
                «
              </button>
              <button
                className="btn join-item btn-neutral btn-sm sm:btn-md"
                onClick={() => {
                  goToIndex(index);
                }}
              >
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
                className="btn join-item btn-neutral btn-sm sm:btn-md"
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
        <div className="flex flex-1 justify-end sm:justify-center">
          <TyposModal typos={typos} />
        </div>
        <div className="flex flex-1 justify-end">
          <button
            className="btn btn-primary btn-sm text-primary-content sm:btn-md"
            onClick={handleComparison}
            disabled={!nouns.length || loading}
          >
            比對
          </button>
        </div>
      </div>
    </div>
  );
};

export default Article;
