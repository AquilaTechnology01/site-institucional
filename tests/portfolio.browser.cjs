const SITE_BASE = process.env.SITE_BASE || 'http://127.0.0.1:4173';
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async () => {
 const browser = await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE || '/usr/bin/google-chrome', headless:true, args:['--no-sandbox']});
 const page = await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[]; page.on('pageerror',e=>errors.push(e.message));
 await page.goto(SITE_BASE + '/portfolio');
 await page.getByRole('button',{name:'Rejeitar opcionais',exact:true}).click();
 await page.getByRole('button',{name:'Explorar Aquila PDV'}).waitFor();
 assert.ok(page.url().endsWith('/portfolio/'));
 assert.equal(await page.locator('.portfolio-card').count(),8);
 await page.getByRole('button',{name:'Websites',exact:true}).click();
 await page.getByRole('searchbox').fill('javascript whatsapp');
 assert.equal(await page.locator('.portfolio-card').count(),1);
 await page.getByRole('button',{name:'Explorar Site institucional Aquila'}).focus();
 await page.keyboard.press('Enter');
 assert.equal(await page.locator('#detail-title').textContent(),'Site institucional Aquila');
 assert.equal(await page.locator('#detail-title').evaluate(el=>document.activeElement===el),true);
 assert.equal(await page.getByRole('button',{name:'Demonstração indisponível'}).isDisabled(),true);
 await page.getByRole('searchbox').fill('nenhumresultado');
 assert.equal(await page.locator('.portfolio-card').count(),0);
 assert.equal(await page.locator('#project-detail').isVisible(),false);
 await page.getByRole('searchbox').fill('');
 await page.getByRole('button',{name:'Todos',exact:true}).click();
 await page.reload(); await page.getByRole('button',{name:'Fechar aviso de privacidade'}).click(); await page.getByRole('button',{name:'Explorar Aquila PDV'}).waitFor();

 for(const width of [360,390,768,1024,1440]) {
  await page.setViewportSize({width,height:900});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth),true,`overflow ${width}`);
 }
 await page.setViewportSize({width:390,height:844});
 await page.getByRole('button',{name:'Abrir menu',exact:true}).click();
 assert.equal(await page.getByRole('button',{name:'Fechar menu',exact:true}).getAttribute('aria-expanded'),'true');
 await page.keyboard.press('Escape');
 assert.equal(await page.getByRole('button',{name:'Abrir menu',exact:true}).getAttribute('aria-expanded'),'false');

 await page.route('**/src/data/projects.json',route=>route.fulfill({status:503,body:'unavailable'}));
 await page.reload(); await page.getByRole('button',{name:'Fechar aviso de privacidade'}).click(); await page.getByRole('button',{name:'Tentar novamente'}).waitFor();
 await page.unroute('**/src/data/projects.json');
 await page.getByRole('button',{name:'Tentar novamente'}).click();
 await page.getByRole('button',{name:'Explorar Aquila PDV'}).waitFor();
 await page.route('**/src/data/projects.json',route=>route.fulfill({contentType:'application/json',body:'[{"visibility":"public"}]'}));
 await page.reload(); await page.getByRole('button',{name:'Fechar aviso de privacidade'}).click(); await page.getByRole('button',{name:'Tentar novamente'}).waitFor();
 await page.unroute('**/src/data/projects.json');
 for(const path of ['/index.html','/pdv.html','/FAQ.html','/blog.html','/privacidade.html','/termos.html','/lgpd.html']) {
  const response=await page.goto(SITE_BASE+path); assert.equal(response.status(),200);
  assert.equal(await page.locator('#main-navigation a[href="/portfolio/"]').count(),1);
 }
 assert.deepEqual(errors,[]);
 console.log('PASS: rota direta/recarga, filtros/busca, seleção/Enter/foco, ausência de demo, vazio, falha/retry, dados inválidos, menu/Escape, 5 larguras, 7 páginas sem erros JS.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
