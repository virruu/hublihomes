import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "content", "properties");

for (const file of fs.readdirSync(contentDir).filter((f) => f.endsWith(".json"))) {
  const data = JSON.parse(fs.readFileSync(path.join(contentDir, file), "utf8"));
  const { description, owner: _owner, gradient: _gradient, gallery: _gallery, ...frontmatter } = data;

  const coverImage = `/images/properties/${data.slug}/cover.webp`;
  const gallery = [
    `/images/properties/${data.slug}/1.webp`,
    `/images/properties/${data.slug}/2.webp`,
  ];

  const mdx = matter.stringify(description, {
    ...frontmatter,
    coverImage,
    gallery,
  });

  const outPath = path.join(contentDir, `${data.slug}.mdx`);
  fs.writeFileSync(outPath, mdx);
  fs.unlinkSync(path.join(contentDir, file));
  console.log(`Converted ${file} → ${data.slug}.mdx`);
}
