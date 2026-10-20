// Controla o menu principal em telas pequenas.
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav-links');

if (menuButton && navigation) {
  const closeMenu = () => {
    navigation.classList.remove('is-open');
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

  navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
      closeMenu();
      menuButton.focus();
    }
  });
}

// Revela os blocos gradualmente durante a rolagem.
const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries, revealObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('is-pending');
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => {
    element.classList.add('is-pending');
    observer.observe(element);
  });
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

// Valida o orçamento e envia os dados para o WhatsApp da empresa.
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  const status = document.getElementById('form-status');

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    status.textContent = '';

    if (!contactForm.checkValidity()) {
      status.textContent = 'Confira os campos destacados antes de continuar.';
      status.className = 'form-status is-error';
      contactForm.querySelector(':invalid')?.focus();
      return;
    }

    const data = new FormData(contactForm);
    const message = [
      '*Solicitação de orçamento — site Aquila*',
      `*Nome:* ${data.get('nome')}`,
      `*E-mail:* ${data.get('email')}`,
      `*Assunto:* ${data.get('assunto')}`,
      `*Projeto:* ${data.get('mensagem')}`,
    ].join('\n');

    status.textContent = 'Tudo certo! Abrindo o WhatsApp para concluir o envio.';
    status.className = 'form-status is-success';
    window.open(`https://wa.me/5511991046133?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  });
}

// Atualiza automaticamente o ano exibido nos rodapés.
document.querySelectorAll('[data-current-year]').forEach((element) => {
  element.textContent = new Date().getFullYear();
});
