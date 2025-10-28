// ds/js/state.js
// Persistência em localStorage e helpers de checklist/Kanban/notas

const STATE_KEYS = {
    CHECKLIST: 'cdd_checklist',
    TODO_ESTUDAR: 'cdd_todo_estudar',
    TODO_PRATICAR: 'cdd_todo_praticar',
    TODO_ENTREGAR: 'cdd_todo_entregar',
    NOTAS: 'cdd_notas'
};

/* =========================================================
   STORAGE HELPERS
   ========================================================= */
let APP_STATE = {};

function carregarState(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return fallback;
        return JSON.parse(raw);
    } catch (err) {
        console.error("Erro ao carregar do localStorage:", err);
        return fallback;
    }
}


function salvarState() {
    try {
        localStorage.setItem('cdd_state', JSON.stringify(APP_STATE));
    } catch (err) {
        console.error("Erro ao salvar no localStorage:", err);
    }
}


function limparState(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Erro ao limpar localStorage:', error);
        return false;
    }
}

/* =========================================================
   CHECKLIST DINÂMICO
   ========================================================= */
/* ---------- checklist ---------- */
function salvarChecklist() {
    const checklist = {};
    $('.checklist-item').each(function() {
        const item = $(this).data('item');
        checklist[item] = $(this).is(':checked');
    });
    return salvarState(STATE_KEYS.CHECKLIST, checklist);
}
function carregarChecklist() {
    const checklist = carregarState(STATE_KEYS.CHECKLIST, {});
    Object.keys(checklist).forEach(item => {
        $(`[data-item="${item}"]`).prop('checked', checklist[item]);
    });
}
// estado inicial default se não existir nada salvo ainda
function checklistEstadoInicial() {
    return {
        programacao: [
            { id: "python-basico",        texto: "Python básico (variáveis, if, for, funções)",              done: false },
            { id: "git-github",          texto: "Git e GitHub (commit, push, branch)",                      done: false },
            { id: "terminal",            texto: "Terminal / linha de comando básica",                       done: false },
            { id: "estrutura-projeto",   texto: "Organizar projeto em pastas (src/, data/, notebooks/)",    done: false },
            { id: "ler-dados",           texto: "Ler CSV / JSON em Python",                                 done: false },
            { id: "sql-basico",          texto: "SQL básico (SELECT, WHERE, JOIN simples)",                 done: false },
            { id: "oop",                 texto: "POO (classes, métodos, objetos)",                          done: false },
            { id: "apis-rest",           texto: "Consumir API REST (requests, headers, JSON)",              done: false },
            { id: "criar-api",           texto: "Criar mini API (FastAPI / Flask)",                         done: false }
        ],

        matematica: [
            { id: "estatistica-descritiva", texto: "Estatística descritiva (média, mediana, desvio)",       done: false },
            { id: "probabilidade-basica",  texto: "Probabilidade básica (eventos, independência)",         done: false },
            { id: "algebra-linear",        texto: "Álgebra Linear (vetor, matriz, multiplicação)",         done: false },
            { id: "calculo-derivada",      texto: "Cálculo: derivada como taxa de variação",                done: false },
            { id: "distribuicoes",         texto: "Distribuições (normal, binomial) e quando usar",        done: false },
            { id: "regressao-formula",     texto: "Regressão linear como equação (y = a*x + b)",           done: false },
            { id: "correlacao-causalidade",texto: "Diferença entre correlação e causalidade",              done: false }
        ],

        datascience: [
            { id: "pandas-load",          texto: "Carregar dados com Pandas",                               done: false },
            { id: "pandas-clean",         texto: "Limpeza: valores ausentes / duplicados",                  done: false },
            { id: "pandas-groupby",       texto: "Transformações: groupby / agregações / merge",           done: false },
            { id: "viz-basica",           texto: "Visualização (linha, barra, hist, scatter)",             done: false },
            { id: "eda",                  texto: "EDA: encontrar padrões e outliers",                       done: false },
            { id: "storytelling",         texto: "Storytelling com dados (explicar achados)",               done: false },
            { id: "dashboard",            texto: "Dashboard simples (Streamlit / Plotly)",                  done: false },
            { id: "entregar-resultados",  texto: "Exportar resultado (PDF/notebook/apresentação)",         done: false }
        ],

        ml: [
            { id: "regressao-linear",      texto: "Regressão Linear (prever número contínuo)",              done: false },
            { id: "regressao-logistica",   texto: "Regressão Logística (classificação binária)",            done: false },
            { id: "metricas-classif",      texto: "Métricas de classificação (Precisão, Recall, F1)",       done: false },
            { id: "metricas-regressao",    texto: "Métricas de regressão (MAE, RMSE)",                      done: false },
            { id: "train-test",            texto: "Separar treino/teste e validação",                       done: false },
            { id: "overfitting",           texto: "Overfitting vs generalização",                           done: false },
            { id: "arvores",               texto: "Árvores de Decisão / Random Forest",                     done: false },
            { id: "ml-supervisionado",     texto: "ML Supervisionado (modelo aprende com rótulo)",          done: false },
            { id: "ml-nao-supervisionado", texto: "ML Não Supervisionado (clustering, K-Means)",            done: false },
            { id: "feature-eng",           texto: "Feature engineering básica",                             done: false },
            { id: "deploy-modelo",         texto: "Deploy simples do modelo (API que devolve previsão)",    done: false }
        ]
    };
}
// pega checklist completo
function getChecklistState() {
    let state = carregarState(STATE_KEYS.CHECKLIST, null);

    if (!state) {
        state = checklistEstadoInicial();
        salvarState(STATE_KEYS.CHECKLIST, state);
        return state;
    }

    const pareceNovoFormato =
        typeof state === 'object' &&
        Array.isArray(state.programacao) &&
        Array.isArray(state.matematica) &&
        Array.isArray(state.datascience) &&
        Array.isArray(state.ml);

    if (!pareceNovoFormato) {
        state = checklistEstadoInicial();
        salvarState(STATE_KEYS.CHECKLIST, state);
    }

    return state;
}
// salva checklist completo
function setChecklistState(state) {
    salvarState(STATE_KEYS.CHECKLIST, state);
}
// marca/desmarca um item
function toggleChecklistItem(grupo, itemId, novoValorDone) {
    const state = getChecklistState();
    const lista = state[grupo] || [];
    const item = lista.find(it => it.id === itemId);
    if (item) {
        item.done = novoValorDone;
        setChecklistState(state);
    }
}
// adiciona um item novo
function addChecklistItem(grupo, texto) {
    const state = getChecklistState();
    if (!state[grupo]) state[grupo] = [];

    const novo = {
        id: gerarIdChecklist(texto),
        texto,
        done: false
    };

    state[grupo].push(novo);
    setChecklistState(state);
    return novo;
}
// edita o texto do item
function renameChecklistItem(grupo, itemId, novoTexto) {
    const state = getChecklistState();
    const lista = state[grupo] || [];
    const item = lista.find(it => it.id === itemId);
    if (item) {
        item.texto = novoTexto;
        setChecklistState(state);
    }
}
// remove item
function removeChecklistItem(grupo, itemId) {
    const state = getChecklistState();
    state[grupo] = (state[grupo] || []).filter(it => it.id !== itemId);
    setChecklistState(state);
}
// gera id simples baseado no texto
function gerarIdChecklist(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // tira acento
        .replace(/[^a-z0-9]+/g, '-') // troca espaços e símbolos por '-'
        .replace(/(^-|-$)/g, '')    // tira - no começo/fim
        + "-" + Date.now().toString(36);
}

/* =========================================================
   KANBAN / TO-DO
   ========================================================= */

function salvarTodoLista(coluna) {
    const tarefas = [];
    $(`#lista-${coluna} li`).each(function() {
        tarefas.push({
            id:    $(this).data('task-id'),
            texto: $(this).find('.tarefa-texto').text().trim()
        });
    });

    const key =
        coluna === 'estudar'  ? STATE_KEYS.TODO_ESTUDAR  :
        coluna === 'praticar' ? STATE_KEYS.TODO_PRATICAR :
                                 STATE_KEYS.TODO_ENTREGAR;

    return salvarState(key, tarefas);
}
function carregarTodoLista(coluna) {
    const key =
        coluna === 'estudar'  ? STATE_KEYS.TODO_ESTUDAR  :
        coluna === 'praticar' ? STATE_KEYS.TODO_PRATICAR :
                                 STATE_KEYS.TODO_ENTREGAR;

    return carregarState(key, null);
}
// desenha 1 item visual na coluna
function adicionarTarefaNaLista(coluna, texto) {
    const $lista = $(`#lista-${coluna}`);

    // cria um ID estável pra essa tarefa
    // assim conseguimos identificar quando arrastar
    const taskId = gerarIdChecklist(texto); // podemos reaproveitar o gerador de id

    const $item = $(`
        <li class="list-group-item bg-black text-light border-secondary d-flex justify-content-between align-items-center todo-item"
            draggable="true"
            data-task-id="${taskId}">
            
            <span class="tarefa-texto flex-grow-1">${texto}</span>
            <button class="btn btn-sm btn-outline-danger ms-2 flex-shrink-0" onclick="removerTarefa(this, '${coluna}')">
                <i class="bi bi-x"></i>
            </button>
        </li>
    `);

    $lista.append($item);
}

function normalizarListaTarefas(listaCrua) {
    // nada salvo ainda
    if (!listaCrua) return [];

    // se veio string (erro antigo: storage errado)
    if (typeof listaCrua === 'string') {
        try {
            const parsed = JSON.parse(listaCrua);
            return normalizarListaTarefas(parsed);
        } catch {
            return [{ id: gerarIdChecklist(listaCrua), texto: listaCrua }];
        }
    }

    // se veio array de strings
    if (Array.isArray(listaCrua) && typeof listaCrua[0] === 'string') {
        return listaCrua.map(str => ({
            id: gerarIdChecklist(str),
            texto: str
        }));
    }

    // se veio array de objetos
    if (Array.isArray(listaCrua) && typeof listaCrua[0] === 'object') {
        return listaCrua.map(item => ({
            id: item.id || gerarIdChecklist(item.texto || 'tarefa'),
            texto: item.texto || 'Tarefa sem nome'
        }));
    }

    // se veio objeto simples (formato muito antigo)
    if (typeof listaCrua === 'object') {
        return Object.keys(listaCrua).map(k => ({
            id: gerarIdChecklist(k),
            texto: k
        }));
    }

    return [];
}

// inicializa colunas com o que estiver salvo ou com defaults
function inicializarTodoListas() {
    ['estudar', 'praticar', 'entregar'].forEach(coluna => {

        // carrega qualquer coisa que exista
        let tarefas = carregarTodoLista(coluna);

        // normaliza formato
        tarefas = normalizarListaTarefas(tarefas);

        // se depois da normalização ficou vazio, aplica defaults
        if (!tarefas.length) {
            if (coluna === 'estudar') {
                tarefas = [
                    { id: gerarIdChecklist("Python básico"), texto: "Python básico" },
                    { id: gerarIdChecklist("SQL básico"), texto: "SQL básico" },
                    { id: gerarIdChecklist("Pandas introdutório"), texto: "Pandas introdutório" }
                ];
            } else if (coluna === 'praticar') {
                tarefas = [
                    { id: gerarIdChecklist("Mini análise exploratória"), texto: "Mini análise exploratória" },
                    { id: gerarIdChecklist("Plotar gráfico com Matplotlib"), texto: "Plotar gráfico com Matplotlib" },
                    { id: gerarIdChecklist("Treinar modelo simples"), texto: "Treinar modelo simples" },
                    { id: gerarIdChecklist("Rodar previsão no ML Demo"), texto: "Rodar previsão no ML Demo" }
                ];
            } else if (coluna === 'entregar') {
                tarefas = [
                    { id: gerarIdChecklist("Subir projeto no GitHub"), texto: "Subir projeto no GitHub" },
                    { id: gerarIdChecklist("Atualizar LinkedIn com projeto"), texto: "Atualizar LinkedIn com projeto" }
                ];
            }
        }

        // salva tudo agora já convertido pro formato novo
        const key =
            coluna === 'estudar'  ? STATE_KEYS.TODO_ESTUDAR  :
            coluna === 'praticar' ? STATE_KEYS.TODO_PRATICAR :
                                     STATE_KEYS.TODO_ENTREGAR;
        salvarState(key, tarefas);

        // render visual
        const $lista = $(`#lista-${coluna}`);
        $lista.empty();

        tarefas.forEach(tarefa => {
            const $item = $(`
                <li class="list-group-item bg-black text-light border-secondary d-flex justify-content-between align-items-center todo-item"
                    draggable="true"
                    data-task-id="${tarefa.id}">
                    
                    <span class="tarefa-texto flex-grow-1">${tarefa.texto}</span>
                    <button class="btn btn-sm btn-outline-danger ms-2 flex-shrink-0" onclick="removerTarefa(this, '${coluna}')">
                        <i class="bi bi-x"></i>
                    </button>
                </li>
            `);

            $lista.append($item);
        });
    });
}

function resetarTodoLocal() {
    localStorage.removeItem(STATE_KEYS.TODO_ESTUDAR);
    localStorage.removeItem(STATE_KEYS.TODO_PRATICAR);
    localStorage.removeItem(STATE_KEYS.TODO_ENTREGAR);
    inicializarTodoListas();
}

/* =========================================================
   LISTENERS GLOBAIS
   ========================================================= */
function inicializarStateListeners() {
    // checklist salva automático
    $('.checklist-item').on('change', function() {
        salvarChecklist();
    });
}
