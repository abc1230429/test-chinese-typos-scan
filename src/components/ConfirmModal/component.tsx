import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { ModalMethods } from ".";

const ConfirmModal = forwardRef<
  ModalMethods,
  { options?: { isAlert: boolean } }
>(({ options = { isAlert: false } }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [content, setContent] = useState<React.ReactNode>("");
  const [handler, setHandler] = useState<(result: unknown) => void>(() => {});

  useImperativeHandle(ref, () => ({
    modalRef,
    open: () => modalRef.current?.showModal(),
    close: () => modalRef.current?.close(),
    setContent,
    setHandler,
  }));

  return (
    <dialog className="modal" ref={modalRef}>
      <div className="modal-box">
        <h3 className="text-lg font-bold"></h3>
        <p className="py-4">{content}</p>
        <div className="">
          <form method="dialog" className="modal-action gap-3">
            {!options.isAlert && (
              <button
                className="btn btn-ghost"
                onClick={() => {
                  handler(false);
                }}
              >
                取消
              </button>
            )}
            <button
              className={`btn ${!options.isAlert ? "btn-ghost" : ""}`}
              onClick={() => {
                handler(true);
              }}
            >
              確認
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
});

export default ConfirmModal;
