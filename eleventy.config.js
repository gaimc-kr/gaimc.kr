import fs from "node:fs";
import yaml from "js-yaml";
import matter from "gray-matter";
import markdownIt from "markdown-it";

// 언어: 한국어(기본, 주소 앞부분 없음), 영어(/en), 베트남어(/vi)
const LANGS = ["ko", "en", "vi"];
const PREFIX = { ko: "", en: "/en", vi: "/vi" };

const md = markdownIt({ html: true, linkify: false, breaks: false });
const toDate = (d) => (d instanceof Date ? d : new Date(d));

// 교수진 표시 순서: 특임명예교수 > 전임교수 > 초빙교수 > 겸임교수 > 강의초청교수 > 특강 연사, 구분 안에서는 order 후 가나다순
const CATEGORY_RANK = { 특임명예교수: 1, 전임교수: 2, 초빙교수: 3, 겸임교수: 4, 강의초청교수: 5, "특강 연사": 6 };

// 콘텐츠 항목(교수·행사·뉴스)을 언어별로 바꿈: 파일 안의 en:/vi: 묶음이 한국어 값을 덮어씀
function localize(item, lang, section) {
  const base = { ...item.data };
  const raw = lang !== "ko" && base[lang] && typeof base[lang] === "object" ? base[lang] : {};
  // 빈 번역 값은 무시하고 한국어 원본 사용
  const over = Object.fromEntries(Object.entries(raw).filter(([, v]) => v !== null && v !== "" && !(Array.isArray(v) && v.length === 0)));
  const data = { ...base, ...over };
  const slug = item.fileSlug;
  let body = "";
  if (section !== "faculty") {
    const src = over.body || matter(fs.readFileSync(item.inputPath, "utf8")).content;
    body = md.render(src || "");
  }
  return { lang, slug, section, data, date: item.date, body, url: `${PREFIX[lang]}/${section}/${slug}/` };
}

export default function (eleventyConfig) {
  // YAML 데이터 파일(_data/*.yml)과 관리자 화면(/admin)이 같은 형식을 사용
  eleventyConfig.addDataExtension("yml,yaml", (contents) => yaml.load(contents));
  eleventyConfig.addGlobalData("langs", { codes: LANGS, prefix: PREFIX });

  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy({ "src/CNAME": "CNAME" });
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });
  eleventyConfig.addWatchTarget("src/_content/");

  // 원본 컬렉션(한국어 파일)
  const byDateDesc = (a, b) => b.date - a.date;
  const events = (api) => api.getFilteredByGlob("src/events/items/*.md").filter((p) => !p.data.draft).sort(byDateDesc);
  const news = (api) => api.getFilteredByGlob("src/news/items/*.md").filter((p) => !p.data.draft).sort(byDateDesc);
  const faculty = (api) =>
    api
      .getFilteredByGlob("src/faculty/people/*.md")
      .filter((p) => !p.data.draft)
      .sort(
        (a, b) =>
          (CATEGORY_RANK[a.data.category] ?? 9) - (CATEGORY_RANK[b.data.category] ?? 9) ||
          (a.data.order ?? 999) - (b.data.order ?? 999) ||
          a.data.name.localeCompare(b.data.name, "ko")
      );
  eleventyConfig.addGlobalData("facultyCategories", ["특임명예교수", "전임교수", "초빙교수", "겸임교수", "강의초청교수"]);

  // 언어별 목록: collections.l10n.ko.events 처럼 사용
  eleventyConfig.addCollection("l10n", (api) => {
    const out = {};
    for (const lang of LANGS) {
      out[lang] = {
        events: events(api).map((p) => localize(p, lang, "events")),
        news: news(api).map((p) => localize(p, lang, "news")),
        faculty: faculty(api).map((p) => localize(p, lang, "faculty")),
      };
    }
    return out;
  });
  // 상세 페이지 생성용(언어 × 항목)
  eleventyConfig.addCollection("facultyPages", (api) =>
    LANGS.flatMap((lang) => faculty(api).filter((p) => p.data.has_profile).map((p) => localize(p, lang, "faculty")))
  );
  eleventyConfig.addCollection("eventPages", (api) => LANGS.flatMap((lang) => events(api).map((p) => localize(p, lang, "events"))));
  eleventyConfig.addCollection("newsPages", (api) => LANGS.flatMap((lang) => news(api).map((p) => localize(p, lang, "news"))));

  // 주소 앞에 언어 붙이기: {{ "/about/" | L(lang) }}
  eleventyConfig.addFilter("L", (path, lang) => (String(path).startsWith("/") ? `${PREFIX[lang] || ""}${path}` : path));
  // 같은 페이지의 다른 언어 주소
  eleventyConfig.addFilter("switchLang", (url, target) => {
    let bare = String(url || "/").replace(/^\/(en|vi)(?=\/)/, "") || "/";
    if (!bare.endsWith("/")) bare = "/"; // 404 등 언어별 쌍이 없는 페이지는 각 언어 홈으로
    return `${PREFIX[target]}${bare}`;
  });

  // 날짜 표기
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const fmt = (x, lang) => {
    const y = x.getUTCFullYear(), m = x.getUTCMonth() + 1, d = x.getUTCDate();
    if (lang === "en") return `${MONTHS[m - 1]} ${d}, ${y}`;
    if (lang === "vi") return `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${y}`;
    return `${y}. ${m}. ${d}.`;
  };
  eleventyConfig.addFilter("ldate", (d, lang = "ko") => fmt(toDate(d), lang));
  eleventyConfig.addFilter("lrange", (start, end, lang = "ko") => {
    const a = toDate(start);
    if (!end) return fmt(a, lang);
    const b = toDate(end);
    if (a.getTime() === b.getTime()) return fmt(a, lang);
    if (lang === "ko" && a.getUTCFullYear() === b.getUTCFullYear()) return `${fmt(a, lang)} ~ ${b.getUTCMonth() + 1}. ${b.getUTCDate()}.`;
    return `${fmt(a, lang)} – ${fmt(b, lang)}`;
  });
  eleventyConfig.addFilter("isoDate", (d) => toDate(d).toISOString().slice(0, 10));
  eleventyConfig.addFilter("year", (d) => toDate(d).getUTCFullYear());

  eleventyConfig.addFilter("where", (arr, key, value) => (arr || []).filter((x) => x.data?.[key] === value || x[key] === value));
  eleventyConfig.addFilter("uniqueValues", (arr, key) => [...new Set((arr || []).map((x) => x[key]))]);
  // "[KCI] 제목" 형식의 항목을 구분 표시와 본문으로 나눔
  eleventyConfig.addFilter("tagSplit", (item) => {
    const m = String(item).match(/^\[([^\]]{1,20})\]\s*(.*)$/s);
    return m ? { tag: m[1], text: m[2] } : { tag: "", text: String(item) };
  });
  // 목록 항목 안의 DOI·URL을 새 창 링크로 바꿈(나머지 글자는 이스케이프)
  const esc = (x) => String(x).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  eleventyConfig.addFilter("linkify", (text, newWin = "(새 창)") =>
    esc(text).replace(/https?:\/\/[^\s<]+[^\s<.,)]/g, (u) => `<a href="${u}" target="_blank" rel="noopener">${u}<span class="sr-only">${newWin}</span></a>`)
  );
  eleventyConfig.addFilter("limit", (arr, n) => (arr || []).slice(0, n));
  eleventyConfig.addFilter("groupByYear", (arr) => {
    const m = new Map();
    for (const p of arr || []) {
      const y = toDate(p.date).getUTCFullYear();
      if (!m.has(y)) m.set(y, []);
      m.get(y).push(p);
    }
    return [...m.entries()].map(([year, items]) => ({ year, items }));
  });
  eleventyConfig.addFilter("findBySlug", (arr, slug) => (arr || []).find((p) => p.slug === slug));
  eleventyConfig.addFilter("initial", (name) => (name || "").trim().charAt(0));
  eleventyConfig.addFilter("pad2", (n) => String(n).padStart(2, "0"));

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"],
  };
}
