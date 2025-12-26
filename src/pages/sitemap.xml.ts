import type { APIRoute } from "astro";
import { site } from "@content/site";
import { getCollection } from "astro:content";

export const GET: APIRoute = async () => {
  const posts = await getCollection("articles");
  const pages = ["/", "/quienes-somos", "/actividades-y-servicios", "/tca", "/contactar", "/blog", "/legal/aviso-legal", "/legal/politica-privacidad", "/legal/politica-cookies"];

  const urls = pages
    .map((p) => {
      return `<url><loc>${site.url}${p}</loc></url>`;
    })
    .join("");

  const postsXml = posts
    .map((post) => `<url><loc>${site.url}/blog/${post.slug}</loc><lastmod>${post.data.date.toISOString()}</lastmod></url>`)
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}${postsXml}</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
};