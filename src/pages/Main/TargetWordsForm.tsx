import { useState } from "react";
import { useTargetNounStore } from "src/stores";

const TargetWordsForm = () => {
  const [value, setValue] = useState("");
  const { nouns, addNoun, removeNoun } = useTargetNounStore();
  const handleConfirm = () => {
    const noun = value.trim();
    if (noun) addNoun(noun);
    setValue("");
  };
  return (
    <>
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
      <div className="relative flex w-[calc(100%-250px)] flex-1 items-center gap-1 overflow-hidden px-2">
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
        <div className="pointer-events-none absolute right-0 w-10 bg-gradient-to-r from-transparent to-base-300" />
      </div>
    </>
  );
};

export default TargetWordsForm;
