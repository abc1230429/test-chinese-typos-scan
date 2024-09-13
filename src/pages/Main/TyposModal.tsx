import { countBy, entries } from "lodash";
import { ClipboardDocument } from "src/icons";
import { memo } from "react";
import { highlightTypoCharJsx } from "src/utils";
import { Typo } from "src/types";

const TyposModal: React.FC<{ typos: Typo[] }> = memo(({ typos }) => {
  return (
    <>
      {!!typos.length && (
        <button
          className="btn-rwd btn btn-neutral"
          onClick={() =>
            document
              .querySelector<HTMLDialogElement>("#typos-modal")
              ?.showModal()
          }
        >
          檢查全部
        </button>
      )}
      <dialog id="typos-modal" className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">這裡是所有可能的錯字</h3>
          <div className="whitespace-pre-wrap py-4">
            {entries(countBy(typos, (v) => v.word)).map(
              ([word, count], index) => {
                const refWord =
                  typos.find((v) => v.word === word)?.refWord || "";
                return (
                  <div className="flex items-center" key={word + index}>
                    <button
                      className="btn btn-circle btn-ghost btn-xs mr-1"
                      onClick={() => navigator.clipboard.writeText(word)}
                    >
                      <ClipboardDocument />
                    </button>
                    {highlightTypoCharJsx(word, refWord)} ({count})
                  </div>
                );
              },
            )}
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">關閉</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
});

export default TyposModal;
