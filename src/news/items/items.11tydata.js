export default {
  layout: "layouts/post.njk",
  eleventyComputed: {
    permalink: (data) => (data.draft ? false : `/news/${data.page.fileSlug}/`),
  },
};
