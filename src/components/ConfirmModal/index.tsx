import { useRef, useState, createContext } from "react";

export type Options = {
  alert: boolean;
};

export const ConfirmContext = createContext<
  | {
      ref: React.RefObject<HTMLDialogElement>;
      resolveRef: React.MutableRefObject<(result: boolean) => void>;
      setText: (text: string) => void;
      setOptions: React.Dispatch<React.SetStateAction<Options>>;
    }
  | undefined
>(undefined);

const ConfirmModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const ref = useRef<HTMLDialogElement>(null);
  const resolveRef = useRef<(result: boolean) => void>(() => {});
  const [text, setText] = useState("");
  const [options, setOptions] = useState<Options>({ alert: false });

  return (
    <ConfirmContext.Provider
      value={{
        ref,
        resolveRef,
        setText,
        setOptions,
      }}
    >
      <dialog className="modal" ref={ref}>
        <div className="modal-box">
          <h3 className="text-lg font-bold"></h3>
          <p className="py-4">{text}</p>
          <div className="">
            <form method="dialog" className="modal-action gap-3">
              {options.alert ? null : (
                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    ref.current?.close();
                    resolveRef.current(false);
                  }}
                >
                  取消
                </button>
              )}
              <button
                className="btn btn-ghost"
                onClick={() => {
                  ref.current?.close();
                  resolveRef.current(true);
                }}
              >
                確認
              </button>
            </form>
          </div>
        </div>
      </dialog>
      {children}
    </ConfirmContext.Provider>
  );
};

export default ConfirmModalProvider;
