const {chromium} = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;
const assert = require('node:assert/strict');
const base = process.env.SITE_BASE || 'http://127.0.0.1:4181';
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE||'/usr/bin/google-chrome',args:['--no-sandbox']});
 try {
  const context=await browser.newContext({reducedMotion:'reduce'}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/portfolio/');await page.getByRole('button',{name:'Fechar aviso de privacidade'}).click();
  await page.getByRole('button',{name:'Explorar Aquila PDV'}).waitFor();
  assert.deepEqual(await page.locator('#filters button').allTextContents(),['Todos','Sistemas','Websites','Automações']);
  for(const [name,count] of [['Sistemas',1],['Websites',5],['Automações',1],['Todos',8]]) {
   await page.locator('#filters').getByRole('button',{name,exact:true}).click();assert.equal(await page.locator('.portfolio-card').count(),count);
   assert.equal(await page.locator('#filters [aria-pressed=true]').textContent(),name);
  }
  for(const name of ['Automações em Python','Chatbot Inteligente']) {
   await page.getByRole('button',{name:'Explorar '+name}).focus();await page.keyboard.press('Enter');
   assert.equal(await page.locator('#detail-title').textContent(),name);assert.equal(await page.locator('#detail-title').evaluate(e=>e===document.activeElement),true);
   if(name==='Automações em Python') assert.equal(await page.locator('#project-detail .portfolio-detail-image').getAttribute('alt').then(a=>a.includes('conceitual')),true);
   else { assert.equal(await page.locator('#project-detail .portfolio-gallery img').count(),2); assert.match(await page.locator('#project-detail').textContent(),/Disponível/); }
   assert.equal(await page.getByRole('button',{name:'Demonstração indisponível'}).isDisabled(),true);
  }
  await page.getByRole('button',{name:'Explorar Landing page de padaria'}).click();
  assert.equal(await page.locator('.portfolio-gallery a').count(),3);
  for(const a of await page.locator('.portfolio-gallery a').all()) {assert.equal(await a.getAttribute('target'),'_blank');assert.equal((await page.request.get(base+await a.getAttribute('href'))).status(),200);}
  for(const width of [320,375,390,430,768,1024,1366,1440,1920]) {
   await page.setViewportSize({width,height:1000});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`overflow ${width}`);
   for(const card of await page.locator('.executive-showcase .project-card,.portfolio-card,.portfolio-pillar-grid article').all()) {
    const box=await card.boundingBox();assert.ok(box.x>=0&&box.x+box.width<=width);
   }
   for(const image of await page.locator('.portfolio-hero img,.executive-showcase img').all()) {await image.scrollIntoViewIfNeeded();await image.evaluate(e=>e.decode());assert.equal(await image.evaluate(e=>e.naturalWidth>0),true);}
   if([390,1440].includes(width)) assert.deepEqual((await new AxeBuilder({page}).include('main').analyze()).violations,[]);
  }
  const urls=new Set(await page.locator('main a[href]').evaluateAll(items=>items.map(e=>e.getAttribute('href')).filter(h=>h.startsWith('/'))));
  for(const url of urls) assert.equal((await page.request.get(base+url)).status(),200,url);
  assert.equal(await page.locator('main').evaluate(e=>e.getAnimations({subtree:true}).length),0);
  const noJS=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:900}}),fallback=await noJS.newPage();await fallback.goto(base+'/portfolio/');
  assert.equal(await fallback.locator('.portfolio-card').count(),8);assert.equal(await fallback.locator('#portfolio-tools').isVisible(),false);
  assert.match(await fallback.locator('#project-list').textContent(),/Dados e IA · Disponível/);assert.match(await fallback.locator('#project-list').textContent(),/Serviço sob medida/);
  for(const card of await fallback.locator('.portfolio-card').all()) {assert.equal(await card.isVisible(),true);assert.equal(await card.evaluate(e=>getComputedStyle(e).opacity),'1');}
  assert.deepEqual(errors,[]);
  console.log('PASS: 8 entradas preservadas/documentadas, 4 filtros disponíveis, teclado/detalhes, galerias reais, 9 larguras, axe, imagens e links locais, reduced-motion e catálogo completo sem JS.');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
