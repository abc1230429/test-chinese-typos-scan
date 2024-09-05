import { useRef } from "react";
import InputBlock from "./InputBlock";

const Setting: React.FC = () => {
  const ref = useRef<HTMLDialogElement>(null);

  const openModal = () => {
    if (ref.current) ref.current.showModal();
  };

  return (
    <div>
      <button className="btn btn-neutral" onClick={openModal}>
        更多設定
      </button>
      <dialog ref={ref} style={{ scrollbarGutter: "stable" }} className="modal">
        <div className=" modal-box flex h-full max-w-3xl flex-col">
          <h3 className="text-lg font-bold">更多設定</h3>
          <div className="grid flex-grow grid-cols-1 grid-rows-[auto_1fr] pt-4">
            <div className="grid grid-cols-3 pb-8">
              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-4">
                  <input
                    type="checkbox"
                    className="checkbox-primary checkbox"
                  />
                  <span className="label-text text-lg">忽略聲調</span>
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-4">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="checkbox-primary checkbox"
                  />
                  <span className="label-text text-lg">字序調換</span>
                </label>
              </div>
              <div className="form-control">
                <span className="label-text pb-2 text-lg">錯字閥值</span>
                <input
                  type="range"
                  min={0}
                  max="30"
                  defaultValue={15}
                  className="range range-primary range-xs"
                />
              </div>
            </div>
            <div className="flex w-full">
              <InputBlock label="目標詞條" />
              <div className="divider divider-horizontal">
                <div>
                  {"排除右側".split("").map((c) => (
                    <div key={c}>{c}</div>
                  ))}
                </div>
              </div>
              <InputBlock label="排除詞條" />
            </div>
          </div>
          <form method="dialog">
            <div className="modal-action gap-4">
              <button className="btn">取消</button>
              <button className="btn btn-primary">儲存</button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default Setting;
