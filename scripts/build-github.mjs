import { spawnSync } from 'node:child_process';
import { readFileSync, existsSync, mkdirSync, renameSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const result = spawnSync('pnpm', ['exec', 'vinext', 'build'], {
  stdio: 'inherit',
  env: { ...process.env, GITHUB_PAGES: 'true' },
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

const manifest = JSON.parse(readFileSync('dist/server/vinext-prerender.json', 'utf8'));
const pages = ['/', '/teaching', '/contact'];
for (const route of pages) {
  if (!manifest.routes.some((item) => item.route === route && item.status === 'rendered')) {
    throw new Error(`Static page missing: ${route}`);
  }
}
// Vinext beta redirects slash-suffixed routes during export. Export without
// slash redirects, then use directory index files for GitHub Pages clean URLs.
for (const route of ['teaching', 'contact']) {
  mkdirSync(`dist/client/${route}`, { recursive: true });
  renameSync(`dist/client/${route}.html`, `dist/client/${route}/index.html`);
}
writeFileSync('dist/client/.nojekyll', '');
for (const route of pages) {
  const filename = route === '/' ? 'dist/client/index.html' : `dist/client${route}/index.html`;
  const html = readFileSync(filename, 'utf8');
  if (!html.includes('<h1') || !html.includes('<nav')) throw new Error(`Incomplete page: ${route}`);
  for (const match of html.matchAll(/(?:src|href)="(\/_next\/[^"?#]+)[^"]*"/g)) {
    if (!existsSync(resolve('dist/client', `.${match[1]}`))) throw new Error(`Missing asset: ${match[1]}`);
  }
}
console.log('GitHub Pages ready: all 3 pages and referenced assets verified in dist/client.');
