import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.join(process.cwd(), "public", "images", "properties");

const PALETTES = {
  House: ["#8fa88a", "#a8b5a0", "#7a9480"],
  Flat: ["#a89f8f", "#b8aea0", "#968c7c"],
  Villa: ["#7d9a8e", "#8faaa0", "#6d8a7e"],
  Plot: ["#9aaa7a", "#aab88a", "#8a9a6a"],
  PG: ["#8a8faa", "#9a9fba", "#7a7f9a"],
  Commercial: ["#9a8a8a", "#aa9a9a", "#8a7a7a"],
};

async function createImage(filePath, color, index) {
  const base = sharp({
    create: {
      width: 1200,
      height: 800,
      channels: 3,
      background: color,
    },
  });

  const overlay = Buffer.from(
    `<svg width="1200" height="800" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:white;stop-opacity:0.18"/>
          <stop offset="100%" style="stop-color:white;stop-opacity:0"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#g)"/>
      <circle cx="${200 + index * 180}" cy="${180 + index * 40}" r="280" fill="white" opacity="0.06"/>
      <circle cx="${900 - index * 60}" cy="${620}" r="220" fill="white" opacity="0.05"/>
    </svg>`,
  );

  await base
    .composite([{ input: overlay, top: 0, left: 0 }])
    .webp({ quality: 82 })
    .toFile(filePath);

  const blur = await sharp(filePath).resize(16, 10, { fit: "cover" }).webp({ quality: 40 }).toBuffer();
  return `data:image/webp;base64,${blur.toString("base64")}`;
}

async function main() {
  const contentDir = path.join(process.cwd(), "content", "properties");
  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".mdx"));

  const blurMap = {};

  for (const file of files) {
    const raw = fs.readFileSync(path.join(contentDir, file), "utf8");
    const slugMatch = raw.match(/^slug:\s*(.+)$/m);
    const typeMatch = raw.match(/^propertyType:\s*(.+)$/m);
    if (!slugMatch) continue;

    const slug = slugMatch[1].trim();
    const propertyType = (typeMatch?.[1] ?? "House").trim();
    const palette = PALETTES[propertyType] ?? PALETTES.House;

    const dir = path.join(ROOT, slug);
    fs.mkdirSync(dir, { recursive: true });

    const images = ["cover", "1", "2"];
    const blurs = [];

    for (let i = 0; i < images.length; i++) {
      const name = images[i] === "cover" ? "cover.webp" : `${images[i]}.webp`;
      const filePath = path.join(dir, name);
      const blur = await createImage(filePath, palette[i % palette.length], i);
      blurs.push(blur);
    }

    blurMap[slug] = blurs[0];
  }

  fs.writeFileSync(
    path.join(process.cwd(), "lib", "image-blur.json"),
    JSON.stringify(blurMap, null, 2),
  );

  console.log(`Generated images for ${Object.keys(blurMap).length} properties.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
