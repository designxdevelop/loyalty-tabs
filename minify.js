const minify = require("html-minifier").minify;
const { watch } = require("fs");

const sourceFile = "loyalty-tabs.html";
const minifiedFile = "loyalty-tabs.min.html";

const minifyOptions = {
  collapseWhitespace: true,
  removeComments: true,
  minifyCSS: true,
  minifyJS: true,
  removeAttributeQuotes: true,
  removeEmptyAttributes: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true,
  processConditionalComments: true,
};

async function minifyFile() {
  try {
    const content = await Bun.file(sourceFile).text();
    const minified = minify(content, minifyOptions);
    await Bun.write(minifiedFile, minified);
    console.log(`✨ Minified ${sourceFile} -> ${minifiedFile}`);
  } catch (err) {
    console.error("Error during minification:", err);
  }
}

// Run initial minification
minifyFile();

// Watch for changes
watch(sourceFile, async (eventType, filename) => {
  if (filename) {
    console.log(`${filename} changed, minifying...`);
    await minifyFile();
  }
});

console.log(`🔍 Watching ${sourceFile} for changes...`);
