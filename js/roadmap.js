/* ------------ ROADMAP ------------ */
function renderizarRoadmap() {
    const container = $('#roadmap-container');
    container.empty();

    ROADMAP_DATA.forEach(fase => {
        const topicosHtml = fase.topicos.map(t => `<li>${t}</li>`).join('');
        const badgesHtml = fase.badges.map(b =>
            `<span class="badge bg-${b.cor} ${b.cor === 'warning' ? 'text-dark' : ''} me-1 mb-1">${b.texto}</span>`
        ).join(' ');

        const step = $(`
            <div class="roadmap-step card mb-3">
            
                <div class="card-header d-flex justify-content-between flex-wrap">
                    <span><strong>${fase.titulo}</strong></span>
                    <span>${badgesHtml}</span>
                </div>
                <div class="card-body">
                    <p><strong>Objetivo:</strong> ${fase.objetivo}</p>
                    <ul>${topicosHtml}</ul>
                </div>
            </div>
        `);

        container.append(step);
    });
}