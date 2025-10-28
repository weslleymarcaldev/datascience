// ds/js/app.js

// roda quando o DOM base (index.php) está pronto
$(document).ready(function () {
    inicializarApp();
});

function inicializarApp() {
    configurarNavegacao();       // sidebar (lateral)
    configurarAtalhosRapidos();  // header (atalhos rápidos)
    inicializarChecklistListeners();
    inicializarDragAndDropTodo();

    // pega a última seção visitada
    let secaoInicial = 'resumo';
    try {
        const salva = localStorage.getItem('ultimaSecao');
        if (salva && typeof salva === 'string') {
            secaoInicial = salva;
        }
    } catch (err) {
        console.warn('Não consegui ler ultimaSecao do localStorage:', err);
    }

    carregarSecao(secaoInicial);
    atualizarBadgeChecklistRapido();
}


function configurarNavegacao() {
    $('#sidebar').on('click', 'a[data-section], .sidebar-link[data-section]', function (e) {
        e.preventDefault();
        const secao = $(this).data('section');
        if (!secao) return;
        carregarSecao(secao);
    });
}

function configurarAtalhosRapidos() {
    $(document).on('click', '.action-open', function (e) {
        e.preventDefault();
        const alvo = $(this).data('target'); // "checklist", "todo", "anotacoes", etc.
        if (!alvo) return;
        carregarSecao(alvo);
    });
}


// carrega o HTML parcial e injeta em #page-container
function carregarSecao(secao) {
    // salvar última seção vista
    try {
        localStorage.setItem('ultimaSecao', secao);
    } catch (err) {
        console.warn('Não consegui salvar ultimaSecao no localStorage:', err);
    }

    $('#page-container').load(`sections/${secao}.html`, function() {
        // este callback roda DEPOIS que o HTML foi injetado

        if (secao === 'projetos') {
            if (typeof renderizarProjetos === 'function') {
                renderizarProjetos();
            }
        }

        if (secao === 'roadmap') {
            if (typeof renderizarRoadmap === 'function') {
                renderizarRoadmap();
            }
        }

        if (secao === 'grade') {
            if (typeof renderizarGradeCurricular === 'function') {
                renderizarGradeCurricular();
            }
        }

        if (secao === 'todo') {
            if (typeof inicializarTodoListas === 'function') {
                inicializarTodoListas();
            }
        }

        if (secao === 'checklist') {
            renderizarChecklistCompleto();
            atualizarBadgeChecklistRapido();
        }

        if (secao === 'anotacoes') {
            if (typeof initNotas === 'function') {
                initNotas();
            }
            if (typeof carregarNotas === 'function') {
                carregarNotas();
            }
        }


        // --- destacar item correto na SIDEBAR ---
        $('#sidebar .sidebar-link').removeClass('active');
        $(`#sidebar .sidebar-link[data-section="${secao}"]`).addClass('active');

        // --- destacar botão correto no TOPO (atalhos rápidos) ---
        // limpa todos
        $('.action-open').removeClass('action-open-active');
        // ativa só o que bate com essa seção
        $(`.action-open[data-target="${secao}"]`).addClass('action-open-active');
    });
}


/*
 * Eventos dinâmicos
 * Em vez de adicionar listeners em elementos que ainda não existem,
 * usamos delegação global com $(document).on(...)
 * Isso garante que quando checklist.html for carregado via .load(),
 * os <input class="checklist-item"> já vão disparar salvarChecklist().
 */
$(document).on('change', '.checklist-item', function () {
    if (typeof salvarChecklist === 'function') {
        salvarChecklist();
    }
});

// expor funções globais usadas diretamente no HTML parcial via onclick="..."
if (typeof adicionarTarefa === 'function')        window.adicionarTarefa        = adicionarTarefa;
if (typeof removerTarefa === 'function')          window.removerTarefa          = removerTarefa;
if (typeof salvarNotas === 'function')            window.salvarNotas            = salvarNotas;
if (typeof carregarNotas === 'function')          window.carregarNotas          = carregarNotas;
if (typeof limparNotas === 'function')            window.limparNotas            = limparNotas;
if (typeof calcularMedia === 'function')          window.calcularMedia          = calcularMedia;
if (typeof calcularEstatisticas === 'function')   window.calcularEstatisticas   = calcularEstatisticas;
if (typeof preverPreco === 'function')            window.preverPreco            = preverPreco;
