import {
  TargetWordsInput,
  TargetWordTags,
} from "src/components/TargetWordsForm";
import { useTargetNounStore } from "src/stores";

const SimpleTargetWordsForm = () => {
  const { nouns, addNoun, removeNoun } = useTargetNounStore();
  return (
    <>
      <TargetWordsInput addNoun={addNoun} />
      <div className="relative flex w-[calc(100%-250px)] flex-1 items-center gap-1 overflow-hidden px-2">
        <TargetWordTags nouns={nouns} removeNoun={removeNoun} />
        <div className="pointer-events-none absolute right-0 h-full w-12 bg-gradient-to-r from-transparent to-base-300" />
      </div>
    </>
  );
};

export default SimpleTargetWordsForm;
