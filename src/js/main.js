// Controla o menu principal em telas pequenas.
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav-links');

if (menuButton && navigation) {
  document.documentElement.classList.add('js-nav');
  const closeMenu = () => {
    navigation.classList.remove('is-open');
    navigation.querySelectorAll('details[open]').forEach(item => { item.open = false; });
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
    menuButton.querySelector('i').className = 'bi bi-list';
  };

  menuButton.addEventListener('click', () => {
    const isOpen = navigation.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    menuButton.querySelector('i').className = isOpen ? 'bi bi-x-lg' : 'bi bi-list';
  });

  navigation.querySelectorAll('details').forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) navigation.querySelectorAll('details').forEach(other => { if (other !== item) other.open = false; });
    });
  });
  document.addEventListener('click', event => {
    if (!navigation.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });
  navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const opened = navigation.querySelector('details[open]');
    if (opened) {
      event.preventDefault();
      opened.open = false;
      opened.querySelector('summary').focus();
      return;
    }
    if (navigation.classList.contains('is-open')) {
      closeMenu();
      menuButton.focus();
    }
  });
  window.matchMedia('(max-width: 1100px)').addEventListener('change', closeMenu);
}

// Prepara a mensagem do orçamento; o envio é concluído pelo visitante no WhatsApp.
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  const status = document.getElementById('form-status');
  const fields = [...contactForm.querySelectorAll('input, textarea')];
  let validated = false;
  function validateField(field) {
    field.setCustomValidity('');
    if (field.required && !field.value.trim()) field.setCustomValidity('Preencha este campo.');
    const valid = field.validity.valid;
    field.setAttribute('aria-invalid', String(!valid));
    document.getElementById(`${field.id}-error`).textContent = valid ? '' : field.validationMessage;
    return valid;
  }
  fields.forEach(field => field.addEventListener('input', () => {
    field.setCustomValidity('');
    if (validated) validateField(field);
    status.textContent = '';
  }));
  contactForm.addEventListener('submit', event => {
    event.preventDefault();
    validated = true;
    const valid = fields.map(validateField).every(Boolean);
    if (!valid) {
      status.textContent = 'Confira os campos destacados antes de continuar.';
      status.className = 'form-status is-error';
      fields.find(field => !field.validity.valid)?.focus();
      return;
    }
    const data = new FormData(contactForm);
    const message = [
      '*Solicitação de orçamento — site Aquila*',
      `*Nome:* ${String(data.get('nome')).trim()}`,
      `*E-mail:* ${String(data.get('email')).trim()}`,
      `*Assunto:* ${String(data.get('assunto')).trim()}`,
      `*Projeto:* ${String(data.get('mensagem')).trim()}`,
    ].join('\n');
    try {
      window.open(`https://wa.me/5511991046133?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
      // noopener pode retornar null mesmo quando a janela abre; não inferir falha desse retorno.
      status.textContent = 'Solicitação preparada. Conclua o envio no WhatsApp. Se a janela não abriu, use os canais de contato acima.';
      status.className = 'form-status is-success';
    } catch {
      status.textContent = 'Não foi possível abrir o WhatsApp. Use os canais de contato acima para continuar.';
      status.className = 'form-status is-error';
    }
  });
}

// Atualiza automaticamente o ano exibido nos rodapés.
document.querySelectorAll('[data-current-year]').forEach((element) => {
  element.textContent = new Date().getFullYear();
});
