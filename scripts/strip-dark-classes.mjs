// One-shot: strip `dark:*` Tailwind classes from .tsx files in src/.
// Run: node scripts/strip-dark-classes.mjs
import { readFile, writeFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(process.cwd(), 'src');
const TOKEN = /\bdark:[A-Za-z0-9_\-\/\[\]\(\)\.,]+/g;
let totalFiles = 0;
let totalReplacements = 0;

async function walk(dir) {
  for (const entry of await readdir(dir)) {
    const p = path.join(dir, entry);
    const s = await stat(p);
    if (s.isDirectory()) await walk(p);
    else if (/\.(tsx|ts)$/.test(entry)) await processFile(p);
  }
}

async function processFile(file) {
  const src = await readFile(file, 'utf-8');
  if (!src.includes('dark:')) return;

  // Strip the dark: token and clean up the resulting double-spaces inside class strings.
  let out = src.replace(TOKEN, '');
  // Normalize multi-spaces inside JSX-style className strings only, not whole file.
  out = out.replace(/className=(["'`])([^"'`]*?)\1/g, (m, q, content) => {
    const cleaned = content.replace(/\s{2,}/g, ' ').replace(/\s+(["'`])/g, '$1').trim();
    return `className=${q}${cleaned}${q}`;
  });
  // Also clean cn(...) string literals (very common in this codebase).
  out = out.replace(/(["'`])([^"'`\n]*?)\1/g, (m, q, content) => {
    if (!/[\w\-]+:?[\w\-]+/.test(content)) return m;
    if (content === m.slice(1, -1)) {
      const cleaned = content.replace(/\s{2,}/g, ' ');
      return `${q}${cleaned}${q}`;
    }
    return m;
  });

  if (out !== src) {
    const before = (src.match(TOKEN) || []).length;
    await writeFile(file, out);
    totalFiles++;
    totalReplacements += before;
    console.log(`  ${path.relative(process.cwd(), file)}: -${before} dark: tokens`);
  }
}

await walk(ROOT);
console.log(`\nDone. Files modified: ${totalFiles}. Tokens removed: ${totalReplacements}.`);
