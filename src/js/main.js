// Controla o menu principal em telas pequenas.
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav-links');

if (menuButton && navigation) {
  const closeMenu = () => {
    navigation.classList.remove('is-open');
    navigation.querySelectorAll('details[open]').forEach(item => { item.open = false; });
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
  };

  menuButton.addEventListener('click', () => {
    const isOpen = navigation.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
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

// Atualiza automaticamente o ano exibido nos rodapés.
document.querySelectorAll('[data-current-year]').forEach((element) => {
  element.textContent = new Date().getFullYear();
});
