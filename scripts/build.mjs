import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

const digest = (bytes) => createHash('sha256').update(bytes).digest('hex').slice(0, 12);
const publicRoot = 'public';
// 景绘原图与旧版本留在 public 归档；发布包使用压缩后的 WebP。
const excludedBuildAssets = new Set([
  // Generation provenance stays in the source repository, outside the runtime.
  'audio/guide-manifest.json',
  'art/deer-doe-alert.png',
  'art/deer-doe-graze.png',
  'art/deer-stag-alert.png',
  'art/deer-stag-graze.png',
  'art/deer-stag-walk.png',
  'art/hammer-foreground.png',
  'art/lake-foreground.png',
  'art/painted-boat.png',
  'art/palace-foreground.png',
  'art/person-blue-man.png',
  'art/person-blue-woman.png',
  'art/person-green-man.png',
  'art/person-ochre-woman.png',
  'art/person-pavilion-pair.png',
  'art/person-red.png',
  'art/person-terrace-pair.png',
  'art/plains-foreground.png',

  'art/hammer-close.png',
  'art/jinshan-moonlight-clean.png',
  'art/jinshan-moonlight.png',
  'art/lake-passage-no-sun.png',
  'art/lake-passage.png',
  'art/mountain-view.png',
  'art/near-danbo.png',
  'art/near-deer.png',
  'art/near-dike.png',
  'art/near-jinshan.png',
  'art/near-lizheng.png',
  'art/near-moon.png',
  'art/near-shuixin.png',
  'art/near-simian.png',
  'art/near-wanshu.png',
  'art/near-wenjin.png',
  'art/near-yanyu.png',
  'art/palace-hall.png',
  'art/plains-wenyuan-clean.png',
  'art/plains-wenyuan.png',
  'art/yan-yu-lake-clean.png',
  'art/yan-yu-lake.png'
]);
const assetKey = (path) => relative(publicRoot, path).split(sep).join('/');
const includeAsset = (path) => !excludedBuildAssets.has(assetKey(path));

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
await cp(publicRoot, 'dist', { recursive: true, filter: includeAsset });

const assetHashes = {};
for (const path of await listFiles(publicRoot)) {
  if (!includeAsset(path)) continue;
  const key = assetKey(path);
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
