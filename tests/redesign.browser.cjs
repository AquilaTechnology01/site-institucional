const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{const browser=await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE||'/usr/bin/google-chrome',args:['--no-sandbox']});try{
 const context=await browser.newContext();const page=await context.newPage();const errors=[],badResources=[],rows=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().startsWith('http://127.0.0.1:4173')&&r.status()>=400)badResources.push({url:r.url(),status:r.status()});});
 for(const route of ['/','/portfolio/','/pdv.html','/FAQ.html','/blog.html','/privacidade.html','/termos.html','/lgpd.html']){
  for(const width of [320,375,390,768,1024,1440,1920]){
   await page.setViewportSize({width,height:900});await page.goto('http://127.0.0.1:4173'+route);
   await page.getByRole('button',{name:'Fechar aviso de privacidade'}).click();
   assert.equal(await page.evaluate(()=>scrollY),0,'closing popup must preserve scroll');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,route+' overflow '+width);
   if(width<=1024){await page.getByRole('button',{name:'Abrir menu',exact:true}).click();}
   await page.locator('#main-navigation summary').filter({hasText:'Soluções'}).click();
   assert.equal(await page.locator('#main-navigation a[href="/pdv.html"]').isVisible(),true);
   await page.locator('#main-navigation summary').filter({hasText:'Soluções'}).focus();await page.keyboard.press('Escape');
   assert.equal(await page.locator('#main-navigation details[open]').count(),0);
   if(width<=1024){await page.keyboard.press('Escape');}
   await page.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=700){scrollTo(0,y);await new Promise(r=>setTimeout(r,15));}});
   await page.waitForTimeout(50);
   const broken=await page.locator('img').evaluateAll(images=>images.filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src));assert.deepEqual(broken,[],route);
   rows.push({route,width,overflow:false,brokenImages:broken});
  }
 }
 // Form validation and destination are inspected locally; do not send personal data.
 await page.goto('http://127.0.0.1:4173/');await page.getByRole('button',{name:'Fechar aviso de privacidade'}).click();
 await page.evaluate(()=>{window.open=(url,target,features)=>{window.testContact={url,target,features};return null;};});
 await page.locator('#contact-form button[type=submit]').click();assert.match(await page.locator('#form-status').textContent(),/Confira/);
 for(const [id,value] of [['nome','Teste local'],['email','teste@example.com'],['assunto','Verificação local'],['mensagem','Mensagem de teste local sem transmissão.']])await page.locator('#'+id).fill(value);
 await page.locator('#contact-form button[type=submit]').click();
 const contact=await page.evaluate(()=>window.testContact);assert.ok(contact.url.startsWith('https://wa.me/5511991046133?text='));assert.equal(contact.features,'noopener,noreferrer');
 // Contrast and structure under normal page content, and both privacy dialogs.
 const AxeBuilder=require('@axe-core/playwright').default;const accessibility=[];
 for(const route of ['/','/portfolio/','/pdv.html','/FAQ.html','/blog.html','/privacidade.html','/termos.html','/lgpd.html']){
  await page.goto('http://127.0.0.1:4173'+route);await page.getByRole('button',{name:'Fechar aviso de privacidade'}).click();
  const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();accessibility.push({route,violations:result.violations});
 }
 await page.goto('http://127.0.0.1:4173/');accessibility.push({route:'popup',violations:(await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations});
 await page.getByRole('button',{name:'Personalizar',exact:true}).click();accessibility.push({route:'preferencias',violations:(await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations});
 fs.writeFileSync('docs/redesign/evidencias/responsividade.json',JSON.stringify(rows,null,2));fs.writeFileSync('docs/redesign/evidencias/acessibilidade.json',JSON.stringify(accessibility,null,2));
 assert.deepEqual(errors,[]);assert.deepEqual(badResources,[]);assert.equal(accessibility.flatMap(r=>r.violations).length,0,JSON.stringify(accessibility.map(r=>({route:r.route,violations:r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))}))));
 console.log('PASS: 56 combinações; menus/submenus/Escape; popup sem salto; imagens/console/recursos; formulário simulado; axe em 8 páginas e 2 diálogos.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
