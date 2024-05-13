import { uniq } from "lodash";
import { create } from "zustand";

type TargetNounStore = {
  nouns: string[];
  addNoun: (noun: string) => void;
  removeNoun: (noun: string) => void;
};

export const useTargetNounStore = create<TargetNounStore>((set) => ({
  nouns: [],
  addNoun: (noun) => {
    set((state) => ({ nouns: uniq([...state.nouns, noun]) }));
  },
  removeNoun: (noun) => {
    set((state) => ({ nouns: state.nouns.filter((v) => v !== noun) }));
  },
}));
