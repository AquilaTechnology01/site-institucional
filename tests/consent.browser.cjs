const SITE_BASE = process.env.SITE_BASE || 'http://127.0.0.1:4173';
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async () => {
 const browser = await chromium.launch({executablePath: process.env.BROWSER_EXECUTABLE || '/usr/bin/google-chrome', args:['--no-sandbox']});
 try {
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  const optionalRequests=[];
  page.on('request',r=>{if(/google-analytics|googletagmanager|facebook\.net|doubleclick/.test(r.url()))optionalRequests.push(r.url());});
  await page.goto(SITE_BASE + '/');
  const banner=page.locator('#cookie-banner'), dialog=page.locator('#cookie-preferences');
  await banner.waitFor();
  assert.equal(await banner.evaluate(e=>e.matches(':modal')),true);
  await page.keyboard.press('Escape');
  assert.equal(await banner.isVisible(),false);
  assert.equal(await page.evaluate(()=>localStorage.getItem('aquila.consent')),null);
  await page.reload();
  await banner.waitFor();
  assert.equal((await context.cookies()).length,0);
  assert.equal(await page.evaluate(()=>sessionStorage.length),0);
  await page.getByRole('button',{name:'Rejeitar opcionais',exact:true}).click();
  assert.equal(await banner.isVisible(),false);
  let value=await page.evaluate(()=>JSON.parse(localStorage.getItem('aquila.consent')));
  assert.equal(value.action,'reject');assert.equal(value.version,1);assert.ok(Date.parse(value.decidedAt));
  assert.deepEqual(Object.keys(value).sort(),['action','decidedAt','necessary','version']);
  for(const path of ['/','/portfolio/','/pdv.html','/FAQ.html','/blog.html','/privacidade.html','/termos.html','/lgpd.html']){
   await page.goto(SITE_BASE+path);
   assert.equal(await banner.isVisible(),true);
   await page.getByRole('button',{name:'Fechar aviso de privacidade'}).click();
   assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('aquila.consent')).action),'reject');
   await page.getByRole('button',{name:'Preferências de cookies',exact:true}).click();
   assert.equal(await dialog.isVisible(),true);
   await page.keyboard.press('Escape');
   assert.equal(await dialog.isVisible(),false);
   assert.equal(await page.getByRole('button',{name:'Preferências de cookies',exact:true}).evaluate(e=>e===document.activeElement),true);
  }
  await page.reload();assert.equal(await banner.isVisible(),true);
  await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'Preferências de cookies',exact:true}).click();
  await page.getByRole('button',{name:'Revogar e apagar decisão'}).click();
  assert.equal(await page.evaluate(()=>localStorage.getItem('aquila.consent')),null);
  assert.equal(await banner.isVisible(),true);
  await page.getByRole('button',{name:'Aceitar todos',exact:true}).click();
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('aquila.consent')).action),'accept');
  await page.getByRole('button',{name:'Preferências de cookies',exact:true}).click();
  await page.getByRole('button',{name:'Salvar preferências',exact:true}).click();
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('aquila.consent')).action),'custom');
  // Invalid, outdated and expired records never suppress the banner.
  for(const record of ['bad',JSON.stringify({...value,version:0}),JSON.stringify({...value,decidedAt:'2020-01-01T00:00:00.000Z'}),JSON.stringify({...value,decidedAt:'2099-01-01T00:00:00.000Z'})]){
   await page.evaluate(v=>localStorage.setItem('aquila.consent',v),record);await page.reload();assert.equal(await banner.isVisible(),true);
  }
  for(const width of [320,375,390,768,1024,1440]){
   await page.setViewportSize({width,height:740});
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`page overflow ${width}`);
   assert.equal(await banner.evaluate(e=>e.scrollWidth<=e.clientWidth),true,`banner overflow ${width}`);
   const rect = await banner.boundingBox();
   assert.ok(Math.abs(rect.x + rect.width / 2 - width / 2) < 2);
   assert.ok(Math.abs(rect.y + rect.height / 2 - 740 / 2) < 2);
   for(let i=0;i<6;i++){await page.keyboard.press('Tab');assert.equal(await banner.evaluate(e=>e.contains(document.activeElement)),true);}
   await page.getByRole('button',{name:'Personalizar',exact:true}).click();
   assert.equal(await dialog.evaluate(e=>e.scrollWidth<=e.clientWidth),true,`dialog overflow ${width}`);
   // Native modal traps focus in both directions.
   for(let i=0;i<7;i++){await page.keyboard.press('Tab');assert.equal(await dialog.evaluate(e=>e.contains(document.activeElement)),true);}
   await page.keyboard.press('Shift+Tab');assert.equal(await dialog.evaluate(e=>e.contains(document.activeElement)),true);
   await page.keyboard.press('Escape');
   assert.equal(await page.getByRole('button',{name:'Personalizar',exact:true}).evaluate(e=>e===document.activeElement),true);
  }
  // Rejecting does not break the actual catalog.
  await page.getByRole('button',{name:'Rejeitar opcionais',exact:true}).click();
  await page.goto(SITE_BASE + '/portfolio/');
  await page.getByRole('button',{name:'Fechar aviso de privacidade'}).click();
  await page.getByRole('button',{name:'Explorar Aquila PDV'}).waitFor();
  assert.equal(await page.locator('.portfolio-card').count(),6);
  assert.deepEqual(optionalRequests,[]);assert.deepEqual(errors,[]);
  // Blocked storage must not throw or pretend the decision was persisted.
  const blocked=await browser.newContext();await blocked.addInitScript(()=>{Storage.prototype.setItem=()=>{throw new Error('blocked')};Storage.prototype.getItem=()=>{throw new Error('blocked')};});
  const p=await blocked.newPage();await p.goto(SITE_BASE + '/');await p.getByRole('button',{name:'Rejeitar opcionais',exact:true}).click();
  assert.match(await p.locator('#cookie-notice').textContent(),/não permitiu/);
  console.log('PASS: primeira visita; três decisões; recarga; oito rotas; revogação; versão/data/expiração; seis larguras; modal/foco/teclado; rejeição preserva catálogo; zero requests de rastreadores conhecidos; cookies locais ausentes; armazenamento bloqueado.');
 } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exit(1)});
