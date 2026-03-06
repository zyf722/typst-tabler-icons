import * as cheerio from "cheerio";
import { readFile, writeFile } from "fs/promises";

/**
 * @typedef {Object} IconData
 * @property {string} name
 * @property {string} unicode
 * @property {string} font
 */

/**
 * @typedef {Object} ParsedResult
 * @property {string} version
 * @property {IconData[]} icons
 */

/**
 * Extracts icon and version information from the HTML document provided by Tabler Icons.
 *
 * @param {string} filePath - Path to the HTML file.
 * @param {string} fontFamily - The font family name associated with this HTML file.
 * @param {string} suffix - A suffix to differentiate between outline and filled icons (e.g., "outline" or "filled").
 * @returns {Promise<ParsedResult>} An object containing the version and icon data.
 */
const parseHtml = async (filePath, fontFamily, suffix = "") => {
  const html = await readFile(filePath, "utf8");
  const $ = cheerio.load(html);

  // Extract version number
  const version = $("header > .text-muted").text().replace("version ", "v");

  // Extract all icons
  const icons = $(".tabler-icon")
    .map((_, el) => {
      const name = $(el).find("strong").text() + (suffix ? `-${suffix}` : "");
      // Get the raw code (e.g., &xea12;) and convert it to Typst format (\u{ea12})
      const rawCode = $(el).find(".tabler-icon-codes :nth-child(3)").text();
      const unicode = `\\u{${rawCode.slice(1)}}`;

      return { name, unicode, font: fontFamily };
    })
    .get();

  return { version, icons };
};

const main = async () => {
  const [outlineInput, filledInput, libOutput, galleryOutput] =
    process.argv.slice(2);

  const outlineData = await parseHtml(outlineInput, "tabler-icons");
  const filledData = await parseHtml(filledInput, "tabler-icons", "filled");

  const version = outlineData.version;
  if (version !== filledData.version) {
    console.error(
      `Error: Version mismatch between outline (${outlineData.version}) and filled (${filledData.version}) icons. Using version from outline icons.`,
    );
    process.exit(1);
  }

  const allIcons = [...outlineData.icons, ...filledData.icons];

  const libCode = `// Generated based on Tabler Icons ${version}

#import "lib-impl.typ": tabler-icon

#let tabler-icon-map = (
${allIcons
  .map(
    ({ name, unicode, font }) =>
      `  "${name}": (unicode: "${unicode}", font: "${font}")`,
  )
  .join(",\n")}
)

${allIcons
  .map(
    ({ name, unicode, font }) =>
      `#let ti-${name} = tabler-icon.with("${unicode}", font: "${font}")`,
  )
  .join("\n")}
`;

  const galleryCode = `// Generated based on Tabler Icons ${version}

#import "../src/lib.typ": *

#table(
  columns: 6,
  stroke: none,
${allIcons
  .map(
    ({ name, unicode }) =>
      `  figure([#ti-${name}(size: 2em)], caption: [\`${unicode}\` \\ #text([\`${name}\` \\ \`\`\`typst #ti-${name}()\`\`\`], size: 0.75em)], supplement: none)`,
  )
  .join(",\n")}
)`;

  // Write to output file
  await writeFile(libOutput, libCode);
  await writeFile(galleryOutput, galleryCode);
};

main();
