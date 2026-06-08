'use strict';

(function () {
  const form = document.getElementById('parcheForm');
  const card = form?.closest('.pb-form-card');
  if (!form || !card) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const fields = ['pb-nombre', 'pb-cedula', 'pb-email', 'pb-telefono'];
    let valid = true;

    fields.forEach(function (id) {
      const el = document.getElementById(id);
      if (!el) return;
      if (!el.value.trim()) {
        el.style.borderColor = '#e53935';
        el.setAttribute('aria-invalid', 'true');
        valid = false;
      } else {
        el.style.borderColor = '';
        el.removeAttribute('aria-invalid');
      }
    });

    const politica = document.getElementById('pb-politica');
    if (politica && !politica.checked) {
      politica.style.outline = '2px solid #e53935';
      valid = false;
    } else if (politica) {
      politica.style.outline = '';
    }

    if (!valid) return;

    /* TODO: POST to CRM / webhook / API */
    const payload = {
      nombre:   document.getElementById('pb-nombre')?.value.trim(),
      cedula:   document.getElementById('pb-cedula')?.value.trim(),
      email:    document.getElementById('pb-email')?.value.trim(),
      telefono: document.getElementById('pb-telefono')?.value.trim(),
    };
    console.info('Parche BetPlay – registro:', payload);

    card.classList.add('is-sent');
  });

  /* Clear individual field errors on input */
  form.querySelectorAll('input').forEach(function (el) {
    el.addEventListener('input', function () {
      el.style.borderColor = '';
      el.removeAttribute('aria-invalid');
    });
  });
})();
