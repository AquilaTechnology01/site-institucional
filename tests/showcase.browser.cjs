const {chromium} = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = process.env.SITE_BASE || 'http://127.0.0.1:4181';
(async () => {
 const browser = await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE || '/usr/bin/google-chrome',args:['--no-sandbox']});
 try {
  const context = await browser.newContext({reducedMotion:'reduce'}), page = await context.newPage();
  const errors = [], failed = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('response', r => {if(r.url().startsWith(base) && r.status()>=400) failed.push(r.url());});
  for(const width of [320,375,390,430,768,1024,1366,1440,1920]) {
   await page.setViewportSize({width,height:1000}); await page.goto(base);
   await page.getByRole('button',{name:'Fechar aviso de privacidade'}).click();
   const section = page.locator('#projetos');
   assert.equal(await section.locator('article').count(),4);
   assert.match(await section.locator('#project-chatbot-title').locator('..').textContent(),/ainda não é um produto comercial disponível/);
   assert.match(await section.locator('#project-web-title').locator('..').textContent(),/Modelo demonstrativo/);
   for(const card of await section.locator('article').all()) {
    await card.scrollIntoViewIfNeeded();
    const box=await card.boundingBox();assert.ok(box.x>=0 && box.x+box.width<=width);
    assert.equal(await card.evaluate(e=>e.scrollWidth<=e.clientWidth),true);
    const image=card.locator('img');
    if(await image.count()) {await image.evaluate(e=>e.decode());assert.equal(await image.evaluate(e=>e.naturalWidth>0&&e.loading==='lazy'&&e.width>0&&e.height>0),true);}
    const link=card.locator('a');assert.equal(await link.isVisible(),true);assert.ok((await link.boundingBox()).height>=44);
   }
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`overflow ${width}`);
   if(width>=1101) {assert.ok((await section.locator('.project-featured').boundingBox()).width>(await section.locator('article').nth(1).boundingBox()).width);}
   if([390,1440].includes(width)) {
    await section.scrollIntoViewIfNeeded();
    assert.deepEqual((await new AxeBuilder({page}).include('#projetos').analyze()).violations,[]);
    if(process.env.ARTIFACT_DIR) {
     fs.mkdirSync(process.env.ARTIFACT_DIR,{recursive:true});
     await page.locator('header').evaluate(e=>{e.hidden=true;});
     await page.evaluate(()=>document.activeElement.blur());
     try {await section.screenshot({path:`${process.env.ARTIFACT_DIR}/projetos-${width}.png`});}
     finally {await page.locator('header').evaluate(e=>{e.hidden=false;});}
    }
   }
  }
  // Links e teclado: destinos existentes, sem criar novas telas ou enviar dados.
  const links=page.locator('#projetos a');assert.equal(await links.count(),6);
  await links.first().focus();
  for(let i=0;i<await links.count();i++) {
   assert.equal(await links.nth(i).evaluate(e=>e===document.activeElement),true);
   const href=await links.nth(i).getAttribute('href');
   if(href.startsWith('#'))assert.equal(await page.locator(href).count(),1);
   else assert.equal((await page.request.get(base+href)).status(),200);
   await page.keyboard.press('Tab');
  }
  assert.equal(await page.locator('#projetos').evaluate(e=>e.getAnimations({subtree:true}).length),0,'movimento reduzido');
  // Com JS desativado, todo o conteúdo e as chamadas continuam acessíveis.
  const noJS=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}}), fallback=await noJS.newPage();
  await fallback.goto(base+'/#projetos');
  for(const card of await fallback.locator('#projetos article').all()) {assert.equal(await card.isVisible(),true);assert.equal(await card.evaluate(e=>getComputedStyle(e).opacity),'1');}
  assert.equal(await fallback.locator('#projetos a').count(),6);
  // Observador de entrada e hover: animações finitas, foco nunca permanece invisível.
  const normal=await browser.newContext({reducedMotion:'no-preference',viewport:{width:1440,height:1000}}), animated=await normal.newPage();
  await animated.goto(base);await animated.getByRole('button',{name:'Fechar aviso de privacidade'}).click();
  const first=animated.locator('#projetos article').first();await first.scrollIntoViewIfNeeded();
  await first.locator('a').focus();
  assert.equal(await first.evaluate(e=>getComputedStyle(e).opacity),'1');
  await animated.mouse.move(0,0);await first.hover();await animated.waitForTimeout(350);
  assert.equal(await first.evaluate(e=>getComputedStyle(e).borderTopColor),'rgb(0, 87, 184)');
  assert.notEqual(await first.locator('img').evaluate(e=>getComputedStyle(e).transform),'none');
  await animated.waitForTimeout(600);assert.equal(await first.evaluate(e=>getComputedStyle(e).opacity),'1');
  assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
  console.log('PASS: 9 larguras, imagens reais carregadas, hierarquia assimétrica, estados honestos, 6 links/teclado, axe desktop/celular, reduced-motion, fallback sem JS, entrada/foco e hover; zero erros JS/recursos.');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
