const {chromium} = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;
const assert = require('node:assert/strict');
const base = process.env.SITE_BASE || 'http://127.0.0.1:4181';
(async () => {
  const browser = await chromium.launch({executablePath: process.env.BROWSER_EXECUTABLE || '/usr/bin/google-chrome', args:['--no-sandbox']});
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    const errors = [], requests = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('request', r => requests.push(r.url()));
    await page.addInitScript(() => {
      window.sliderCSP = [];
      document.addEventListener('securitypolicyviolation', e => window.sliderCSP.push(e.effectiveDirective));
    });
    await page.clock.install();
    await page.goto(base);
    await page.locator('.executive-controls:not([hidden])').waitFor();
    await page.waitForFunction(() => document.querySelector('.executive-slide img').naturalWidth > 0);
    assert.equal(requests.some(url => url.includes('/executive/systems-') || url.includes('/executive/connections-')), false, 'ilustrações seguintes fora do caminho inicial');
    await page.getByRole('button',{name:'Fechar aviso de privacidade'}).click();
    await page.mouse.move(0,0);
    const slider = page.locator('.executive-slider');
    async function active(index) { await page.waitForFunction(i => document.querySelector(`[data-slide-to="${i}"]`).getAttribute('aria-current') === 'true', index); }
    await page.waitForFunction(() => document.querySelector('.executive-slider').classList.contains('is-running'));
    await page.clock.runFor(7100);
    await active(1);
    const duration = await page.locator('.executive-slide.is-entering').evaluate(e => {
      const fade = e.getAnimations().find(a => a.animationName === 'executive-fade');
      fade.pause(); fade.currentTime = 450;
      return fade.effect.getTiming().duration;
    });
    assert.equal(duration,900);
    await page.clock.runFor(16);
    const composition = await page.locator('.executive-slide').evaluateAll(slides => slides.map(s => ({opacity:+getComputedStyle(s).opacity, entering:s.classList.contains('is-entering'), current:s.classList.contains('is-current'), loaded:s.querySelector('img').naturalWidth > 0})));
    assert.ok(composition.some(s => !s.entering && s.current && s.opacity === 1 && s.loaded), 'imagem anterior opaca durante crossfade');
    assert.ok(composition.some(s => s.entering && s.opacity > 0 && s.opacity < 1 && s.loaded));
    await page.clock.runFor(1000);
    assert.equal(await page.locator('.executive-slide.is-current').count(), 1);
    await page.locator('[data-slide-to="1"]').focus();
    await page.clock.runFor(15000);
    await active(1);
    await page.keyboard.press('ArrowRight');
    await active(2);
    assert.equal(await page.locator('[data-slide-to="2"]').evaluate(e => e === document.activeElement), true);
    await page.keyboard.press('Home'); await active(0);
    await page.keyboard.press('End'); await active(2);
    await page.getByRole('button',{name:'Pausar apresentação automática', exact:true}).click();
    await page.locator('.hero-copy h1').click(); await page.mouse.move(0,0);
    await page.clock.runFor(15000); await active(2);
    await page.getByRole('button',{name:'Iniciar apresentação automática', exact:true}).click();
    await page.locator('.hero-copy h1').click(); await page.mouse.move(0,0);
    await page.evaluate(() => { Object.defineProperty(document,'hidden',{configurable:true,value:true}); document.dispatchEvent(new Event('visibilitychange')); });
    await page.clock.runFor(15000); await active(2);
    assert.equal(await slider.evaluate(e => e.classList.contains('is-running')),false);
    await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event('visibilitychange')); });
    await page.clock.runFor(7100); await active(0);
    await page.clock.runFor(1000);
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.clock.runFor(15000); await active(0);
    await page.locator('[data-slide-to="2"]').click(); await active(2);
    assert.equal(await page.locator('.executive-slide.is-current img').evaluate(e => getComputedStyle(e).animationName),'none');
    assert.equal(await slider.evaluate(e => e.classList.contains('is-running')),false);
    const a11y = await new AxeBuilder({page}).include('.home-hero').analyze();
    assert.deepEqual(a11y.violations,[]);
    for (const width of [320,375,390,430,768,1024,1366,1440,1920]) {
      await page.setViewportSize({width,height:1000});
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),true,`overflow ${width}`);
      const box = await slider.boundingBox(); assert.ok(box.width > 0 && box.height >= 280);
      assert.equal(Math.round(box.x),0,'banner começa na borda da tela');
      assert.equal(Math.round(box.width),width,'banner ocupa a largura total');
      const text = await page.locator('.hero-index').boundingBox();
      const controlBox = await page.locator('.executive-controls').boundingBox();
      assert.ok(text.y+text.height < controlBox.y,'controles abaixo do texto');
      for(const index of [0,1,2]) {
        await page.locator(`[data-slide-to="${index}"]`).click(); await active(index);
        assert.ok(await page.locator(`.executive-slide[data-slide="${index}"] img`).evaluate(e => e.complete && e.naturalWidth > 0));
      }
    }
    assert.deepEqual(await page.evaluate(() => window.sliderCSP),[]);
    assert.deepEqual(errors,[]);
    // Erros de rede não apagam a fotografia atual nem impedem outra seleção.
    const failed = await browser.newPage({reducedMotion:'reduce'});
    await failed.route('**/src/img/executive/systems-*.webp', r => r.abort());
    await failed.goto(base); await failed.getByRole('button',{name:'Fechar aviso de privacidade'}).click();
    await failed.locator('[data-slide-to="1"]').click();
    await failed.waitForFunction(() => !document.querySelector('.executive-systems'));
    assert.equal(await failed.locator('[data-slide-to="0"]').getAttribute('aria-current'),'true');
    assert.equal(await failed.locator('.executive-slide.is-current img').evaluate(e=>e.naturalWidth>0),true);
    await failed.locator('[data-slide-to="2"]').click();
    await failed.waitForFunction(() => document.querySelector('[data-slide-to="2"]').getAttribute('aria-current') === 'true');
    // Uma resposta lenta nunca substitui uma seleção mais recente.
    const slow = await browser.newPage({reducedMotion:'reduce'});
    let release;
    const gate = new Promise(resolve => { release = resolve; });
    await slow.route('**/src/img/executive/connections-*.webp', async route => { await gate; await route.continue(); });
    await slow.goto(base); await slow.getByRole('button',{name:'Fechar aviso de privacidade'}).click();
    await slow.locator('[data-slide-to="2"]').click();
    assert.equal(await slow.locator('[data-slide-to="0"]').getAttribute('aria-current'),'true');
    assert.equal(await slow.locator('.executive-slide.is-current img').evaluate(e=>e.naturalWidth>0),true);
    await slow.locator('[data-slide-to="0"]').click(); release();
    await slow.waitForFunction(() => document.querySelector('.executive-connections img')?.naturalWidth > 0);
    assert.equal(await slow.locator('[data-slide-to="0"]').getAttribute('aria-current'),'true');
    await slow.locator('[data-slide-to="2"]').click();
    await slow.waitForFunction(() => document.querySelector('[data-slide-to="2"]').getAttribute('aria-current') === 'true');
    // Sem JavaScript: fotografia prioritária e legenda, sem controles inoperantes.
    const fallback = await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});
    await fallback.goto(base);
    assert.equal(await fallback.locator('.executive-controls').isVisible(),false);
    assert.equal(await fallback.locator('.executive-slide').count(),1);
    assert.equal(await fallback.locator('.executive-slide img').evaluate(e=>e.complete&&e.naturalWidth>0),true);
    console.log('PASS: autoplay 7s, crossfade sem fundo exposto, teclado, pausa/foco/aba, reduced-motion, 9 larguras × 3 ilustrações, axe, CSP, falha/atraso de imagem, seleção concorrente e fallback sem JS.');
  } finally { await browser.close(); }
})().catch(e => {console.error(e);process.exit(1)});
