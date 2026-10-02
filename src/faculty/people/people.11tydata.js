// 교수별 상세 페이지: 제출 프로필이 있는 교수(has_profile: true)만 /faculty/<slug>/ 페이지 생성
export default {
  layout: "layouts/faculty-detail.njk",
  eleventyComputed: {
    permalink: (data) => (data.has_profile && !data.draft ? `/faculty/${data.page.fileSlug}/` : false),
    title: (data) => data.name,
  },
};
