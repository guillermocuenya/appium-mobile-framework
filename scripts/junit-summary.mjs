// Turns the JUnit XML files into a Markdown table for the GitHub Actions job summary.
import fs from 'node:fs';
import path from 'node:path';

const dir = path.resolve('reports/junit');
const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.xml')) : [];
const rows = [];
let total = 0;
let failed = 0;
for (const f of files) {
  const xml = fs.readFileSync(path.join(dir, f), 'utf8');
  for (const m of xml.matchAll(/<testcase[^>]*classname="([^"]*)"[^>]*name="([^"]*)"[^>]*time="([^"]*)"[^>]*?(\/>|>([\s\S]*?)<\/testcase>)/g)) {
    const ok = !/<failure|<error/.test(m[5] ?? '');
    total += 1;
    if (!ok) failed += 1;
    rows.push(`| ${ok ? '✅' : '❌'} | ${m[1]} | ${m[2]} | ${Number(m[3]).toFixed(1)} s |`);
  }
}
const out = [
  `### 📱 Android E2E — ${total - failed}/${total} passed`,
  '',
  '| | Suite | Test | Time |',
  '|---|---|---|---|',
  ...rows,
].join('\n');
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, out + '\n');
console.log(out);
