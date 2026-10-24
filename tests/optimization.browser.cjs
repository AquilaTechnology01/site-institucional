const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const sourceBase=process.env.SOURCE_BASE||'http://127.0.0.1:4173';
const buildBase=process.env.SITE_BASE||'http://127.0.0.1:4178';
const output=process.env.ARTIFACT_DIR||'docs/otimizacao/evidencias';
(async()=>{const browser=await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE||'/usr/bin/google-chrome',args:['--no-sandbox']});try{
 const context=await browser.newContext();const page=await context.newPage();const comparisons=[];
 async function snapshot(){await page.mouse.move(0,0);await page.evaluate(()=>new Promise(requestAnimationFrame));return page.evaluate(()=>[...document.querySelectorAll('header,.brand-symbol,h1,h2,h3,.btn,.nav-links,.nav-links a,summary,.cards,.project-grid,.contact-form,input,textarea,.form-status,.footer-main,.footer-links,#cookie-banner,#cookie-preferences,.portfolio-layout,.portfolio-card,.portfolio-detail')].map(e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return {tag:e.tagName,classes:e.className,id:e.id,display:s.display,color:s.color,background:s.backgroundColor,fontSize:s.fontSize,lineHeight:s.lineHeight,border:s.border,margin:s.margin,padding:s.padding,content:getComputedStyle(e,'::before').content,width:Math.round(r.width*100)/100,height:Math.round(r.height*100)/100};}));}
 for(const route of ['/','/portfolio/','/pdv.html','/FAQ.html','/blog.html','/privacidade.html','/termos.html','/lgpd.html']){
  for(const width of [390,1440]){
   const states=[];
   for(const base of [sourceBase,buildBase]){
    await page.setViewportSize({width,height:900});await page.goto(base+route);
    const icons=await page.locator('link[rel=icon]').evaluateAll(items=>items.map(item=>({href:item.href,sizes:item.sizes.value,media:item.media})));
    assert.equal(icons.length,2);
    assert.ok(icons.every(icon=>icon.sizes==='64x64'));
    assert.ok(icons.some(icon=>icon.media==='(prefers-color-scheme: dark)'));
    for(const icon of icons){const response=await page.request.get(icon.href);assert.equal(response.status(),200);assert.match(response.headers()['content-type'],/image\/png/);}
    if(route==='/portfolio/')await page.getByRole('button',{name:'Explorar Aquila PDV'}).waitFor();
    const backdrop=await page.locator('#cookie-banner').evaluate(e=>getComputedStyle(e,'::backdrop').backgroundColor);
    assert.equal(backdrop,'rgba(7, 29, 54, 0.6)');
    const popup=await snapshot();await page.getByRole('button',{name:'Fechar aviso de privacidade'}).click();
    if(width===390)await page.getByRole('button',{name:'Abrir menu',exact:true}).click();
    await page.locator('#main-navigation summary').filter({hasText:'Soluções'}).click();
    const menu=await snapshot();await page.keyboard.press('Escape');if(width===390)await page.keyboard.press('Escape');
    if(route==='/'){
     await page.locator('#email').fill('email-invalido');await page.locator('#contact-form button[type=submit]').click();
     assert.equal(await page.locator('#email').getAttribute('aria-invalid'),'true');
    }
    const normal=await snapshot();states.push({popup,menu,normal});
   }
   assert.deepEqual(states[1],states[0],`CSS/DOM divergiu após bundle: ${route} ${width}`);
   comparisons.push({route,width,sourceEqualsBuild:true});
  }
 }
 // Fallback sem JavaScript e respeito ao movimento reduzido no CSS compilado.
 const noJS=await browser.newContext({javaScriptEnabled:false,reducedMotion:'reduce'});const fallback=await noJS.newPage({viewport:{width:390,height:844}});
 await fallback.goto(buildBase+'/portfolio/');assert.equal(await fallback.locator('.portfolio-card').count(),6);assert.equal(await fallback.locator('#main-navigation').isVisible(),true);
 await fallback.locator('#main-navigation summary').filter({hasText:'Soluções'}).click();assert.equal(await fallback.locator('#main-navigation a[href="/pdv.html"]').isVisible(),true);
 assert.equal(await fallback.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior),'auto');
 fs.mkdirSync(output,{recursive:true});fs.writeFileSync(output+'/equivalencia-css.json',JSON.stringify(comparisons,null,2));
 if(process.env.CAPTURE_SCREENSHOTS==='1'){
 await page.setViewportSize({width:1440,height:1000});await page.goto(buildBase+'/');await page.screenshot({path:output+'/popup-depois.png'});await page.getByRole('button',{name:'Fechar aviso de privacidade'}).click();await page.evaluate(()=>{document.activeElement.blur();scrollTo(0,0)});await page.screenshot({path:output+'/home-depois.png'});
 }
 console.log('PASS: 16 comparações fonte/build em popup/menu/conteúdo/erros; backdrop válido; catálogo/menu sem JS e reduced-motion.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
