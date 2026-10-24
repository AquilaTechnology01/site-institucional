const SITE_BASE = process.env.SITE_BASE || 'http://127.0.0.1:4173';
const {chromium} = require('playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({executablePath: process.env.BROWSER_EXECUTABLE || '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox']});
  try {
    const page = await browser.newPage();
    await page.addInitScript(() => {
      window.cspViolations = [];
      document.addEventListener('securitypolicyviolation', e => window.cspViolations.push(e.effectiveDirective));
    });
    for (const path of ['/', '/portfolio/', '/FAQ.html', '/pdv.html', '/blog.html', '/privacidade.html', '/termos.html', '/lgpd.html']) {
      await page.goto(SITE_BASE + path);
      assert.deepEqual(await page.evaluate(() => window.cspViolations), [], path);
    }
    await page.evaluate(() => {
      const script = document.createElement('script');
      script.textContent = 'window.injected = true';
      document.body.append(script);
    });
    assert.equal(await page.evaluate(() => window.injected), undefined);
    const noJS = await browser.newContext({javaScriptEnabled: false, reducedMotion: 'reduce'});
    const fallback = await noJS.newPage();
    await fallback.goto(SITE_BASE + '/');
    await fallback.locator('#nome').fill('Teste');
    await fallback.locator('#email').fill('teste@example.com');
    await fallback.locator('#assunto').fill('Teste de segurança');
    await fallback.locator('#mensagem').fill('Mensagem de teste para verificar o formulário.');
    let submissions = 0;
    fallback.on('request', req => { if (req.isNavigationRequest()) submissions++; });
    await fallback.locator('button[type="submit"]').click({noWaitAfter: true});
    await fallback.waitForTimeout(300);
    assert.equal(submissions, 0, 'Formulário sem JavaScript não deve transmitir dados');
    console.log('PASS: 8 páginas sem violações CSP; script inline bloqueado; formulário sem JS não transmite dados.');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exit(1); });
