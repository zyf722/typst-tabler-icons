import * as cheerio from "cheerio";
import { readFile, writeFile } from "fs/promises";

const main = async () => {
  const [input, libOutput, galleryOutput] = process.argv.slice(2);

  // Read tabler-icons.html
  const html = await readFile(input, "utf8");
  const $ = cheerio.load(html);
  const version = $("header > .text-muted").text().replace("version ", "v");

  // Find all icons
  const icons = $(".tabler-icon")
    .map((_, el) => {
      const name = $(el).find("strong").text();
      const unicode = `\\u{${$(el)
        .find(".tabler-icon-codes :nth-child(3)")
        .text()
        .slice(1)}}`;
      return { name, unicode };
    })
    .get();

  // Generate Typst code
  const libCode = `// Generated based on Tabler Icons ${version}

#import "lib-impl.typ": tabler-icon

#let tabler-icon-map = (
${icons.map(({ name, unicode }) => `  "${name}": "${unicode}"`).join(",\n")}
)

${icons
      .map(
        ({ name, unicode }) => `#let ti-${name} = tabler-icon.with("${unicode}")`
      )
      .join("\n")}
`;

  const galleryCode = `// Generated based on Tabler Icons ${version}

#import "../src/lib.typ": *

#table(
  columns: 6,
  stroke: none,
${icons.map(({ name, unicode }) => `  figure([#ti-${name}(size: 2em)], caption: [\`${unicode}\` \\ #text([\`${name}\` \\ \`\`\`typst #ti-${name}()\`\`\`], size: 0.75em)], supplement: none)`).join(",\n")}
)`;

  // Write to output file
  await writeFile(libOutput, libCode);
  await writeFile(galleryOutput, galleryCode);
};

main();
