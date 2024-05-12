/* eslint-disable no-undef */
import fs from "node:fs";
import Papa from "papaparse";
import path from "node:path";

const processFile = (filePath) => {
  const csvPath = path.join(process.cwd(), "build/pinyin", filePath);
  const csvFile = fs.readFileSync(csvPath, "utf8");
  const records = Papa.parse(csvFile).data;
  return records;
};

const phonetics = processFile("CNS_phonetic.txt");
const pinyins = processFile("CNS_pinyin_1.txt");
const unicodes = processFile("CNS2UNICODE_Unicode BMP.txt");
const key2Pinyin = phonetics.reduce((acc, [key, phon]) => {
  const targetPinyin = pinyins.find(([v]) => v === phon)[1];
  if (!acc[key]) acc[key] = [];
  acc[key].push(targetPinyin);
  return acc;
}, {});
const unicode2Pinyin = unicodes.reduce((acc, [key, unicode]) => {
  const pinyin = key2Pinyin[key];
  if (!pinyin) return acc;
  acc[unicode.toLowerCase()] = pinyin;
  return acc;
}, {});

const outFile = path.join(process.cwd(), "src/dict.json");
fs.writeFileSync(outFile, JSON.stringify(unicode2Pinyin));
