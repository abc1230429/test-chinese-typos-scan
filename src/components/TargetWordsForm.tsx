import { useState } from "react";

export const TargetWordTags: React.FC<
  {
    nouns: string[];
    removeNoun: (noun: string) => void;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ nouns, removeNoun, ...buttonProps }) => {
  return (
    <>
      {nouns.map((noun) => (
        <button
          key={noun}
          className="btn btn-ghost px-2"
          onClick={() => {
            const result = confirm(`要移除名字：${noun} 嗎？`);
            if (result) removeNoun(noun);
          }}
          {...buttonProps}
        >
          {noun}
        </button>
      ))}
    </>
  );
};

export const TargetWordsInput: React.FC<
  {
    addNoun: (noun: string) => void;
  } & React.InputHTMLAttributes<HTMLInputElement>
> = ({ addNoun, ...inputProps }) => {
  const [value, setValue] = useState("");
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
          {...inputProps}
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
    </>
  );
};
