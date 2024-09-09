import { useContext } from "react";
import { ConfirmContext, Options } from ".";

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) throw new Error("no confirm modal context");

  const { ref, setText, resolveRef, setOptions } = context;

  const confirm = (text: string, options: Options = { alert: false }) => {
    setText(text);
    setOptions(options);
    ref?.current?.showModal();
    return new Promise<boolean>((r) => {
      resolveRef.current(false);
      resolveRef.current = r;
    });
  };

  return confirm;
};

export const useAlert = () => {
  const confirm = useConfirm();
  const alert = (text: string) => {
    confirm(text, { alert: true });
  };
  return alert;
};
