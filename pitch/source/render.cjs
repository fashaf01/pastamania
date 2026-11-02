const { chromium } = require('playwright'); const path = require('path');
const [,, html, outDir, scale] = process.argv;
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: +scale || 1 });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('file://' + path.resolve(html) + '?print', { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  const bad = await p.evaluate(() => [...document.images].filter(i => !i.complete || !i.naturalWidth).map(i => i.src.slice(0, 80)));
  console.log('broken images:', bad, '| errors:', errs);
  const slides = await p.$$('.slide');
  for (let i = 0; i < slides.length; i++) await slides[i].screenshot({ path: `${outDir}/s${String(i + 1).padStart(2, '0')}.png` });
  console.log('slides', slides.length);
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
