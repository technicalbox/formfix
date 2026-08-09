import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = "https://www.formfix.me";
const TODAY = new Date().toISOString().split("T")[0];

// Load presets data
const presetsPath = path.join(__dirname, "../src/data/presets.json");
const presetsData = JSON.parse(fs.readFileSync(presetsPath, "utf-8"));

// Static routes
const staticRoutes = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/check-image", priority: "0.9", changefreq: "weekly" },
  { path: "/tools/resize", priority: "0.8", changefreq: "monthly" },
  { path: "/tools/crop", priority: "0.8", changefreq: "monthly" },
  { path: "/tools/compress", priority: "0.8", changefreq: "monthly" },
  { path: "/tools/convert", priority: "0.8", changefreq: "monthly" },
  { path: "/about", priority: "0.5", changefreq: "monthly" },
  { path: "/contact", priority: "0.5", changefreq: "monthly" },
  { path: "/privacy", priority: "0.3", changefreq: "yearly" },
  { path: "/terms", priority: "0.3", changefreq: "yearly" },
];

// Preset routes
const presetRoutes = (presetsData.presets || []).map((p) => ({
  path: `/${p.slug}`,
  priority: "0.8",
  changefreq: "weekly",
}));

// Compression target routes
const compressionRoutes = (presetsData.compressionTargets || []).map((c) => ({
  path: `/${c.slug}`,
  priority: "0.7",
  changefreq: "monthly",
}));

const allRoutes = [...staticRoutes, ...presetRoutes, ...compressionRoutes];

// Generate sitemap.xml
const urlEntries = allRoutes
  .map(
    (r) => `  <url>
    <loc>${SITE_URL}${r.path}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  )
  .join("\n");

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;

// Generate sitemap-index.xml (for legacy Astro Search Console compatibility)
const sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/sitemap.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
</sitemapindex>
`;

const publicDir = path.join(__dirname, "../public");

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write sitemap files
fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemapXml, "utf-8");
fs.writeFileSync(path.join(publicDir, "sitemap-0.xml"), sitemapXml, "utf-8");
fs.writeFileSync(path.join(publicDir, "sitemap-index.xml"), sitemapIndexXml, "utf-8");

console.log(`[Sitemap Generator] Successfully generated sitemap.xml with ${allRoutes.length} URLs.`);
