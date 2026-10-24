/* Funções puras compartilhadas entre a interface e os testes, sem dependências. */
(function (root) {
  const categories = ['Todos', 'Websites', 'Sistemas', 'Automações', 'Dados e IA'];
  const normalize = (value) => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  function safeUrl(value) {
    if (typeof value !== 'string' || !value.trim()) return null;
    if (/^\/(?!\/)[a-z0-9/_\-.]+$/i.test(value)) return value;
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && !url.username && !url.password ? url.href : null;
    } catch { return null; }
  }
  function safeImage(value) {
    const fallback = '/src/img/portfolio-placeholder.svg';
    if (typeof value !== 'string' || !/^\/(?:src\/img|portfolio\/img)\/(?:[a-z0-9/_.-]|%[0-9a-f]{2})+$/i.test(value)) return fallback;
    try {
      const decoded = decodeURIComponent(value);
      if (/[\\%?#\x00-\x1f\x7f]/.test(decoded) || decoded.split('/').some(part => part === '.' || part === '..')) return fallback;
      const url = new URL(value, 'https://portfolio.invalid');
      return /^\/(?:src\/img|portfolio\/img)\//.test(url.pathname) ? value : fallback;
    } catch { return fallback; }
  }
  function validate(data) {
    if (!Array.isArray(data)) throw new Error('Catálogo inválido');
    const ids = new Set();
    return data.filter((p) => {
      if (!p || p.visibility !== 'public') return false;
      if (!['id','slug','title','summary','description','status','problem','solution'].every((key) => typeof p[key] === 'string' && p[key].trim()) || !categories.slice(1).includes(p.category) || ids.has(p.id)) throw new Error('Projeto incompleto');
      if (!Array.isArray(p.technologies) || !p.technologies.every(t => typeof t === 'string') || !Array.isArray(p.features) || !p.features.every(t => typeof t === 'string')) throw new Error('Projeto inválido');
      ids.add(p.id);
      return true;
    }).map(p => ({...p, image: safeImage(p.image), gallery: Array.isArray(p.gallery) ? p.gallery.filter(item => item && typeof item.src === 'string').map(item => ({src: safeImage(item.src), alt: typeof item.alt === 'string' ? item.alt : p.title, width: Number.isInteger(item.width) && item.width > 0 ? item.width : 1200, height: Number.isInteger(item.height) && item.height > 0 ? item.height : 750})) : [], imageAlt: typeof p.imageAlt === 'string' ? p.imageAlt : 'Ilustração do projeto', demoUrl: safeUrl(p.demoUrl), repositoryUrl: safeUrl(p.repositoryUrl), caseStudyUrl: safeUrl(p.caseStudyUrl)}));
  }
  function filter(projects, category, query) {
    const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
    return projects.filter(p => (category === 'Todos' || p.category === category) && terms.every(term => normalize([p.title,p.summary,p.description,...p.technologies].join(' ')).includes(term)));
  }
  const api = {categories, safeUrl, validate, filter};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.AquilaPortfolio = api;
})(typeof window !== 'undefined' ? window : globalThis);
