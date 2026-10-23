(() => {
  const {categories, validate, filter} = window.AquilaPortfolio;
  const list = document.getElementById('project-list');
  const detail = document.getElementById('project-detail');
  const status = document.getElementById('portfolio-status');
  const retry = document.getElementById('retry-projects');
  const search = document.getElementById('project-search');
  let projects = [], category = 'Todos', selected = null;
  const node = (tag, text, className) => {
    const element = document.createElement(tag);
    if (text) element.textContent = text;
    if (className) element.className = className;
    return element;
  };
  function showDetail(project, focus = false) {
    selected = project.id;
    detail.replaceChildren();
    detail.hidden = false;
    detail.append(node('p', `${project.category} · ${project.status}`, 'eyebrow'));
    const title = node('h2', project.title); title.id = 'detail-title'; title.tabIndex = -1;
    detail.append(title, node('p', project.description));
    if (project.gallery.length) {
      detail.append(node('h3', 'Galeria do projeto'));
      const gallery = node('div', '', 'portfolio-gallery');
      project.gallery.forEach(item => {
        const link = node('a'); link.href = item.src; link.target = '_blank'; link.rel = 'noopener noreferrer';
        link.setAttribute('aria-label', `Ampliar: ${item.alt} (abre em nova aba)`);
        const image = node('img'); image.src = item.src; image.alt = item.alt; image.loading = 'lazy';
        link.append(image); gallery.append(link);
      });
      detail.append(gallery);
    }
    for (const [heading, content] of [['O desafio', project.problem], ['A solução', project.solution]]) detail.append(node('h3', heading), node('p', content));
    detail.append(node('h3', 'Tecnologias'), node('p', project.technologies.join(' · ') || 'Stack não divulgada na documentação pública.'));
    detail.append(node('h3', 'Funcionalidades documentadas'));
    const features = node('ul'); project.features.forEach(feature => features.append(node('li', feature))); detail.append(features);
    const actions = node('div', '', 'portfolio-actions');
    for (const [key, label] of [['demoUrl','Abrir demonstração'],['repositoryUrl','Ver repositório'],['caseStudyUrl','Conhecer o projeto']]) {
      if (!project[key]) continue;
      const link = node('a', label, 'btn btn-secondary'); link.href = project[key];
      if (project[key].startsWith('https:')) {link.target = '_blank'; link.rel = 'noopener noreferrer';}
      actions.append(link);
    }
    if (!project.demoUrl) {
      const unavailable = node('button', 'Demonstração indisponível', 'btn btn-secondary'); unavailable.disabled = true; actions.append(unavailable);
      detail.append(node('p', 'Este projeto não possui uma demonstração pública cadastrada.', 'portfolio-note'));
    }
    detail.append(actions);
    list.querySelectorAll('button[data-project]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.project === selected)));
    if (focus) title.focus();
  }
  function render() {
    const visible = filter(projects, category, search.value);
    list.replaceChildren();
    status.textContent = visible.length ? `${visible.length} projeto${visible.length === 1 ? '' : 's'} encontrado${visible.length === 1 ? '' : 's'}.` : 'Nenhum projeto encontrado. Tente outra busca ou categoria.';
    visible.forEach(project => {
      const card = node('article', '', 'portfolio-card');
      const image = node('img'); image.src = project.image; image.alt = project.imageAlt; image.width = 800; image.height = 450; image.loading = 'lazy';
      image.addEventListener('error', () => { image.onerror = null; image.src = '/src/img/portfolio-placeholder.svg'; }, {once: true});
      card.append(image, node('p', `${project.category} · ${project.status}`, 'eyebrow'), node('h3', project.title), node('p', project.summary), node('p', project.technologies.join(' · ') || 'Stack não divulgada', 'portfolio-note'));
      const button = node('button', `Explorar ${project.title} →`, 'btn btn-secondary'); button.type = 'button'; button.dataset.project = project.id; button.setAttribute('aria-controls', 'project-detail');
      button.addEventListener('click', () => showDetail(project, true)); card.append(button); list.append(card);
    });
    if (!visible.length) { selected = null; detail.hidden = true; detail.replaceChildren(); }
    else showDetail(visible.find(p => p.id === selected) || visible[0]);
  }
  categories.forEach(name => {
    const button = node('button', name); button.type = 'button'; button.setAttribute('aria-pressed', String(name === category));
    button.addEventListener('click', () => { category = name; document.querySelectorAll('#filters button').forEach(b => b.setAttribute('aria-pressed', String(b === button))); render(); });
    document.getElementById('filters').append(button);
  });
  search.addEventListener('input', render);
  async function load() {
    retry.hidden = true; status.textContent = 'Carregando projetos…';
    try {
      const response = await fetch('/src/data/projects.json', {credentials: 'omit'});
      if (!response.ok) throw new Error('Falha no catálogo');
      projects = validate(await response.json());
      document.getElementById('portfolio-tools').hidden = false; render();
    } catch {
      list.replaceChildren(); detail.hidden = true; document.getElementById('portfolio-tools').hidden = true;
      status.textContent = 'Não foi possível carregar os projetos. Tente novamente ou fale com a Aquila pelo contato abaixo.'; retry.hidden = false;
    }
  }
  retry.addEventListener('click', load);
  load();
})();
