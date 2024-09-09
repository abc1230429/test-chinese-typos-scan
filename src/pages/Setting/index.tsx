import { useRef, useState } from "react";
import {
  useReservedNounStore,
  useSettingStore,
  useTargetNounStore,
} from "src/stores";
import {
  TargetWordsInput,
  TargetWordTags,
} from "src/components/TargetWordsForm";
import { isEqual } from "lodash";
import { defaultThreshold, inputDelimiter } from "src/constants";

type Setting = {
  threshold: number;
};

const Setting: React.FC = () => {
  const ref = useRef<HTMLDialogElement>(null);

  const [setting, setSetting] = useState<Setting>({
    threshold: defaultThreshold,
  });
  const [targetNouns, setTargetNouns] = useState<string[]>([]);
  const [reservedNouns, setReservedNouns] = useState<string[]>([]);

  const targetNounsStore = useTargetNounStore((state) => state.nouns);
  const setTargetNounsStore = useTargetNounStore((state) => state.setNouns);
  const reservedNounsStore = useReservedNounStore((state) => state.nouns);
  const setReservedNounsStore = useReservedNounStore((state) => state.setNouns);
  const settingStore = useSettingStore();

  const openModal = () => {
    if (ref.current) ref.current.showModal();
    setSetting({ threshold: settingStore.threshold });
    setTargetNouns(targetNounsStore);
    setReservedNouns(reservedNounsStore);
  };

  const onSave = () => {
    setTargetNounsStore(targetNouns);
    setReservedNounsStore(reservedNouns);
    settingStore.setThreshold(setting.threshold);
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
                <span className="label-text pb-2 text-lg">
                  閥值: {setting.threshold}
                </span>
                <input
                  type="range"
                  min={0}
                  max={0.4}
                  step={0.01}
                  value={setting.threshold}
                  className="range range-primary range-xs"
                  onChange={(e) => {
                    setSetting({ threshold: Number(e.target.value) });
                  }}
                />
              </div>
            </div>
            <div className="flex w-full">
              <div className="relative flex-1 overflow-hidden rounded-box bg-base-300 px-4 py-8">
                <TargetWordsInput
                  addNoun={(noun: string) => {
                    setTargetNouns((state) => {
                      if (state.includes(noun)) return state;
                      return [...state, noun];
                    });
                  }}
                  placeholder="目標詞條"
                />
                <div className="overflow-hidden py-4">
                  <div className="flex flex-wrap gap-2">
                    <TargetWordTags
                      nouns={targetNouns}
                      removeNoun={(noun: string) => {
                        setTargetNouns((state) =>
                          state.filter((s) => s !== noun),
                        );
                      }}
                    />
                  </div>
                </div>
                <button className="btn pointer-events-none opacity-0"></button>
                <div className="join absolute bottom-0 left-0 flex w-full">
                  <button
                    className="btn join-item flex-1"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        targetNouns.join(inputDelimiter),
                      );
                    }}
                  >
                    複製全部
                  </button>
                  <button
                    className="btn join-item flex-1"
                    onClick={() => {
                      setTargetNouns([]);
                    }}
                  >
                    清除全部
                  </button>
                </div>
              </div>
              <div className="divider divider-horizontal">
                <div>
                  {"排除右側".split("").map((c) => (
                    <div key={c}>{c}</div>
                  ))}
                </div>
              </div>
              <div className="relative flex-1 overflow-hidden rounded-box bg-base-300 px-4 py-8">
                <TargetWordsInput
                  addNoun={(noun: string) => {
                    setReservedNouns((state) => {
                      if (state.includes(noun)) return state;
                      return [...state, noun];
                    });
                  }}
                  placeholder="指定為非錯字"
                />
                <div className="overflow-hidden py-4">
                  <div className="flex flex-wrap gap-2">
                    <TargetWordTags
                      nouns={reservedNouns}
                      removeNoun={(noun: string) => {
                        setReservedNouns((state) =>
                          state.filter((s) => s !== noun),
                        );
                      }}
                    />
                  </div>
                </div>
                <button className="btn pointer-events-none opacity-0"></button>
                <div className="join absolute bottom-0 left-0 flex w-full">
                  <button
                    className="btn join-item flex-1"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        reservedNouns.join(inputDelimiter),
                      );
                    }}
                  >
                    複製全部
                  </button>
                  <button
                    className="btn join-item flex-1"
                    onClick={() => {
                      setReservedNouns([]);
                    }}
                  >
                    清除全部
                  </button>
                </div>
              </div>
            </div>
          </div>
          <form method="dialog">
            <div className="modal-action gap-4">
              <button className="btn">取消</button>
              <button
                onClick={onSave}
                className="btn btn-primary"
                disabled={
                  setting.threshold === settingStore.threshold &&
                  isEqual(targetNouns, targetNounsStore) &&
                  isEqual(reservedNouns, reservedNounsStore)
                }
              >
                儲存
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default Setting;
