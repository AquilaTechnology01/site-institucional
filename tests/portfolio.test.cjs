const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const {categories, safeUrl, validate, filter} = require('../src/js/portfolio-core.js');
const raw = JSON.parse(fs.readFileSync('src/data/projects.json', 'utf8'));
const projects = validate(raw);
test('catálogo público possui somente projetos documentados', () => {
  assert.equal(projects.length, 6);
  for (const p of projects) for (const source of p.evidence) assert.ok(fs.existsSync(source));
  assert.equal(categories.length, 5);
});
test('filtros de categoria e estado vazio', () => {
  assert.equal(filter(projects, 'Sistemas', '').length, 1);
  assert.equal(filter(projects, 'Websites', '').length, 5);
  assert.equal(filter(projects, 'Dados e IA', '').length, 0);
});
test('busca combina categoria, termos, tecnologia, acentos e descrição', () => {
  assert.equal(filter(projects, 'Websites', 'JAVASCRIPT whatsapp').length, 1);
  assert.equal(filter(projects, 'Sistemas', 'JavaScript').length, 0);
  assert.equal(filter(projects, 'Todos', 'solucao').length, 1);
  assert.equal(filter(projects, 'Todos', 'inexistente').length, 0);
});
test('rejeita URLs perigosas e credenciais', () => {
  for (const url of ['javascript:alert(1)', '//example.com', 'http://example.com', 'https://user:pass@example.com', '', null, '/\\evil.com']) assert.equal(safeUrl(url), null);
  assert.equal(safeUrl('https://example.com/demo'), 'https://example.com/demo');
  assert.equal(safeUrl('/pdv.html'), '/pdv.html');
});
test('demonstrações ausentes e projetos privados', () => {
  assert.ok(projects.every(p => p.demoUrl === null));
  assert.deepEqual(validate([{visibility:'internal', title:'Privado'}]), []);
  assert.equal(validate([{...raw[0],demoUrl:'javascript:bad',image:'https://other.com/private'}])[0].demoUrl, null);
});
test('dados ausentes, catálogo inválido e IDs duplicados geram erro recuperável', () => {
  assert.throws(() => validate({}));
  assert.throws(() => validate([{...raw[0],title:null}]));
  assert.throws(() => validate([raw[0],raw[0]]));
  assert.throws(() => validate([{...raw[0],features:null}]));
});

test('imagens não podem escapar das pastas públicas nem conter codificações inválidas', () => {
  const fallback = '/src/img/portfolio-placeholder.svg';
  for (const image of ['/src/img/../../index.html', '/portfolio/img/%2e%2e/%2e%2e/index.html', '/src/img/%252e%252e/file.png', '/src/img/%5cfile.png', '/src/img/%00.png', '/src/img/%ff.png']) {
    const p = validate([{...raw[0], image, gallery:[{src:image}]}])[0];
    assert.equal(p.image, fallback, image);
    assert.equal(p.gallery[0].src, fallback, image);
  }
  assert.ok(projects.flatMap(p => p.gallery).every(item => item.src.startsWith('/portfolio/img/')));
});
