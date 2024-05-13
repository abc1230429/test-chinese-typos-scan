import { useLayoutEffect, useRef, useState } from "react";
import { useTargetNounStore } from "src/stores";

const DisplayBox: React.FC = () => {
  const [shouldEllipsis, setShouldEllipsis] = useState(false);
  const { nouns, removeNoun } = useTargetNounStore();
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!ref.current) return;
    setShouldEllipsis(ref.current.scrollWidth > ref.current.clientWidth);
  }, [nouns]);
  return (
    <div
      ref={ref}
      className="relative flex w-60 items-center gap-1 overflow-hidden"
    >
      {nouns.map((noun) => (
        <button
          key={noun}
          className="btn btn-ghost px-2"
          onClick={() => {
            const result = confirm(`要移除名字：${noun} 嗎？`);
            if (result) removeNoun(noun);
          }}
        >
          {noun}
        </button>
      ))}
      {shouldEllipsis && (
        <div className="pointer-events-none absolute bottom-0 left-1/2 right-0 top-0 bg-gradient-to-r from-transparent to-base-300" />
      )}
    </div>
  );
};

const TargetWordsForm = () => {
  const [value, setValue] = useState("");
  const addNoun = useTargetNounStore((state) => state.addNoun);
  const handleConfirm = () => {
    const noun = value.trim();
    if (noun) addNoun(noun);
    setValue("");
  };
  return (
    <div className="flex gap-2">
      <label className="input input-bordered flex items-center gap-2">
        <input
          type="text"
          placeholder="輸入要比對的名字"
          className="grow"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key.toLocaleUpperCase() === "ENTER") handleConfirm();
          }}
        />
        <button className="btn btn-circle btn-sm" onClick={handleConfirm}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </button>
      </label>
      <DisplayBox />
    </div>
  );
};

export default TargetWordsForm;
