import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

export default function(eleventyConfig) {

  // Pass static assets through without processing
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");

  // Fonts: Phase 4 — WOFF2 files now live in src/fonts/
  eleventyConfig.addPassthroughCopy("src/fonts");

  // Images are now in src/images/ — handled by the plugin, not passthrough

  // Image optimisation — transforms every <img> in HTML output
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ["webp", "jpeg"],
    widths: [400, 800, 1200, "auto"],
    outputDir: "./_site/images/",
    urlPath: "/images/",
    defaultAttributes: {
      loading: "lazy",
      decoding: "async",
      sizes: "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px",
    },
    cacheOptions: {
      duration: "1d",
      directory: ".cache",
    },
  });

  // NOTE: *.html passthrough removed — all pages now served by Eleventy.

  return {
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
      layouts: "_includes/layouts",
    }
  };
}
