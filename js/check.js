// ---------- ADD: clique no botão ao lado do input ----------
document.querySelectorAll('[data-add-item]').forEach(btn => {
    btn.addEventListener('click', () => {
        const group = btn.getAttribute('data-add-item'); // programacao | datascience | matematica | ml
        const input = document.querySelector(`[data-new-item-input="${group}"]`);
        const target = document.getElementById(`checklist-${group}`);
        if (!input || !target) return;

        const text = (input.value || '').trim();
        if (!text) { input.focus(); return; }

        target.appendChild(renderCheckItem({ text }));
        input.value = '';
        // TODO: salvar no localStorage por grupo
    });
});

// ---------- Exemplo inicial (pode remover) ----------
const ml = document.getElementById('checklist-ml');
if (ml) ml.appendChild(renderCheckItem({ text: 'Regressão Linear (prever número contínuo)' }));