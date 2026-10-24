/* Preferências locais. Não há integrações opcionais no catálogo atual. */
(() => {
  'use strict';
  const KEY = 'aquila.consent';
  const VERSION = 1;
  const VALIDITY = 180 * 24 * 60 * 60 * 1000;
  const banner = document.getElementById('cookie-banner');
  const dialog = document.getElementById('cookie-preferences');
  if (!banner || !dialog) return;
  const notice = document.getElementById('cookie-notice');
  let returnFocus = null;
  function read() {
    try {
      const value = JSON.parse(localStorage.getItem(KEY));
      const date = Date.parse(value?.decidedAt);
      return value?.version === VERSION && ['accept', 'reject', 'custom'].includes(value.action)
        && value.necessary === true && Number.isFinite(date) && date <= Date.now()
        && Date.now() - date < VALIDITY ? value : null;
    } catch { return null; }
  }
  function syncPopup(show) {
    banner.hidden = !show;
    if (show && !banner.open && !dialog.open) banner.showModal();
    if (!show && banner.open) banner.close();
  }
  function close() {
    dialog.close();
    if (!banner.hidden && !banner.open) banner.showModal();
    if (returnFocus?.isConnected && !returnFocus.closest('[hidden]')) returnFocus.focus();
    else document.querySelector('[data-cookie-open]').focus();
  }
  function save(action) {
    const value = {version: VERSION, decidedAt: new Date().toISOString(), action, necessary: true};
    let stored = true;
    try { localStorage.setItem(KEY, JSON.stringify(value)); } catch { stored = false; }
    syncPopup(false);
    if (dialog.open) close();
    else document.querySelector('[data-cookie-open]').focus();
    notice.textContent = stored ? '' : 'Preferência aplicada nesta página. O navegador não permitiu salvá-la; o aviso poderá reaparecer.';
  }
  document.querySelectorAll('[data-cookie-open]').forEach(button => button.addEventListener('click', () => {
    returnFocus = button;
    document.getElementById('cookie-current').textContent = read()
      ? 'Há uma decisão válida salva neste navegador. Apenas recursos necessários estão ativos.'
      : 'Nenhuma decisão válida está salva neste navegador.';
    if (banner.open) banner.close();
    dialog.showModal();
  }));
  document.querySelectorAll('[data-cookie-action]').forEach(button => button.addEventListener('click', () => save(button.dataset.cookieAction)));
  dialog.querySelector('[data-cookie-close]').addEventListener('click', close);
  [banner, dialog].forEach(popup => popup.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const controls = [...popup.querySelectorAll('a[href], button:not(:disabled)')];
    const first = controls[0], last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  }));
  function dismissNotice() {
    syncPopup(false);
    document.querySelector('[data-cookie-open]').focus();
  }
  banner.querySelector('[data-cookie-dismiss]').addEventListener('click', dismissNotice);
  banner.addEventListener('cancel', event => {
    event.preventDefault();
    dismissNotice();
  });
  dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
  dialog.querySelector('[data-cookie-revoke]').addEventListener('click', () => {
    let removed = true;
    try { localStorage.removeItem(KEY); } catch { removed = false; }
    close();
    syncPopup(true);
    banner.querySelector('button').focus();
    notice.textContent = removed ? 'Decisão apagada. Você pode escolher novamente. Nenhuma tecnologia opcional está ativa.' : 'Não foi possível apagar a decisão no navegador. Use as configurações de armazenamento do navegador.';
  });
  window.addEventListener('storage', event => {
    if (event.key === KEY || event.key === null) syncPopup(!read());
  });
  // Aviso em cada carregamento; a decisão anterior permanece salva.
  syncPopup(true);
})();
