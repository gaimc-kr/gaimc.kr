import yaml from "js-yaml";

export default function (eleventyConfig) {
  // YAML 데이터 파일(_data/*.yml)과 관리자 화면(/admin)이 같은 형식을 사용
  eleventyConfig.addDataExtension("yml,yaml", (contents) => yaml.load(contents));

  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy({ "src/CNAME": "CNAME" });
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });

  // 컬렉션: 날짜 최신순
  const byDateDesc = (a, b) => b.date - a.date;
  eleventyConfig.addCollection("events", (api) =>
    api.getFilteredByGlob("src/events/items/*.md").filter((p) => !p.data.draft).sort(byDateDesc)
  );
  eleventyConfig.addCollection("news", (api) =>
    api.getFilteredByGlob("src/news/items/*.md").filter((p) => !p.data.draft).sort(byDateDesc)
  );
  // 교수진 표시 순서: 특임명예교수 > 전임교수 > 초빙교수 > 겸임교수, 구분 안에서는 order 후 가나다순
  // 특강 연사도 같은 폴더에 두고(제출 자료가 있으면 상세 페이지 생성), 교수진 페이지 하단 구역에 따로 표시
  const CATEGORY_RANK = { 특임명예교수: 1, 전임교수: 2, 초빙교수: 3, 겸임교수: 4, "특강 연사": 5 };
  eleventyConfig.addGlobalData("facultyCategories", ["특임명예교수", "전임교수", "초빙교수", "겸임교수"]);
  eleventyConfig.addCollection("faculty", (api) =>
    api
      .getFilteredByGlob("src/faculty/people/*.md")
      .filter((p) => !p.data.draft)
      .sort(
        (a, b) =>
          (CATEGORY_RANK[a.data.category] ?? 9) - (CATEGORY_RANK[b.data.category] ?? 9) ||
          (a.data.order ?? 999) - (b.data.order ?? 999) ||
          a.data.name.localeCompare(b.data.name, "ko")
      )
  );

  // 날짜 표기: 2026. 8. 18.
  const toDate = (d) => (d instanceof Date ? d : new Date(d));
  eleventyConfig.addFilter("krDate", (d) => {
    const x = toDate(d);
    return `${x.getUTCFullYear()}. ${x.getUTCMonth() + 1}. ${x.getUTCDate()}.`;
  });
  eleventyConfig.addFilter("isoDate", (d) => toDate(d).toISOString().slice(0, 10));
  eleventyConfig.addFilter("year", (d) => toDate(d).getUTCFullYear());

  // 기간 표기: 같은 해·같은 달이면 뒷부분 생략
  eleventyConfig.addFilter("krRange", (start, end) => {
    const a = toDate(start);
    const s = `${a.getUTCFullYear()}. ${a.getUTCMonth() + 1}. ${a.getUTCDate()}.`;
    if (!end) return s;
    const b = toDate(end);
    if (a.getTime() === b.getTime()) return s;
    if (a.getUTCFullYear() === b.getUTCFullYear()) return `${s} ~ ${b.getUTCMonth() + 1}. ${b.getUTCDate()}.`;
    return `${s} ~ ${b.getUTCFullYear()}. ${b.getUTCMonth() + 1}. ${b.getUTCDate()}.`;
  });

  eleventyConfig.addFilter("where", (arr, key, value) => (arr || []).filter((x) => x.data?.[key] === value || x[key] === value));
  eleventyConfig.addFilter("uniqueValues", (arr, key) => [...new Set((arr || []).map((x) => x[key]))]);
  // "[KCI] 제목" 형식의 항목을 구분 표시와 본문으로 나눔
  eleventyConfig.addFilter("tagSplit", (item) => {
    const m = String(item).match(/^\[([^\]]{1,12})\]\s*(.*)$/s);
    return m ? { tag: m[1], text: m[2] } : { tag: "", text: String(item) };
  });
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
  eleventyConfig.addFilter("findBySlug", (arr, slug) => (arr || []).find((p) => p.fileSlug === slug));
  eleventyConfig.addFilter("initial", (name) => (name || "").trim().charAt(0));
  eleventyConfig.addFilter("pad2", (n) => String(n).padStart(2, "0"));

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"],
  };
}
