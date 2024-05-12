import { Options as PinyinTypeOptions } from "pinyin";

declare module "pinyin" {
  interface Options extends PinyinTypeOptions {
    compact?: boolean;
  }
}
