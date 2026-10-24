const {chromium}=require('playwright');
const AxeBuilder=require('@axe-core/playwright').default;
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=process.env.SITE_BASE||'http://127.0.0.1:4173';
const output=process.env.ARTIFACT_DIR||'docs/identidade-azul/evidencias';
(async()=>{const browser=await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE||'/usr/bin/google-chrome',args:['--no-sandbox']});try{
 fs.mkdirSync(output,{recursive:true});const context=await browser.newContext();const page=await context.newPage();let screenshotCount=0;const errors=[],failed=[],matrix=[],a11y=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)failed.push({url:r.url(),status:r.status()});});
 const routes=['/','/pdv.html','/portfolio/','/FAQ.html','/blog.html','/privacidade.html','/termos.html','/lgpd.html'];
 for(const route of routes){for(const width of [320,375,390,430,768,1024,1366,1440,1920]){
  await page.setViewportSize({width,height:900});assert.equal((await page.goto(base+route)).status(),200);
  await page.getByRole('button',{name:'Fechar aviso de privacidade'}).click();
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,route+' '+width);
  const current=route==='/'?'/index.html':route;
  assert.equal(await page.locator('#main-navigation a[aria-current=page]').count(),1);
  assert.equal(await page.locator('#main-navigation a[aria-current=page]').getAttribute('href'),current);
  for(const position of ['header','footer']){
   const img=page.locator(position+' .brand-symbol img');await img.scrollIntoViewIfNeeded();
   await img.evaluate(e=>e.decode());assert.equal(await img.isVisible(),true);
   const state=await img.evaluate(e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return {currentSrc:e.currentSrc,width:r.width,height:r.height,naturalWidth:e.naturalWidth,naturalHeight:e.naturalHeight,display:s.display,visibility:s.visibility,opacity:s.opacity,filter:s.filter,clipPath:s.clipPath}});
   assert.ok(state.width>=56&&state.height>=35);assert.equal(state.visibility,'visible');assert.equal(state.opacity,'1');assert.equal(state.filter,'none');assert.equal(state.clipPath,'none');
   assert.ok(Math.abs(state.width/state.height-state.naturalWidth/state.naturalHeight)<.02,'logo distortion');
   assert.ok(state.currentSrc.endsWith(position==='header'?'logo-preto.webp':'logo-branco.webp'));
  }
  await page.evaluate(()=>scrollTo(0,0));
  if(width<=1024){
   const logo=await page.locator('header .brand').boundingBox(),toggle=await page.locator('.menu-toggle').boundingBox();assert.ok(logo.x+logo.width<=toggle.x,'header collision');
   await page.getByRole('button',{name:'Abrir menu',exact:true}).click();
  }
  const summary=page.locator('#main-navigation summary').filter({hasText:'Soluções'});await summary.click();
  await page.keyboard.press('Escape');assert.equal(await page.locator('#main-navigation details[open]').count(),0);
  assert.equal(await summary.evaluate(e=>document.activeElement===e),true);
  if(width<=1024){assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');await page.keyboard.press('Escape');assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');}
  await page.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=700){scrollTo(0,y);await new Promise(r=>setTimeout(r,10));}});
  const broken=await page.locator('img').evaluateAll(images=>images.filter(i=>i.complete&&!i.naturalWidth).map(i=>i.currentSrc));assert.deepEqual(broken,[]);
  await page.evaluate(()=>{document.activeElement.blur();scrollTo(0,0)});
  if(process.env.SKIP_SCREENSHOTS !== '1' && ['/', '/pdv.html','/portfolio/'].includes(route)){await page.screenshot({path:`${output}/${route==='/'?'home':route==='/pdv.html'?'pdv':'portfolio'}-${width}.png`,fullPage:true});screenshotCount++;}
  matrix.push({route,width,logos:'2 carregados e visíveis, proporção preservada',overflow:false,menu:'PASS',images:'PASS'});
 }
 // Analyze each page after the geometric matrix.
 const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();a11y.push({route,violations:result.violations});
 }
 // PNG fallback uses the same official geometry when WebP is unsupported.
 await page.goto(base+'/');await page.getByRole('button',{name:'Fechar aviso de privacidade'}).click();
 for(const position of ['header','footer']){
  const picture=page.locator(position+' .brand-symbol');await picture.locator('source').evaluate(e=>e.type='image/unsupported');const img=picture.locator('img');await img.scrollIntoViewIfNeeded();await img.evaluate(e=>e.decode());assert.ok((await img.evaluate(e=>e.currentSrc)).endsWith('.png'));
 }
 await page.evaluate(()=>{window.open=(url,target,features)=>{window.testContact={url,target,features};return null;};});
 await page.locator('#contact-form button[type=submit]').click();assert.match(await page.locator('#form-status').textContent(),/Confira/);
 for(const id of ['nome','email','assunto','mensagem']){assert.equal(await page.locator('#'+id).getAttribute('aria-invalid'),'true');assert.ok((await page.locator('#'+id+'-error').textContent()).length);}
 for(const [id,value] of [['nome','Teste local'],['email','teste@example.com'],['assunto','Teste de interface'],['mensagem','Verificação local sem transmissão de dados reais.']])await page.locator('#'+id).fill(value);
 await page.locator('#contact-form button[type=submit]').click();assert.match(await page.locator('#form-status').textContent(),/Solicitação preparada/);assert.equal((await page.evaluate(()=>window.testContact)).features,'noopener,noreferrer');
 for(const id of ['nome','email','assunto','mensagem'])assert.equal(await page.locator('#'+id).getAttribute('aria-invalid'),'false');
 await page.evaluate(()=>{window.open=()=>{throw new Error('falha simulada')};});await page.locator('#contact-form button[type=submit]').click();assert.match(await page.locator('#form-status').textContent(),/Não foi possível/);
 await page.reload();a11y.push({route:'popup',violations:(await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations});
 await page.getByRole('button',{name:'Exibir detalhes',exact:true}).click();a11y.push({route:'preferencias',violations:(await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations});
 fs.writeFileSync(output+'/matriz.json',JSON.stringify(matrix,null,2));fs.writeFileSync(output+'/acessibilidade.json',JSON.stringify(a11y,null,2));fs.writeFileSync(output+'/erros.json',JSON.stringify({errors,failed},null,2));
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);assert.deepEqual(a11y.flatMap(v=>v.violations).map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);
 console.log(`PASS: 72 combinações, 144 verificações de logos, ${screenshotCount} screenshots, fallback PNG, menus/Escape/foco, rotas atuais, imagens, formulário simulado, console/recursos e axe nas 8 páginas/2 diálogos.`);
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
