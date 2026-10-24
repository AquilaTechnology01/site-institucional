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

