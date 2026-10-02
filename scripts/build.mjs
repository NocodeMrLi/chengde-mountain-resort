import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

const digest = (bytes) => createHash('sha256').update(bytes).digest('hex').slice(0, 12);
const publicRoot = 'public';

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const children = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? listFiles(path) : [path];
  }));
  return children.flat();
}

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
await cp(publicRoot, 'dist', { recursive: true });

const assetHashes = {};
for (const path of await listFiles(publicRoot)) {
  const key = relative(publicRoot, path).split(sep).join('/');
  assetHashes[key] = digest(await readFile(path));
}

const app = await readFile('app.js', 'utf8');
const style = (await readFile('style.css', 'utf8')).replace(
  /url\((['"])(\.\/(?:art|audio)\/[^'"]+)\1\)/g,
  (match, quote, url) => {
    const key = url.slice(2);
    return `url(${quote}${url}?v=${assetHashes[key]}${quote})`;
  }
);
const appFile = `app.${digest(app)}.js`;
const styleFile = `style.${digest(style)}.css`;
await writeFile(join('dist', appFile), app);
await writeFile(join('dist', styleFile), style);

const manifest = JSON.stringify(assetHashes).replaceAll('<', '\\u003c');
const buildId = (process.env.GITHUB_SHA || digest(app + style + manifest)).slice(0, 12);
let html = await readFile('index.html', 'utf8');
html = html.replace('<html lang="zh-CN"', `<html lang="zh-CN" data-build="${buildId}"`);
html = html.replace(/(href|src)="\.\/((?:art|audio)\/[^\"]+)"/g,
  (match, attribute, key) => `${attribute}="./${key}?v=${assetHashes[key]}"`);
html = html.replace('href="./style.css"', `href="./${styleFile}"`);
html = html.replace('<script type="module" src="./app.js"></script>',
  `<script>window.__ASSET_HASHES__=${manifest}</script>\n    <script type="module" src="./${appFile}"></script>`);
html = html.replace('src="./region.js"', `src="./region.js?v=${assetHashes['region.js']}"`);
await writeFile(join('dist', 'index.html'), html);
await writeFile(join('dist', '.nojekyll'), '');
await writeFile(join('dist', 'deployment.json'), JSON.stringify({ build: buildId, app: appFile, style: styleFile }) + '\n');
console.log(`已生成 dist/ 静态网站（${buildId}）`);
