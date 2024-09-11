import { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import ConfirmModal from "./component";

export type ModalMethods = {
  modalRef: React.RefObject<HTMLDialogElement>;
  open: () => void;
  close: () => void;
  setContent: React.Dispatch<React.SetStateAction<React.ReactNode>>;
  setHandler: React.Dispatch<React.SetStateAction<(result: unknown) => void>>;
};

export const useConfirm = (options?: { isAlert: boolean }) => {
  const ref = useRef<ModalMethods>(null);

  useEffect(() => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    root.render(<ConfirmModal ref={ref} options={options} />);
    return () => {
      requestAnimationFrame(() => {
        root.unmount();
        document.body.removeChild(container);
      });
    };
  }, []);

  const confirm = (content: React.ReactNode) => {
    if (!ref.current) return Promise.resolve();
    ref.current.setContent(content);
    ref.current.open();
    return new Promise<boolean>((r) => ref.current?.setHandler(() => r));
  };

  return confirm;
};

export const useAlert = () => {
  const alert = useConfirm({ isAlert: true });
  return alert;
};
