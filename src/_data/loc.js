// 페이지 내용(언어별): 한국어 원본(_data/*.yml)에 번역본(_content/en, _content/vi)을 덮어씀.
// 번역본에 없는 항목은 한국어가 그대로 쓰이므로, 번역은 바뀐 부분만 넣어도 됩니다(목록은 통째로 교체).
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

const FILES = ["site", "home", "about", "courses", "ipp", "partners", "admission", "people"];
const read = (p) => (fs.existsSync(p) ? yaml.load(fs.readFileSync(p, "utf8")) || {} : {});
const isObj = (x) => x && typeof x === "object" && !Array.isArray(x);
// 번역 값이 비어 있거나(빈 문자열·빈 목록), 켜기/끄기·숫자 같은 설정값이면 한국어 원본을 그대로 씀
const usable = (v) => v !== null && v !== undefined && v !== "" && typeof v !== "boolean" && typeof v !== "number" && !(Array.isArray(v) && v.length === 0);
function merge(a, b) {
  if (!isObj(a) || !isObj(b)) return usable(b) ? b : a;
  const out = { ...a };
  for (const [k, v] of Object.entries(b)) {
    if (isObj(v) && isObj(a[k])) out[k] = merge(a[k], v);
    else if (usable(v)) out[k] = v;
  }
  return out;
}

export default function () {
  const root = path.resolve("src");
  const out = { ko: {}, en: {}, vi: {} };
  for (const f of FILES) {
    const ko = read(path.join(root, "_data", `${f}.yml`));
    out.ko[f] = ko;
    for (const lang of ["en", "vi"]) out[lang][f] = merge(ko, read(path.join(root, "_content", lang, `${f}.yml`)));
  }
  return out;
}
