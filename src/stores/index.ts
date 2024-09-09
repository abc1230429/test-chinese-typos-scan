import { uniq } from "lodash";
import { defaultThreshold } from "src/constants";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type NounStore = {
  nouns: string[];
  setNouns: (nouns: string[]) => void;
  addNoun: (noun: string) => void;
  removeNoun: (noun: string) => void;
};

export const useTargetNounStore = create<
  NounStore,
  [["zustand/persist", NounStore]]
>(
  persist(
    (set) => ({
      nouns: [],
      setNouns: (nouns) => {
        set(() => ({ nouns }));
      },
      addNoun: (noun) => {
        set((state) => ({ nouns: uniq([...state.nouns, noun]) }));
      },
      removeNoun: (noun) => {
        set((state) => ({ nouns: state.nouns.filter((v) => v !== noun) }));
      },
    }),
    {
      name: "target-nouns",
    },
  ),
);

export const useReservedNounStore = create<
  NounStore,
  [["zustand/persist", NounStore]]
>(
  persist(
    (set) => ({
      nouns: [],
      setNouns: (nouns) => {
        set(() => ({ nouns }));
      },
      addNoun: (noun) => {
        set((state) => ({ nouns: uniq([...state.nouns, noun]) }));
      },
      removeNoun: (noun) => {
        set((state) => ({ nouns: state.nouns.filter((v) => v !== noun) }));
      },
    }),
    {
      name: "reserved-nouns",
    },
  ),
);

export const useSettingStore = create<
  { threshold: number; setThreshold: (threshold: number) => void },
  [["zustand/persist", NounStore]]
>(
  persist(
    (set) => ({
      threshold: defaultThreshold,
      setThreshold: (threshold: number) => {
        set(() => ({ threshold }));
      },
    }),
    { name: "setting" },
  ),
);
