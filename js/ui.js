// ds/js/ui.js
// Funções de interface (DOM), usando dados de data.js e estado de state.js

/* ================================
   CHECKLIST DINÂMICO
   ================================ */

// desenha UM grupo (ex: "programacao")
function renderizarChecklistGrupo(grupoNome) {
    const state = getChecklistState();
    const lista = state[grupoNome] || [];

    const $container = $(`[data-group="${grupoNome}"]`);
    $container.empty();

    lista.forEach(item => {
        const $linha = $(`
      <div class="check-item border-bottom border-secondary-subtle" data-id="${item.id}">
        <div class="form-check me-2">
          <input class="form-check-input checklist-toggle"
                 type="checkbox"
                 ${item.done ? 'checked' : ''}
                 data-grupo="${grupoNome}" data-id="${item.id}">
        </div>

        <div class="content flex-grow-1 min-w-0">
          <label class="form-check-label text-light checklist-text d-block"
                 data-grupo="${grupoNome}" data-id="${item.id}">
            ${item.texto}
          </label>
        </div>

        <div class="actions btn-group btn-group-sm flex-shrink-0">
          <button class="btn btn-outline-info btn-icon checklist-edit"
                  data-grupo="${grupoNome}" data-id="${item.id}">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-outline-danger btn-icon checklist-del"
                  data-grupo="${grupoNome}" data-id="${item.id}">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
    `);

        // interações
        $linha.find('.checklist-toggle').on('change', function () {
            toggleChecklistItem(grupoNome, item.id, this.checked);
            $linha.toggleClass('opacity-50', this.checked);
        });

        $linha.find('.checklist-edit').on('click', function () {
            const novo = prompt('Editar item:', item.texto);
            if (novo && novo.trim()) {
                renameChecklistItem(grupoNome, item.id, novo.trim());
                renderizarChecklistGrupo(grupoNome);
            }
        });

        $linha.find('.checklist-del').on('click', function () {
            removeChecklistItem(grupoNome, item.id);
            renderizarChecklistGrupo(grupoNome);
        });

        $container.append($linha);
    });
}

// desenha TODOS os grupos
function renderizarChecklistCompleto() {
    ['programacao', 'datascience', 'matematica', 'ml'].forEach(renderizarChecklistGrupo);
}



// inicializa listeners do checklist (delegação)
function inicializarChecklistListeners() {

    // marcar / desmarcar
    $(document).on('change', '.checklist-toggle', function () {
        const grupo = $(this).data('grupo');
        const id = $(this).data('id');
        const done = $(this).is(':checked');
        toggleChecklistItem(grupo, id, done);
        atualizarBadgeChecklistRapido();
    });

    // deletar item
    $(document).on('click', '.checklist-del', function () {
        const grupo = $(this).data('grupo');
        const id = $(this).data('id');

        if (!confirm('Remover este item do checklist?')) return;

        removeChecklistItem(grupo, id);
        renderizarChecklistGrupo(grupo);
        atualizarBadgeChecklistRapido();
    });

    // renomear item
    $(document).on('click', '.checklist-edit', function () {
        const grupo = $(this).data('grupo');
        const id = $(this).data('id');

        const $label = $(`.checklist-text[data-grupo="${grupo}"][data-id="${id}"]`);
        const textoAtual = $label.text().trim();

        const novoTexto = prompt('Editar item:', textoAtual);
        if (!novoTexto) return;

        renameChecklistItem(grupo, id, novoTexto);
        renderizarChecklistGrupo(grupo);
    });

    // adicionar item novo
    $(document).on('click', '[data-add-item]', function () {
        const grupo = $(this).data('add-item');
        const $input = $(`[data-new-item-input="${grupo}"]`);
        const texto = ($input.val() || '').trim();
        if (!texto) return;

        addChecklistItem(grupo, texto);
        $input.val('');
        renderizarChecklistGrupo(grupo);
        atualizarBadgeChecklistRapido();
    });

}

/* mostra progresso tipo "4/6" no badge verde do header */
function atualizarBadgeChecklistRapido() {
    const st = getChecklistState();
    let total = 0;
    let feitos = 0;

    Object.values(st).forEach(lista => {
        lista.forEach(item => {
            total += 1;
            if (item.done) feitos += 1;
        });
    });

    $('#badge-checklist-hoje').text(`${feitos}/${total}`);
}

/* ------------ PROJETOS ------------ */
function renderizarProjetos() {
    const container = $('#projetos-container');
    container.empty();

    PROJETOS_DATA.forEach(projeto => {
        const badgeTexto =
            projeto.dificuldade === 'iniciante' ? 'Iniciante' :
                projeto.dificuldade === 'intermediário' ? 'Intermediário' :
                    'Avançado';

        const cardHeaderClass =
            projeto.dificuldade === 'iniciante' ? 'bg-success text-white' :
                projeto.dificuldade === 'intermediário' ? 'bg-warning text-dark' :
                    'bg-danger text-white';

        const habilidadesBadges = projeto.habilidades
            .map(h => `<span class="badge bg-primary">${h}</span>`)
            .join(' ');

        const atividadesHtml = projeto.atividades
            .map(a => `<li>${a}</li>`)
            .join('');

        const card = $(`
            <div class="col-lg-6">
                <div class="card h-100">
                    <div class="card-header ${cardHeaderClass}">
                        <div class="d-flex justify-content-between align-items-start flex-wrap">
                            <h5 class="mb-0">${projeto.titulo}</h5>
                            <span class="badge ${projeto.dificuldade === 'iniciante' ? 'bg-light text-dark' : 'bg-dark'}">${badgeTexto}</span>
                        </div>
                    </div>
                    <div class="card-body">
                        <p><strong>Descrição:</strong> ${projeto.descricao}</p>

                        <p class="mb-1"><strong>O que fazer:</strong></p>
                        <ul>${atividadesHtml}</ul>

                        <p class="mb-1"><strong>Habilidades treinadas:</strong></p>
                        <div class="d-flex flex-wrap gap-2">
                            ${habilidadesBadges}
                        </div>
                    </div>
                </div>
            </div>
        `);

        container.append(card);
    });
}

/* ------------ GRADE CURRICULAR ------------ */
function renderizarGradeCurricular() {
    const accordion = $('#accordionGrade');
    accordion.empty();

    const periodos = carregarPeriodosCurso(); // agora é síncrono

    Object.keys(periodos)
        .sort((a, b) => parseInt(a) - parseInt(b))
        .forEach((periodo, idx) => {
            const disciplinas = periodos[periodo];

            let totalCH = 0;
            let totalCreditos = 0;

            const linhasTabela = disciplinas.map(disc => {
                totalCH += disc.ch;
                totalCreditos += disc.creditos;
                const preRequisitos = disc.pre.length > 0 ? disc.pre.join(', ') : 'Nenhum';

                return `
                    <tr>
                        <td>${disc.codigo}</td>
                        <td>${disc.nome}</td>
                        <td>${disc.ch}h</td>
                        <td>${disc.creditos}</td>
                        <td>${preRequisitos}</td>
                    </tr>
                `;
            }).join('');

            const periodoNum = parseInt(periodo);
            const periodoTexto = `${periodoNum}º Período`;
            const collapseId = `collapse${periodo}`;
            const headingId = `heading${periodo}`;

            const accordionItem = $(`
                <div class="accordion-item bg-dark text-light border-secondary">
                    <h2 class="accordion-header" id="${headingId}">
                        <button class="accordion-button ${idx === 0 ? '' : 'collapsed'} bg-secondary text-light"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#${collapseId}"
                                aria-expanded="${idx === 0 ? 'true' : 'false'}"
                                aria-controls="${collapseId}">
                            <strong>${periodoTexto}</strong>
                            <span class="ms-3 text-muted">— ${totalCH}h | ${totalCreditos} créditos</span>
                        </button>
                    </h2>
                    <div id="${collapseId}" class="accordion-collapse collapse ${idx === 0 ? 'show' : ''}"
                         aria-labelledby="${headingId}"
                         data-bs-parent="#accordionGrade">
                        <div class="accordion-body">
                            <div class="table-responsive">
                                <table class="table table-dark table-hover">
                                    <thead>
                                        <tr>
                                            <th>Código</th>
                                            <th>Disciplina</th>
                                            <th>CH Total</th>
                                            <th>Créditos</th>
                                            <th>Pré-requisitos</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${linhasTabela}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            `);

            accordion.append(accordionItem);
        });
}

/* ------------ TODO / KANBAN ------------ */
// function adicionarTarefa(coluna) {
//     const $input = $(`#input-${coluna}`);
//     const texto = $input.val().trim();
//     if (!texto) return;

//     adicionarTarefaNaLista(coluna, texto);
//     salvarTodoLista(coluna);
//     $input.val('');
// }

// function removerTarefa(btn, coluna) {
//     $(btn).closest('li').remove();
//     salvarTodoLista(coluna);
// }

/* ------------ DATA LAB ------------ */
function calcularMedia() {
    const input = $('#input-numeros').val();
    const numeros = input
        .split(',')
        .map(n => parseFloat(n.trim()))
        .filter(n => !isNaN(n));

    const resultado = $('#resultado-media');

    if (!numeros.length) {
        resultado.html('<div class="alert alert-danger">Por favor, insira números válidos.</div>');
        return;
    }

    const soma = numeros.reduce((acc, v) => acc + v, 0);
    const media = soma / numeros.length;

    resultado.html(`
        <div class="alert alert-success">
            <h6>Resultado:</h6>
            <p><strong>Média:</strong> ${media.toFixed(2)}</p>
            <p><strong>Quantidade de números:</strong> ${numeros.length}</p>
            <p><strong>Soma total:</strong> ${soma.toFixed(2)}</p>
        </div>
    `);
}

function calcularEstatisticas() {
    const input = $('#input-numeros').val();
    const numeros = input
        .split(',')
        .map(n => parseFloat(n.trim()))
        .filter(n => !isNaN(n));

    const resultado = $('#resultado-estatisticas');

    if (!numeros.length) {
        resultado.html('<div class="alert alert-danger">Por favor, insira números válidos.</div>');
        return;
    }

    const ordenados = [...numeros].sort((a, b) => a - b);
    const soma = ordenados.reduce((acc, v) => acc + v, 0);
    const media = soma / ordenados.length;

    const mediana = ordenados.length % 2 === 0
        ? (ordenados[ordenados.length / 2 - 1] + ordenados[ordenados.length / 2]) / 2
        : ordenados[Math.floor(ordenados.length / 2)];

    const variancia = ordenados.reduce((acc, v) => acc + Math.pow(v - media, 2), 0) / ordenados.length;
    const desvio = Math.sqrt(variancia);
    const min = ordenados[0];
    const max = ordenados[ordenados.length - 1];

    resultado.html(`
        <div class="alert alert-success">
            <h6>Estatísticas Descritivas:</h6>
            <ul class="mb-0">
                <li><strong>Média:</strong> ${media.toFixed(2)}</li>
                <li><strong>Mediana:</strong> ${mediana.toFixed(2)}</li>
                <li><strong>Desvio Padrão:</strong> ${desvio.toFixed(2)}</li>
                <li><strong>Variância:</strong> ${variancia.toFixed(2)}</li>
                <li><strong>Mínimo:</strong> ${min}</li>
                <li><strong>Máximo:</strong> ${max}</li>
                <li><strong>Amplitude:</strong> ${(max - min).toFixed(2)}</li>
            </ul>
        </div>
    `);
}

/* ------------ ML DEMO ------------ */
function preverPreco() {
    const area = parseFloat($('#ml-area').val()) || 0;
    const quartos = parseFloat($('#ml-quartos').val()) || 0;
    const banheiros = parseFloat($('#ml-banheiros').val()) || 0;
    const idade = parseFloat($('#ml-idade').val()) || 0;

    // modelo fake só pra demo
    const precoBase = 5000;
    const precoPorM2 = 3000;
    const precoPorQuarto = 50000;
    const precoPorBanheiro = 30000;
    const descontoPorAno = 2000;

    let preco = precoBase +
        (area * precoPorM2) +
        (quartos * precoPorQuarto) +
        (banheiros * precoPorBanheiro) -
        (idade * descontoPorAno);

    if (preco < 0) preco = 0;

    $('#ml-resultado').html(`
        <div class="alert alert-primary">
            <h5>Previsão de Preço</h5>
            <h3 class="text-success">R$ ${preco.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}</h3>
            <hr>
            <p class="mb-1"><strong>Características do imóvel:</strong></p>
            <ul class="mb-0">
                <li>Área: ${area} m²</li>
                <li>Quartos: ${quartos}</li>
                <li>Banheiros: ${banheiros}</li>
                <li>Idade: ${idade} anos</li>
            </ul>
        </div>
        <div class="alert alert-warning mt-2">
            <small><i class="bi bi-info-circle"></i>
            Esta é apenas uma simulação. Um modelo real seria treinado com dados históricos reais,
            incluiria localização, condição do imóvel, etc.</small>
        </div>
    `);
}

let tarefaSendoArrastada = null;   // referência ao <li> arrastado
let colunaOrigem = null;           // "estudar" | "praticar" | "entregar"

// function inicializarDragAndDropTodo() {

//     // quando começa a arrastar
//     $(document).on('dragstart', '.todo-item', function (e) {
//         tarefaSendoArrastada = this; // DOM <li>
//         colunaOrigem = $(this).closest('.todo-coluna').data('coluna');

//         // efeito visual padrão
//         e.originalEvent.dataTransfer.effectAllowed = 'move';

//         // opcional: classe visual
//         $(this).addClass('opacity-50');
//     });

//     // quando termina o drag (soltou em algum lugar, válido ou não)
//     $(document).on('dragend', '.todo-item', function () {
//         $(this).removeClass('opacity-50');
//         tarefaSendoArrastada = null;
//         colunaOrigem = null;
//         $('.todo-coluna').removeClass('drag-over');
//     });

//     // quando o item arrastado passa por cima de uma coluna
//     $(document).on('dragover', '.todo-coluna', function (e) {
//         e.preventDefault(); // necessário pra permitir drop
//         $(this).addClass('drag-over');
//         e.originalEvent.dataTransfer.dropEffect = 'move';
//     });

//     // quando sai de cima da coluna
//     $(document).on('dragleave', '.todo-coluna', function () {
//         $(this).removeClass('drag-over');
//     });

//     // soltar dentro da coluna
//     $(document).on('drop', '.todo-coluna', function (e) {
//         e.preventDefault();
//         $(this).removeClass('drag-over');

//         if (!tarefaSendoArrastada) return;

//         const $colunaDestino = $(this);
//         const colunaDestino = $colunaDestino.data('coluna');

//         // se o drop aconteceu em cima de outra task dentro da lista,
//         // tentar inserir antes/after. vamos pegar o elemento mais próximo
//         // da posição do mouse:
//         const mouseY = e.originalEvent.clientY;

//         // pega todos os .todo-item já nessa coluna de destino
//         const $itensDestino = $colunaDestino.children('.todo-item');

//         if ($itensDestino.length === 0) {
//             // coluna vazia: só append
//             $colunaDestino.append(tarefaSendoArrastada);
//         } else {
//             // encontrar o item mais próximo verticalmente
//             let inserido = false;
//             $itensDestino.each(function () {
//                 const box = this.getBoundingClientRect();
//                 const boxMiddle = box.top + box.height / 2;

//                 if (mouseY < boxMiddle) {
//                     $(this).before(tarefaSendoArrastada);
//                     inserido = true;
//                     return false; // break
//                 }
//             });
//             if (!inserido) {
//                 // se não inseriu antes de ninguém, vai pro fim
//                 $colunaDestino.append(tarefaSendoArrastada);
//             }
//         }

//         // depois de mover visualmente, salvar ambas colunas!
//         salvarTodoLista(colunaOrigem);
//         if (colunaDestino !== colunaOrigem) {
//             salvarTodoLista(colunaDestino);
//         }
//     });
// }

