// One-shot image optimization. Run: node scripts/optimize-images.mjs
import sharp from 'sharp';
import { readdir, mkdir, copyFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd(), 'public');
const BACKUP = path.resolve(process.cwd(), '.image-originals');

async function ensureBackup(rel) {
  const dst = path.join(BACKUP, rel);
  await mkdir(path.dirname(dst), { recursive: true });
  if (!existsSync(dst)) await copyFile(path.join(ROOT, rel), dst);
}

async function processJpg(rel, { maxWidth, quality }) {
  await ensureBackup(rel);
  const src = path.join(BACKUP, rel);
  const dst = path.join(ROOT, rel);
  const before = (await stat(dst)).size;
  await sharp(src)
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true })
    .jpeg({ quality, mozjpeg: true, progressive: true })
    .toFile(dst);
  const after = (await stat(dst)).size;
  console.log(`  ${rel}: ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`);
}

async function processFavicon() {
  const rel = 'favicon.png';
  await ensureBackup(rel);
  const src = path.join(BACKUP, rel);
  const dst = path.join(ROOT, rel);
  const before = (await stat(dst)).size;
  await sharp(src)
    .resize({ width: 64, height: 64, fit: 'cover' })
    .png({ compressionLevel: 9, palette: true })
    .toFile(dst);
  const after = (await stat(dst)).size;
  console.log(`  ${rel}: ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`);
}

async function processWechat() {
  const rel = 'wechat.png';
  const dst = path.join(ROOT, rel);
  if (!existsSync(dst)) return;
  await ensureBackup(rel);
  const src = path.join(BACKUP, rel);
  const before = (await stat(dst)).size;
  await sharp(src)
    .resize({ width: 360, withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true })
    .toFile(dst);
  const after = (await stat(dst)).size;
  console.log(`  ${rel}: ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`);
}

async function run() {
  console.log('-> papers/');
  const papersDir = path.join(ROOT, 'papers');
  for (const f of await readdir(papersDir)) {
    if (/\.(jpe?g)$/i.test(f)) {
      await processJpg(`papers/${f}`, { maxWidth: 800, quality: 78 });
    }
  }
  console.log('-> avatar');
  await processJpg('yc.jpg', { maxWidth: 512, quality: 86 });
  console.log('-> social logos');
  for (const f of await readdir(path.join(ROOT, 'soical_logo'))) {
    if (/\.(jpe?g)$/i.test(f)) {
      await processJpg(`soical_logo/${f}`, { maxWidth: 96, quality: 82 });
    }
  }
  console.log('-> favicon');
  await processFavicon();
  console.log('-> wechat (if present)');
  await processWechat();
  console.log('done');
}

run().catch((e) => { console.error(e); process.exit(1); });
