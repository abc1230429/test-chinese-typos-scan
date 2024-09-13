import { useState } from "react";
import { inputDelimiter } from "src/constants";
import { useConfirm } from "./ConfirmModal";

export const TargetWordTags: React.FC<
  {
    nouns: string[];
    removeNoun: (noun: string) => void;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ nouns, removeNoun, ...buttonProps }) => {
  const confirm = useConfirm();

  return (
    <>
      {nouns.map((noun) => (
        <button
          key={noun}
          className="btn-rwd btn btn-ghost px-2"
          onClick={async () => {
            const result = await confirm(`要移除名字：${noun} 嗎？`);
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
> = ({ addNoun, className = "", ...inputProps }) => {
  const [value, setValue] = useState("");
  const handleConfirm = () => {
    const noun = value.trim();
    if (noun) addNoun(noun);
    setValue("");
  };
  return (
    <label
      className={`input input-sm input-bordered flex items-center gap-2 sm:input-md ${className}`}
    >
      <input
        type="text"
        placeholder="輸入要比對的名字"
        className="grow"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onPaste={(e) => {
          e.preventDefault();
          const nouns = e.clipboardData.getData("text").split(inputDelimiter);
          nouns.forEach((noun) => addNoun(noun.trim()));
          setValue("");
        }}
        onKeyDown={(e) => {
          if (e.key.toLocaleUpperCase() === "ENTER") handleConfirm();
        }}
        {...inputProps}
      />
      <button
        className="btn btn-circle btn-xs sm:btn-sm"
        onClick={handleConfirm}
      >
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
  );
};
