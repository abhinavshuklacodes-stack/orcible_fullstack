import axios from "axios";
import * as cheerio from "cheerio";

const MAX_CHARS = 20000;

/**
 * Fetch a URL and pull out a rough plain-text version of its main content.
 * This stands in for the sketch's "carry the chat link to a PDF, then a Markdown file" step:
 * same end result (readable text we can summarize), without a headless-browser dependency.
 */
export async function extractTextFromUrl(url) {
  const { data: html } = await axios.get(url, {
    timeout: 15000,
    headers: { "User-Agent": "Mozilla/5.0 (compatible; OrcibleBot/1.0)" },
  });

  const $ = cheerio.load(html);
  $("script, style, nav, footer, noscript").remove();

  const text = $("body").text().replace(/\s+/g, " ").replace(/\s+\n/g, "\n").trim();

  return text.slice(0, MAX_CHARS);
}
