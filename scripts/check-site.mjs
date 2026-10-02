// 빌드 결과(_site) 검수: 공개 전 금지 문구, 개인정보 패턴, 깨진 내부 링크, 이미지 대체 텍스트
// 사용법: npm run build && npm run check
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const SITE = path.resolve("_site");
const errors = [];

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

async function exists(p) {
  try { await stat(p); return true; } catch { return false; }
}

const FORBIDDEN = [
  [/\[확인/, "[확인] 표시"],
  [/확인:\s/, "확인 메모"],
  [/\b01[016789]-?\d{3,4}-?\d{4}\b/, "휴대폰 번호"],
  [/\+82-?10-?\d{4}-?\d{4}/, "휴대폰 번호(국제 표기)"],
  [/생년월일|Date of Birth/i, "생년월일"],
  [/undefined|\[object Object\]/, "템플릿 오류 흔적"],
];

const files = await walk(SITE);
const htmlFiles = files.filter((f) => f.endsWith(".html") && !f.includes(`${path.sep}admin${path.sep}`));

for (const f of htmlFiles) {
  const rel = path.relative(SITE, f);
  const html = await readFile(f, "utf8");
  const text = html.replace(/<script[\s\S]*?<\/script>/g, "");

  for (const [re, label] of FORBIDDEN) {
    const m = text.match(re);
    if (m) errors.push(`${rel}: ${label} 노출 → "${m[0]}"`);
  }

  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt=/.test(m[0])) errors.push(`${rel}: 대체 텍스트(alt) 없는 이미지 ${m[0].slice(0, 80)}`);
  }

  for (const m of html.matchAll(/\b(?:href|src)="(\/[^"#?]*)/g)) {
    const url = m[1];
    if (url.startsWith("//")) continue;
    let target = path.join(SITE, decodeURI(url));
    if (url.endsWith("/")) target = path.join(target, "index.html");
    if (!(await exists(target))) errors.push(`${rel}: 깨진 내부 링크 ${url}`);
  }
}

if (!(await exists(path.join(SITE, "sitemap.xml")))) errors.push("sitemap.xml 없음");

if (errors.length) {
  console.error(`검수 실패 ${errors.length}건`);
  for (const e of errors) console.error(" - " + e);
  process.exit(1);
}
console.log(`검수 통과: HTML ${htmlFiles.length}개`);
