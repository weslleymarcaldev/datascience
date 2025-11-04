// ds/js/todo.js
"use strict";

/* =========================================
   ESTADO GLOBAL
========================================= */
let BOARD_STATE = {
    tasks: {},
    order: { estudar: [], praticar: [], entregar: [] }
};
let COLUMNS = [
    { id: "estudar", title: "Estudar", icon: "bi-book", headerClass: "bg-primary text-white", btnClass: "btn btn-primary" },
    { id: "praticar", title: "Praticar", icon: "bi-code-slash", headerClass: "bg-warning text-dark", btnClass: "btn btn-warning text-dark" },
    { id: "entregar", title: "Entregar", icon: "bi-check-circle", headerClass: "bg-success text-white", btnClass: "btn btn-success" }
    // ex.: { id:"revisar", title:"Revisar", icon:"bi-eye", headerClass:"bg-info text-dark", btnClass:"btn btn-info text-dark" }
];

// Ícones curados para Kanban/To-do
const COLUMN_ICONS = [
    // Ações
    "bi-plus", "bi-plus-lg", "bi-plus-circle", "bi-plus-square",
    "bi-pencil-square", "bi-pencil", "bi-pen",
    "bi-trash", "bi-trash-fill", "bi-x", "bi-x-lg", "bi-x-circle", "bi-x-square",
    "bi-save", "bi-save-fill", "bi-floppy", "bi-floppy-fill",
    "bi-share", "bi-link", "bi-link-45deg", "bi-paperclip",

    // Navegação / movimento
    "bi-arrow-left", "bi-arrow-right", "bi-arrow-up", "bi-arrow-down",
    "bi-arrow-left-short", "bi-arrow-right-short", "bi-arrow-up-short", "bi-arrow-down-short",
    "bi-chevron-left", "bi-chevron-right", "bi-chevron-up", "bi-chevron-down",
    "bi-arrows-move", "bi-grip-vertical", "bi-grip-horizontal",

    // Estado / feedback
    "bi-check", "bi-check-lg", "bi-check-circle", "bi-check-circle-fill",
    "bi-check-square", "bi-check-square-fill",
    "bi-exclamation-circle", "bi-exclamation-triangle", "bi-exclamation-octagon",
    "bi-info", "bi-info-circle", "bi-info-lg",
    "bi-eye", "bi-eye-slash", "bi-bell", "bi-bell-fill", "bi-flag", "bi-flag-fill", "bi-star", "bi-star-fill",

    // Busca / filtro / ordenação
    "bi-search", "bi-filter", "bi-funnel",
    "bi-sort-alpha-down", "bi-sort-alpha-up", "bi-sort-numeric-down", "bi-sort-numeric-up",

    // Datas e tempo
    "bi-calendar", "bi-calendar-check", "bi-calendar-plus", "bi-calendar-x",
    "bi-clock", "bi-stopwatch",

    // Organização / conteúdo
    "bi-kanban", "bi-columns", "bi-list-task", "bi-card-checklist",
    "bi-clipboard-check", "bi-clipboard-data", "bi-tag", "bi-tags",
    "bi-book", "bi-code-slash", "bi-rocket", "bi-lightning-charge",

    // Usuários e segurança
    "bi-person", "bi-people", "bi-person-check", "bi-lock", "bi-unlock",

    // Upload / download / nuvem
    "bi-upload", "bi-download", "bi-cloud-upload", "bi-cloud-download", "bi-cloud-check",

    // Mídia
    "bi-image", "bi-camera"
];
const COLUMN_THEMES = {
    primary: { headerClass: "bg-primary text-white", btnClass: "btn btn-primary", label: "Azul" },
    success: { headerClass: "bg-success text-white", btnClass: "btn btn-success", label: "Verde" },
    warning: { headerClass: "bg-warning text-dark", btnClass: "btn btn-warning text-dark", label: "Amarelo" },
    danger: { headerClass: "bg-danger text-white", btnClass: "btn btn-danger", label: "Vermelho" },
    info: { headerClass: "bg-info text-dark", btnClass: "btn btn-info text-dark", label: "Azul Claro" },
    secondary: { headerClass: "bg-secondary text-white", btnClass: "btn btn-secondary", label: "Cinza" },
    dark: { headerClass: "bg-dark text-light", btnClass: "btn btn-dark", label: "Preto" }
};
// Ícones padrão por id de coluna
const DEFAULT_COLUMN_ICONS = {
    estudar: "bi-book",
    praticar: "bi-code-slash",
    entregar: "bi-check-circle",
    revisar: "bi-eye",
    prioridade: "bi-flag",
    rapido: "bi-lightning-charge"
};

const COLUMNS_KEY = 'cdd_columns';

const FILTERS = { mode: "todos", query: "" };
let CURRENT_TASK_ID = null;
let MODAL_INSTANCE = null;
let COL_MODAL; // bootstrap.Modal instance
let __colEditingId = null;

// tenta descobrir o tema atual olhando a classe antiga (caso já exista)
function inferThemeFromClass(headerClass = "") {
    if (headerClass.includes("bg-primary")) return "primary";
    if (headerClass.includes("bg-success")) return "success";
    if (headerClass.includes("bg-warning")) return "warning";
    if (headerClass.includes("bg-danger")) return "danger";
    if (headerClass.includes("bg-info")) return "info";
    if (headerClass.includes("bg-secondary")) return "secondary";
    if (headerClass.includes("bg-dark")) return "dark";
    return null;
}

/* =========================================
   STORAGE (localStorage)
========================================= */
function saveBoard() {
    localStorage.setItem("cdd_board", JSON.stringify(BOARD_STATE));
}

function loadBoard() {
    const raw = localStorage.getItem("cdd_board");
    if (raw) BOARD_STATE = JSON.parse(raw);
}

function editColumn(id) {
    const col = COLUMNS.find(c => c.id === id);
    if (!col) return;

    // 1) Título
    const novoTitulo = prompt("Novo nome da coluna:", col.title ?? "");
    if (novoTitulo === null) return; // cancelou

    // 2) Ícone (Bootstrap Icons)
    const novoIcone = prompt(
        'Ícone (Bootstrap Icons), ex: "bi-book", "bi-code-slash", "bi-eye"...',
        col.icon || "bi-kanban"
    );
    if (novoIcone === null) return;

    // 3) Tema/cor
    const temaAtual = col.theme || inferThemeFromClass(col.headerClass) || "primary";
    const novoTema = prompt(
        'Tema/cor (opções: primary, success, warning, danger, info, secondary, dark):',
        temaAtual
    );
    if (novoTema === null) return;

    const preset = COLUMN_THEMES[novoTema] || COLUMN_THEMES.primary;

    // aplica mudanças
    col.title = novoTitulo.trim() || col.title;
    col.icon = (novoIcone.trim() || "bi-kanban");
    col.headerClass = preset.headerClass;
    col.btnClass = preset.btnClass;
    col.theme = novoTema; // guardamos o tema escolhido para próximas edições

    saveColumns();
    saveBoard();
    renderColumnsShell();
    renderBoard();
    refreshModalColumnSelect();
}

// salva
function saveColumns() {
    localStorage.setItem(COLUMNS_KEY, JSON.stringify(COLUMNS));
}

// carrega
function loadColumns() {
    const raw = localStorage.getItem(COLUMNS_KEY);
    if (raw) {
        try { COLUMNS = JSON.parse(raw); } catch { }
    }
}

// Garante ícone válido em cada coluna
function ensureColumnIcons() {
    COLUMNS = COLUMNS.map(c => {
        let icon = c.icon || DEFAULT_COLUMN_ICONS[c.id] || "bi-kanban";
        // se o ícone atual não estiver na lista curada, troca pelo default/kanban
        if (!COLUMN_ICONS.includes(icon)) {
            icon = DEFAULT_COLUMN_ICONS[c.id] || "bi-kanban";
        }
        return { ...c, icon };
    });
}

/* ===== MIGRAÇÃO 1x DO MODELO ANTIGO -> NOVO ===== */
function migrateLegacyTodosIfNeeded() {
    if (BOARD_STATE && Object.keys(BOARD_STATE.tasks || {}).length) return;
    const LEGACY_KEYS = {
        estudar: "cdd_todo_estudar",
        praticar: "cdd_todo_praticar",
        entregar: "cdd_todo_entregar"
    };
    let migrated = false;

    ["estudar", "praticar", "entregar"].forEach(coluna => {
        try {
            const raw = localStorage.getItem(LEGACY_KEYS[coluna]);
            if (!raw) return;
            const arr = JSON.parse(raw);
            if (!Array.isArray(arr) || !arr.length) return;

            arr.forEach(item => {
                const titulo = (typeof item === "string")
                    ? item
                    : (item && (item.titulo || item.texto || item.name || item.label)) || "(sem título)";
                const id = "tsk_" + Date.now() + "_" + Math.floor(Math.random() * 1e6);
                BOARD_STATE.tasks[id] = {
                    id, titulo: String(titulo), descricao: "", coluna,
                    etiquetas: [], dataEntrega: "", lembreteOffset: "none",
                    checklist: [], comentarios: [],
                    historico: [{ quando: new Date().toISOString(), acao: "migrado", detalhe: `Migrado da lista antiga (${coluna})` }]
                };
                BOARD_STATE.order[coluna].push(id);
            });

            migrated = true;
        } catch (e) { console.warn("Falha migrando", coluna, e); }
    });

    if (migrated) { saveBoard(); console.info("Migração concluída: listas antigas → cdd_board"); }
}

/* =========================================
   HELPERS (Datas, Sanitização, Calendar)
========================================= */
function formatarData(iso) {
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
}

function formatarDataHora(iso) { return formatarData(iso); }

function toInputDatetimeLocal(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    const yyyy = d.getFullYear(), mm = String(d.getMonth() + 1).padStart(2, "0"), dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0"), mi = String(d.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

function fromInputDatetimeLocal(v) { return v ? v + ":00" : ""; }

function escapeHTML(str) {
    return String(str || "")
        .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function getDeadlineStatus(isoDataEntrega) {
    if (!isoDataEntrega) return { status: "sem-data", label: "", classe: "" };
    const agora = new Date(), entrega = new Date(isoDataEntrega);
    const hoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
    const diaEnt = new Date(entrega.getFullYear(), entrega.getMonth(), entrega.getDate());
    if (diaEnt.getTime() === hoje.getTime()) return { status: "hoje", label: "Hoje", classe: "badge bg-warning text-dark" };
    if (entrega < agora && diaEnt.getTime() !== hoje.getTime()) return { status: "atrasado", label: "Atrasado", classe: "badge bg-danger text-light" };
    return { status: "futuro", label: formatarData(isoDataEntrega), classe: "badge bg-secondary text-light" };
}
function gerarGoogleCalendarLink(tarefa) {
    if (!tarefa.dataEntrega) return "";
    const start = new Date(tarefa.dataEntrega);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    function toCal(dt) {
        const y = dt.getUTCFullYear(), m = String(dt.getUTCMonth() + 1).padStart(2, "0"), d = String(dt.getUTCDate()).padStart(2, "0");
        const hh = String(dt.getUTCHours()).padStart(2, "0"), mi = String(dt.getUTCMinutes()).padStart(2, "0"), ss = String(dt.getUTCSeconds()).padStart(2, "0");
        return `${y}${m}${d}T${hh}${mi}${ss}Z`;
    }
    const text = encodeURIComponent(tarefa.titulo || "Tarefa");
    const details = encodeURIComponent(tarefa.descricao || "");
    const dates = `${toCal(start)}/${toCal(end)}`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${details}&dates=${dates}`;
}

/* =========================================
   COLUNAS (helpers globais)
========================================= */
function ensureColumnsInState() {
    if (!BOARD_STATE.order) BOARD_STATE.order = {};
    COLUMNS.forEach(c => {
        if (!Array.isArray(BOARD_STATE.order[c.id])) BOARD_STATE.order[c.id] = [];
    });
    Object.keys(BOARD_STATE.order).forEach(k => {
        if (!COLUMNS.find(c => c.id === k)) delete BOARD_STATE.order[k];
    });
}

function refreshModalColumnSelect() {
    const sel = document.getElementById("task-coluna-select");
    if (!sel) return;
    sel.innerHTML = COLUMNS.map(c => `<option value="${c.id}">${c.title}</option>`).join("");
}

/* Configurar shell das colunas (HTML) */
function renderColumnsShell() {
    const host = document.getElementById("kanban-columns");
    if (!host) return;

    // monta os cards das colunas
    const safeCols = COLUMNS.map(c => ({
        icon: "bi-kanban",
        headerClass: "bg-secondary text-white",
        btnClass: "btn btn-outline-light",
        ...c
    }));

    // define classes cols-1 / cols-2 / cols-3 / cols-4 / cols-5 conforme quantidade
    const n = Math.min(safeCols.length, 5); // até 6 colunas lado a lado
    host.classList.remove("cols-1", "cols-2", "cols-3", "cols-4", "cols-5");
    host.classList.add(`cols-${n}`);
    host.innerHTML = safeCols.map(c => `
    <div class="kanban-col"> 
      <div class="card">
        <div class="card-header ${c.headerClass}">
          <h5 class="m-0 d-flex align-items-center gap-2">
            <i class="bi ${c.icon}"></i><span>${c.title}</span>
            <div class="ms-auto d-flex gap-1">
              <button type="button" title="Renomear coluna" class="btn btn-sm btn-outline-light" data-col-edit="${c.id}"><i class="bi bi-pencil"></i></button>
              <button type="button" title="Remover coluna" class="btn btn-sm btn-outline-light" data-col-del="${c.id}"><i class="bi bi-trash"></i></button>
            </div>
          </h5>
        </div>
        <div class="card-body">
          <ul id="lista-${c.id}" class="list-group list-group-flush todo-coluna" data-coluna="${c.id}"></ul>
          <div class="input-group mt-3">
            <input type="text" id="input-${c.id}" class="form-control bg-black text-light border-secondary" placeholder="Nova tarefa...">
            <button type="button" title="Adicionar tarefa" class="${c.btnClass}" onclick="adicionarTarefa('${c.id}')"><i class="bi bi-plus"></i></button>
          </div>
        </div>
      </div>
    </div>
  `).join("");

    // binds de ações do cabeçalho
    setupColumnEditorModal();

    host.querySelectorAll("[data-col-edit]").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-col-edit");
            openColumnModal("edit", id);
        });
    });

    host.querySelectorAll("[data-col-del]").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-col-del");
            askRemoveColumn(id);
        });
    });
}

/* =========================================
   COLUNAS (API pública)
========================================= */
function addColumn(cfg) {
    if (!cfg?.id || !cfg?.title) return;
    if (COLUMNS.find(c => c.id === cfg.id)) {
        alert("Já existe uma coluna com esse id.");
        return;
    }
    COLUMNS.push({
        icon: "bi-kanban",
        headerClass: "bg-secondary text-white",
        btnClass: "btn btn-outline-light",
        ...cfg
    });
    ensureColumnsInState();
    saveColumns();
    saveBoard();
    renderColumnsShell();
    renderBoard();
    refreshModalColumnSelect();
}

function renameColumn(id, newTitle) {
    const c = COLUMNS.find(x => x.id === id);
    if (!c) return;
    c.title = newTitle;
    saveColumns();
    saveBoard();
    renderColumnsShell();
    renderBoard();
    refreshModalColumnSelect();
}

function askRemoveColumn(id) {
    const col = COLUMNS.find(c => c.id === id);
    if (!col) return;
    if (!confirm(`Remover a coluna "${col.title}"?`)) return;
    const destino = prompt(
        "Digite o ID de uma coluna destino para mover as tarefas (ou deixe vazio para excluir as tarefas):",
        COLUMNS.find(c => c.id !== id)?.id || ""
    );
    removeColumn(id, destino || null);
}

function removeColumn(id, moveToId = null) {
    if (COLUMNS.length <= 1) {
        alert("Não é possível remover a única coluna restante." +
            "\n\n" +
            "Se você quiser continuar, crie uma nova coluna primeiro.");
        return;
    }
    const exists = COLUMNS.find(c => c.id === id);
    if (!exists) return;

    const taskIds = (BOARD_STATE.order[id] || []).slice();
    if (moveToId && COLUMNS.find(c => c.id === moveToId)) {
        if (!Array.isArray(BOARD_STATE.order[moveToId])) BOARD_STATE.order[moveToId] = [];
        taskIds.forEach(tid => {
            BOARD_STATE.order[moveToId].push(tid);
            if (BOARD_STATE.tasks[tid]) BOARD_STATE.tasks[tid].coluna = moveToId;
        });
    } else {
        taskIds.forEach(tid => { delete BOARD_STATE.tasks[tid]; });
    }
    delete BOARD_STATE.order[id];
    COLUMNS = COLUMNS.filter(c => c.id !== id);

    saveColumns();
    saveBoard();
    renderColumnsShell();
    renderBoard();
    refreshModalColumnSelect();
}

// Mapeia 'theme' -> classes visuais
function applyThemeToColumn(col, theme) {
    const map = {
        primary: { headerClass: "bg-primary text-white", btnClass: "btn btn-primary" },
        success: { headerClass: "bg-success text-white", btnClass: "btn btn-success" },
        warning: { headerClass: "bg-warning text-dark", btnClass: "btn btn-warning text-dark" },
        danger: { headerClass: "bg-danger text-white", btnClass: "btn btn-danger" },
        info: { headerClass: "bg-info text-dark", btnClass: "btn btn-info text-dark" },
        secondary: { headerClass: "bg-secondary text-white", btnClass: "btn btn-outline-light" }
    };
    const chosen = map[theme] || map.secondary;
    col.headerClass = chosen.headerClass;
    col.btnClass = chosen.btnClass;
    col.theme = theme;
    return col;
}

let COL_MODAL_INSTANCE = null;
function getColModal() {
    const el = document.getElementById('colModal');
    if (!el) return null;
    if (!COL_MODAL_INSTANCE) COL_MODAL_INSTANCE = new bootstrap.Modal(el, { focus: true });
    return COL_MODAL_INSTANCE;
}

// Abre modal em modo "edit" ou "create"
function openColumnModal(mode, colId = null) {
    const isCreate = mode === "create";
    document.getElementById("colMode").value = isCreate ? "create" : "edit";
    document.getElementById("colModalTitle").textContent = isCreate ? "Nova coluna" : "Editar coluna";

    let col = { id: "", title: "", icon: "bi-kanban", headerClass: "bg-secondary text-white", btnClass: "btn btn-secondary" };
    if (!isCreate) {
        col = COLUMNS.find(c => c.id === colId);
        if (!col) return;
    }

    // preencher inputs
    document.getElementById("colIdOriginal").value = col.id || "";
    document.getElementById("colId").value = col.id || "";
    document.getElementById("colTitle").value = col.title || "";

    const themeKey = inferThemeFromClass(col.headerClass) || "secondary";
    document.getElementById("colTheme").value = themeKey;
    document.getElementById("colIcon").value = col.icon || "bi-kanban";

    // marcar visualmente ícone/tema atuais
    const iconGrid = document.getElementById("col-icon-grid");
    const themeGrid = document.getElementById("col-theme-grid");
    iconGrid?.querySelectorAll("button").forEach(b => {
        b.classList.toggle("selected", b.getAttribute("data-col-icon") === (col.icon || "bi-kanban"));
    });
    themeGrid?.querySelectorAll("button").forEach(b => {
        b.classList.toggle("selected", b.getAttribute("data-col-theme") === themeKey);
    });

    COL_MODAL?.show();
}

document.addEventListener("click", (e) => {
    const btnNew = e.target.closest("#btn-new-column");
    if (btnNew) openColumnModal("create");
});


function bindColModalEvents() {
    const picker = document.getElementById('colThemePicker');
    const themeIn = document.getElementById('colTheme');
    const btnSave = document.getElementById('btnSaveCol');
    if (!picker || !btnSave) return;
    if (picker.dataset.bound === '1') return;
    picker.dataset.bound = '1';

    picker.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-theme]');
        if (!btn) return;
        themeIn.value = btn.getAttribute('data-theme');
        // visual ativo
        picker.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });

    btnSave.addEventListener('click', () => {
        const mode = document.getElementById('colMode').value;
        const idOrig = document.getElementById('colIdOriginal').value.trim();
        const id = document.getElementById('colId').value.trim();
        const title = document.getElementById('colTitle').value.trim();
        const icon = document.getElementById('colIcon').value;
        const theme = document.getElementById('colTheme').value;

        if (!id || !title) {
            alert('Preencha ID e Nome.'); return;
        }
        if (mode === 'create') {
            if (COLUMNS.some(c => c.id === id)) { alert('Já existe uma coluna com esse ID.'); return; }
            let cfg = { id, title, icon };
            cfg = applyThemeToColumn(cfg, theme);
            COLUMNS.push(cfg);
            ensureColumnsInState();
        } else {
            // edit
            const c = COLUMNS.find(x => x.id === idOrig);
            if (!c) return;
            // se mudou id, precisamos mover a ordem e as tasks
            if (idOrig !== id) {
                if (COLUMNS.some(x => x.id === id)) { alert('ID já usado por outra coluna.'); return; }
                // mover estrutura
                COLUMNS = COLUMNS.map(x => x.id === idOrig ? ({ ...x, id }) : x);
                BOARD_STATE.order[id] = BOARD_STATE.order[idOrig] || [];
                delete BOARD_STATE.order[idOrig];
                Object.values(BOARD_STATE.tasks).forEach(t => { if (t.coluna === idOrig) t.coluna = id; });
            }
            c.title = title;
            c.icon = icon;
            applyThemeToColumn(c, theme);
        }
        saveColumns();
        saveBoard();
        renderColumnsShell();
        renderBoard();
        refreshModalColumnSelect();
        getColModal()?.hide();
    });
}

/* =========================================
   FILTROS
========================================= */
function passaNosFiltros(t) {
    if (FILTERS.query) {
        const q = FILTERS.query.toLowerCase();
        if (!String(t.titulo || "").toLowerCase().includes(q)) return false;
    }
    const st = getDeadlineStatus(t.dataEntrega).status;
    switch (FILTERS.mode) {
        case "hoje": return st === "hoje";
        case "atrasados": return st === "atrasado";
        case "semd": return st === "sem-data";
        default: return true;
    }
}

/* =========================================
   CRUD DE TASKS
========================================= */
function criarTask(coluna, titulo) {
    const id = "tsk_" + Date.now();
    BOARD_STATE.tasks[id] = {
        id, titulo, descricao: "", coluna, etiquetas: [], dataEntrega: "",
        lembreteOffset: "none", checklist: [], comentarios: [],
        historico: [{ quando: new Date().toISOString(), acao: "card_criado", detalhe: `Adicionado em ${coluna}` }]
    };
    BOARD_STATE.order[coluna].push(id);
    saveBoard();
    renderBoard();
    renderPlanner();
}

function moverTaskParaColuna(taskId, oldCol, newCol) {
    BOARD_STATE.order[oldCol] = BOARD_STATE.order[oldCol].filter(id => id !== taskId);
    BOARD_STATE.order[newCol].push(taskId);
    BOARD_STATE.tasks[taskId].coluna = newCol;
    BOARD_STATE.tasks[taskId].historico.push({ quando: new Date().toISOString(), acao: "coluna_move", detalhe: `Movido para ${newCol}` });
}

function reordenarNaMesmaColuna(coluna, taskId, beforeId) {
    const arr = BOARD_STATE.order[coluna].filter(id => id !== taskId);
    const idx = beforeId ? arr.indexOf(beforeId) : -1;
    if (idx >= 0) arr.splice(idx, 0, taskId); else arr.push(taskId);
    BOARD_STATE.order[coluna] = arr;
}

function moverEntreColunasPosicionado(taskId, oldCol, newCol, beforeId) {
    BOARD_STATE.order[oldCol] = BOARD_STATE.order[oldCol].filter(id => id !== taskId);
    const arr = BOARD_STATE.order[newCol].slice();
    const idx = beforeId ? arr.indexOf(beforeId) : -1;
    if (idx >= 0) arr.splice(idx, 0, taskId); else arr.push(taskId);
    BOARD_STATE.order[newCol] = arr;
    BOARD_STATE.tasks[taskId].coluna = newCol;
    BOARD_STATE.tasks[taskId].historico.push({ quando: new Date().toISOString(), acao: "coluna_move", detalhe: `Movido para ${newCol}` });
}

/* =========================================
   RENDER: BOARD (colunas)
========================================= */
function renderBoard() {
    COLUMNS.forEach(({ id: coluna }) => {
        const ul = document.getElementById("lista-" + coluna);
        if (!ul) return;
        ul.innerHTML = "";
        const ids = (BOARD_STATE.order[coluna] || []).filter(id => passaNosFiltros(BOARD_STATE.tasks[id]));
        ids.forEach(taskId => {
            const t = BOARD_STATE.tasks[taskId];
            if (!t) return;
            ul.appendChild(renderTaskCard(t));
        });
    });
    hookDragAndDrop();
    renderPlanner();
}

function renderTaskCard(t) {
    const total = t.checklist.length;
    const done = t.checklist.filter(i => i.done).length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    const li = document.createElement("li");
    li.className = "list-group-item bg-black text-light border-secondary rounded-3 mb-2 todo-item";
    li.setAttribute("draggable", "true");
    li.dataset.taskId = t.id;

    const deadlineInfo = getDeadlineStatus(t.dataEntrega);
    li.innerHTML = `
    <div class="d-flex justify-content-between align-items-start">
      <div class="me-2">
        <div class="fw-semibold small mb-1 d-flex align-items-center gap-2">
          <span>${escapeHTML(t.titulo) || "(sem título)"}</span>
          ${total ? `<span class="badge bg-info text-dark">${pct}%</span>` : ``}
        </div>
        <div class="d-flex flex-wrap gap-1 mb-2">
          ${t.etiquetas.map(et => `<span class="badge rounded-pill" style="background-color:${et.cor}">${escapeHTML(et.nome)}</span>`).join("")}
        </div>
        ${t.dataEntrega ? `
          <div class="small d-flex flex-column gap-1">
            <div class="text-secondary d-flex align-items-center gap-2">
              <i class="bi bi-calendar-event"></i><span>${formatarData(t.dataEntrega)}</span>
            </div>
            <div><span class="${deadlineInfo.classe}">${deadlineInfo.label}</span></div>
          </div>` : ``}
      </div>
      <div class="text-end small text-secondary">
        <div class="progress bg-secondary" style="height:4px; width:60px;">
          <div class="progress-bar bg-success" style="width:${pct}%;"></div>
        </div>
        <div class="mt-1">${done}/${total}</div>
      </div>
    </div>`;
    return li;
}

/* =========================================
   DnD: Drag & Drop com reorder
========================================= */
function hookDragAndDrop() {
    const items = document.querySelectorAll(".todo-item");
    const cols = document.querySelectorAll(".todo-coluna");
    let dragId = null;

    items.forEach(item => {
        item.addEventListener("dragstart", e => { dragId = item.dataset.taskId; e.dataTransfer.effectAllowed = "move"; });
    });

    cols.forEach(col => {
        col.addEventListener("dragover", e => { e.preventDefault(); col.classList.add("drag-over"); });
        col.addEventListener("dragleave", () => { col.classList.remove("drag-over"); });
        col.addEventListener("drop", e => {
            e.preventDefault();
            col.classList.remove("drag-over");
            const newColuna = col.dataset.coluna;
            const t = BOARD_STATE.tasks[dragId];
            if (!t) return;
            const liAlvo = e.target.closest && e.target.closest(".todo-item");
            const beforeId = liAlvo ? liAlvo.dataset.taskId : null;

            if (newColuna === t.coluna) reordenarNaMesmaColuna(newColuna, dragId, beforeId);
            else moverEntreColunasPosicionado(t.id, t.coluna, newColuna, beforeId);

            saveBoard();
            renderBoard();
        });
    });
}

/* =========================================
   MODAL: abrir, preencher, salvar
========================================= */
function getTaskModal() {
    const el = document.getElementById("taskModal");
    if (!el || !window.bootstrap?.Modal) return null;
    if (!MODAL_INSTANCE) MODAL_INSTANCE = new bootstrap.Modal(el, { focus: true });
    return MODAL_INSTANCE;
}

function bindCardClickDelegado() {
    if (document.__cdd_bindCardClickDelegado__) return;
    document.__cdd_bindCardClickDelegado__ = true;

    document.addEventListener("click", (e) => {
        if (!document.getElementById("pagina-todo")) return;
        const card = e.target.closest(".todo-item");
        if (!card) return;

        const tid = card.dataset.taskId;
        const t = BOARD_STATE.tasks[tid];
        if (!t) return;

        CURRENT_TASK_ID = tid;
        preencherModalComTask(t);

        const modal = getTaskModal();
        if (modal) modal.show();
    });
}

// limpa seleção ao fechar o modal
document.addEventListener("hidden.bs.modal", (evt) => {
    const el = document.getElementById("taskModal");
    if (evt.target === el) CURRENT_TASK_ID = null;
});

function atualizarUIEtiquetas(t) {
    const labelsBox = document.getElementById("task-labels-container");
    const badgesHTML = t.etiquetas.map(et => `<span class="badge rounded-pill" style="background-color:${et.cor}">${escapeHTML(et.nome)}</span>`).join("");
    const botaoEditar = `
    <button class="btn btn-sm btn-outline-secondary ms-2" id="btn-edit-labels">
      <i class="bi bi-tags"></i> Etiquetas
    </button>`;
    labelsBox.innerHTML = badgesHTML + botaoEditar;
    const btn = document.getElementById("btn-edit-labels");
    btn.addEventListener("click", () => abrirEditorEtiquetas(t));
}

function abrirEditorEtiquetas(t) {
    const nome = prompt("Nome da etiqueta (ex: Em desenvolvimento, Finalizado):");
    if (!nome) return;
    const cor = prompt("Cor da etiqueta (ex: #0d6efd ou #198754):", "#0d6efd");
    if (!cor) return;
    t.etiquetas.push({ nome, cor });
    saveBoard();
    atualizarUIEtiquetas(t);
    renderBoard();
}

function preencherModalComTask(t) {
    document.getElementById("task-title-input").value = t.titulo || "";
    atualizarUIEtiquetas(t);
    document.getElementById("task-desc-input").value = t.descricao || "";
    document.getElementById("task-deadline-input").value = t.dataEntrega ? toInputDatetimeLocal(t.dataEntrega) : "";
    document.getElementById("task-reminder-select").value = t.lembreteOffset || "none";
    document.getElementById("task-coluna-select").value = t.coluna;

    renderChecklist(t);
    renderComentarios(t);
    renderHistorico(t);

    const gcalBtn = document.getElementById("btn-gcal-add");
    if (gcalBtn) {
        const link = gerarGoogleCalendarLink(t);
        if (link && t.dataEntrega) {
            gcalBtn.disabled = false;
            gcalBtn.classList.remove("disabled");
            gcalBtn.onclick = () => window.open(link, "_blank");
        } else {
            gcalBtn.disabled = true;
            gcalBtn.classList.add("disabled");
            gcalBtn.onclick = null;
        }
    }
}

function salvarModal() {
    const t = BOARD_STATE.tasks[CURRENT_TASK_ID];
    if (!t) return;
    t.titulo = document.getElementById("task-title-input").value.trim();
    t.descricao = document.getElementById("task-desc-input").value.trim();
    t.dataEntrega = fromInputDatetimeLocal(document.getElementById("task-deadline-input").value);
    t.lembreteOffset = document.getElementById("task-reminder-select").value;

    const novaColuna = document.getElementById("task-coluna-select").value;
    if (novaColuna !== t.coluna) moverTaskParaColuna(t.id, t.coluna, novaColuna);

    saveBoard();
    renderBoard();
    preencherModalComTask(t);
}

function setupColumnEditorModal() {
    const el = document.getElementById("colModal");
    if (!el) return;

    // evita re-binds quando trocar de seção
    if (el.dataset.bound === "1") return;
    el.dataset.bound = "1";

    if (!window.bootstrap?.Modal) {
        console.warn("Bootstrap Modal não disponível.");
        return;
    }
    if (!COL_MODAL) COL_MODAL = new bootstrap.Modal(el, { focus: true });

    const iconGrid = document.getElementById("col-icon-grid");
    const themeGrid = document.getElementById("col-theme-grid");
    const btnSave = document.getElementById("col-save");
    const hiddenIcon = document.getElementById("colIcon");
    const hiddenThm = document.getElementById("colTheme");

    // garanta que o HTML tem esses IDs
    if (!iconGrid || !themeGrid || !btnSave || !hiddenIcon || !hiddenThm) {
        console.warn("Modal de coluna: elementos obrigatórios não encontrados. Confira os IDs no HTML.");
        return;
    }

    // Render ícones
    iconGrid.innerHTML = COLUMN_ICONS.map(ic => `
    <button type="button"
            class="btn btn-outline-secondary btn-sm d-flex justify-content-center align-items-center"
            data-col-icon="${ic}" title="${ic}">
      <i class="bi ${ic}" style="font-size:1.1rem"></i>
    </button>`
    ).join("");

    // Render temas
    themeGrid.innerHTML = Object.entries(COLUMN_THEMES).map(([key, t]) => `
  <button
    type="button"
    class="btn btn-sm theme-btn ${t.btnClass}"
    data-col-theme="${key}"
    style="min-width:96px"
    aria-pressed="false"
  >
    ${t.label}
  </button>
`).join("");

    // seleção visual (toggle + acessibilidade)
    themeGrid.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-col-theme]");
        if (!btn) return;

        themeGrid.querySelectorAll(".theme-btn").forEach(b => {
            b.classList.remove("selected", "active");
            b.setAttribute("aria-pressed", "false");
        });

        btn.classList.add("selected", "active");
        btn.setAttribute("aria-pressed", "true");

        // se você guarda o valor em um input hidden:
        const hidden = document.getElementById("colTheme");
        if (hidden) hidden.value = btn.dataset.colTheme;
    });

    // Salvar
    btnSave.addEventListener("click", saveColumnFromModal);
}

function openColumnEditor(id) {
    const col = COLUMNS.find(c => c.id === id);
    if (!col) return;

    __colEditingId = id;

    // preenche campos
    document.getElementById("col-id").value = id;
    document.getElementById("col-title").value = col.title || "";

    // marcar ícone selecionado
    const iconGrid = document.getElementById("col-icon-grid");
    [...iconGrid.querySelectorAll(".selected")].forEach(b => b.classList.remove("selected"));
    const ic = col.icon || "bi-kanban";
    const btnIcon = iconGrid.querySelector(`[data-col-icon="${ic}"]`);
    (btnIcon || iconGrid.querySelector(`[data-col-icon="bi-kanban"]`))?.classList.add("selected");

    // marcar tema selecionado
    const themeGrid = document.getElementById("col-theme-grid");
    [...themeGrid.querySelectorAll(".selected")].forEach(b => b.classList.remove("selected"));
    const currentTheme = col.theme || inferThemeFromClass(col.headerClass);
    themeGrid.querySelector(`[data-col-theme="${currentTheme}"]`)?.classList.add("selected");

    COL_MODAL?.show();
}

function saveColumnFromModal() {
    const mode = document.getElementById("colMode").value;
    const idOrig = document.getElementById("colIdOriginal").value.trim();
    const id = document.getElementById("colId").value.trim();
    const title = document.getElementById("colTitle").value.trim();
    const icon = document.getElementById("colIcon").value;
    const themeKey = document.getElementById("colTheme").value;
    const { headerClass, btnClass } = COLUMN_THEMES[themeKey] || COLUMN_THEMES.secondary;

    if (!id || !title) return;

    if (mode === "create") {
        if (COLUMNS.find(c => c.id === id)) { alert("Já existe uma coluna com esse id."); return; }
        COLUMNS.push({ id, title, icon, headerClass, btnClass });
        ensureColumnsInState();
    } else {
        const idx = COLUMNS.findIndex(c => c.id === idOrig);
        if (idx < 0) return;

        // se o id mudou, migrar tasks/order
        if (idOrig !== id) {
            BOARD_STATE.order[id] = BOARD_STATE.order[idOrig] || [];
            delete BOARD_STATE.order[idOrig];
            Object.values(BOARD_STATE.tasks).forEach(t => { if (t.coluna === idOrig) t.coluna = id; });
        }

        COLUMNS[idx] = { id, title, icon, headerClass, btnClass };
    }

    saveColumns();
    saveBoard();
    renderColumnsShell();
    renderBoard();
    refreshModalColumnSelect();
    COL_MODAL?.hide();
}


function bindModalEvents() {
    const modalEl = document.getElementById("taskModal");
    if (!modalEl) return;
    if (modalEl.dataset.bound === "1") return;
    modalEl.dataset.bound = "1";

    const btnSave = document.getElementById("btn-save-task");
    const btnDelete = document.getElementById("btn-delete-task");
    const btnComment = document.getElementById("btn-add-comment");
    const btnAddChk = document.getElementById("btn-add-checkitem");

    btnSave?.addEventListener("click", salvarModal);

    btnDelete?.addEventListener("click", () => {
        const t = BOARD_STATE.tasks[CURRENT_TASK_ID];
        if (!t) return;
        BOARD_STATE.order[t.coluna] = BOARD_STATE.order[t.coluna].filter(id => id !== t.id);
        delete BOARD_STATE.tasks[CURRENT_TASK_ID];
        saveBoard();
        renderBoard();
        renderPlanner?.();
        getTaskModal()?.hide();
        CURRENT_TASK_ID = null;
    });

    btnComment?.addEventListener("click", () => {
        const txtEl = document.getElementById("task-new-comment");
        const txt = txtEl?.value.trim();
        if (!txt) return;
        const t = BOARD_STATE.tasks[CURRENT_TASK_ID];
        if (!t) return;
        t.comentarios.push({ id: "c_" + Date.now(), autor: "Weslley Marçal Ferreira", mensagem: txt, criadoEm: new Date().toISOString() });
        txtEl.value = "";
        saveBoard();
        preencherModalComTask(t);
    });

    btnAddChk?.addEventListener("click", () => {
        const t = BOARD_STATE.tasks[CURRENT_TASK_ID];
        if (!t) return;
        t.checklist.push({ id: "chk_" + Date.now(), texto: "Novo item", done: false });
        saveBoard();
        renderChecklist(t);
        renderBoard();
    });

    modalEl?.addEventListener("hidden.bs.modal", () => { CURRENT_TASK_ID = null; });
}

/* =========================================
   CHECKLIST / COMENTÁRIOS / HISTÓRICO
========================================= */
function renderChecklist(t) {
    const ul = document.getElementById("task-checklist");
    ul.innerHTML = "";
    t.checklist.forEach(item => {
        const li = document.createElement("li");
        li.className = "list-group-item bg-black text-light border-secondary d-flex align-items-start gap-2";
        li.innerHTML = `
      <input class="form-check-input mt-1 flex-shrink-0 checklist-toggle" type="checkbox" data-check-id="${item.id}" ${item.done ? "checked" : ""}>
      <input class="form-control form-control-sm bg-transparent text-light border-0 border-bottom border-secondary flex-grow-1 checklist-text" data-check-id="${item.id}" value="${escapeHTML(item.texto)}">
      <button class="btn btn-sm btn-outline-danger checklist-del" data-check-id="${item.id}"><i class="bi bi-trash"></i></button>`;
        ul.appendChild(li);
    });

    const total = t.checklist.length, done = t.checklist.filter(i => i.done).length;
    const percent = total > 0 ? Math.round(done / total * 100) : 0;
    document.getElementById("task-check-progress").textContent = `${done}/${total} (${percent}%)`;

    ul.querySelectorAll(".checklist-toggle").forEach(cb => {
        cb.addEventListener("change", () => {
            const id = cb.dataset.checkId;
            const alvo = t.checklist.find(i => i.id === id);
            if (!alvo) return;
            alvo.done = cb.checked;
            saveBoard();
            renderChecklist(t);
            renderBoard();
        });
    });
    ul.querySelectorAll(".checklist-text").forEach(inp => {
        inp.addEventListener("input", () => {
            const id = inp.dataset.checkId;
            const alvo = t.checklist.find(i => i.id === id);
            if (!alvo) return;
            alvo.texto = inp.value;
            saveBoard();
        });
    });
    ul.querySelectorAll(".checklist-del").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.checkId;
            t.checklist = t.checklist.filter(i => i.id !== id);
            saveBoard();
            renderChecklist(t);
            renderBoard();
        });
    });
}

function renderComentarios(t) {
    const box = document.getElementById("task-comments-list");
    box.innerHTML = t.comentarios.slice().reverse().map(c => `
    <div class="bg-black border border-secondary rounded-3 p-2">
      <div class="small fw-semibold text-light">${escapeHTML(c.autor)}</div>
      <div class="small text-secondary">${formatarDataHora(c.criadoEm)}</div>
      <div class="text-light mt-1">${escapeHTML(c.mensagem)}</div>
    </div>`).join("");
}
function renderHistorico(t) {
    const box = document.getElementById("task-history");
    box.innerHTML = t.historico.slice().reverse().map(h => `
    <li class="mb-2">
      <div class="text-light small">${escapeHTML(h.detalhe)}</div>
      <div class="text-secondary small">${formatarDataHora(h.quando)}</div>
    </li>`).join("");
}

/* =========================================
   PLANEJADOR / CALENDÁRIO (lista por dia)
========================================= */
function renderPlanner() {
    const div = document.getElementById("planner-list");
    if (!div) return;

    const tasksComData = Object.values(BOARD_STATE.tasks)
        .filter(t => t.dataEntrega)
        .sort((a, b) => new Date(a.dataEntrega) - new Date(b.dataEntrega));

    const groups = {};
    tasksComData.forEach(t => {
        const isoLocal = toInputDatetimeLocal(t.dataEntrega);
        const dia = isoLocal.split("T")[0];
        if (!groups[dia]) groups[dia] = [];
        groups[dia].push(t);
    });

    let htmlTotal = "";
    Object.keys(groups).forEach(dia => {
        htmlTotal += `
      <h5 class="text-secondary mt-4">${dia}</h5>
      <ul class="list-group mb-3">
        ${groups[dia].map(t => {
            const status = getDeadlineStatus(t.dataEntrega);
            return `
            <li class="list-group-item bg-black text-light border-secondary d-flex justify-content-between align-items-start">
              <div>
                <div class="fw-semibold">${escapeHTML(t.titulo) || "(sem título)"}</div>
                <div class="small text-secondary">${formatarData(t.dataEntrega)}</div>
                <div class="mt-1"><span class="${status.classe}">${status.label}</span></div>
              </div>
              <div class="text-end">
                <button class="btn btn-outline-primary btn-sm mt-1"
                        onclick="window.open('${gerarGoogleCalendarLink(t)}','_blank')"
                        ${t.dataEntrega ? "" : "disabled"}>
                  <i class="bi bi-calendar-plus"></i>
                </button>
              </div>
            </li>`;
        }).join("")}
      </ul>`;
    });

    div.innerHTML = htmlTotal || `<p class="text-secondary">Nenhuma tarefa com prazo.</p>`;
}

/* =========================================
   INIT (chamada pelo app.js após carregar a seção)
========================================= */
function initTodo() {
    // 1) Carregar estado e colunas primeiro
    loadBoard();
    loadColumns();
    ensureColumnIcons();

    // 2) Seed opcional/condicional da coluna "revisar" (sem alert)
    // if (!COLUMNS.some(c => c.id === 'revisar')) {
    //     COLUMNS.push({
    //         id: 'revisar',
    //         title: 'Revisar',
    //         icon: 'bi-eye',
    //         headerClass: 'bg-info text-dark',
    //         btnClass: 'btn btn-info text-dark'
    //     });
    //     ensureColumnsInState();
    //     saveColumns();
    //     saveBoard();
    // }

    // 3) Garantir chaves corretas no estado, renderizar e popular selects
    ensureColumnsInState();
    renderColumnsShell();
    renderBoard();
    refreshModalColumnSelect();

    // 4) Binds
    bindModalEvents();
    bindCardClickDelegado();
    bindColModalEvents();
    setupColumnEditorModal();


    // 5) Botão "+" por coluna
    window.adicionarTarefa = function (coluna) {
        const input = document.getElementById("input-" + coluna);
        const titulo = input.value.trim();
        if (!titulo) return;
        criarTask(coluna, titulo);
        input.value = "";
    };

    // 6) Filtros
    const btnTodos = document.getElementById("filtro-todos");
    const btnHoje = document.getElementById("filtro-hoje");
    const btnAtrasados = document.getElementById("filtro-atrasados");
    const btnSemD = document.getElementById("filtro-semd");
    const inpBusca = document.getElementById("filtro-busca");

    function ativar(btn) {
        [btnTodos, btnHoje, btnAtrasados, btnSemD].forEach(b => b && b.classList.remove("active"));
        btn && btn.classList.add("active");
    }
    btnTodos && btnTodos.addEventListener("click", () => { FILTERS.mode = "todos"; ativar(btnTodos); renderBoard(); });
    btnHoje && btnHoje.addEventListener("click", () => { FILTERS.mode = "hoje"; ativar(btnHoje); renderBoard(); });
    btnAtrasados && btnAtrasados.addEventListener("click", () => { FILTERS.mode = "atrasados"; ativar(btnAtrasados); renderBoard(); });
    btnSemD && btnSemD.addEventListener("click", () => { FILTERS.mode = "semd"; ativar(btnSemD); renderBoard(); });
    inpBusca && inpBusca.addEventListener("input", () => { FILTERS.query = inpBusca.value.trim(); renderBoard(); });

    // 7) Migração (agora com BOARD_STATE.order garantido)
    migrateLegacyTodosIfNeeded();
}

// Exporta para o app.js (que chama após .load)
window.initTodo = initTodo;
window.addColumn = addColumn;
window.renameColumn = renameColumn;
window.askRemoveColumn = askRemoveColumn;
window.removeColumn = removeColumn;
window.editColumn = editColumn;

// Compatibilidade entre versões do app (alias para evitar mismatches)
try {
    if (typeof window.initTodo === 'function' && typeof window.inicializarTodoListas !== 'function') {
        window.inicializarTodoListas = window.initTodo;
    } else if (typeof window.inicializarTodoListas === 'function' && typeof window.initTodo !== 'function') {
        window.initTodo = window.inicializarTodoListas;
    }
} catch (err) {
    console.warn('Erro ao criar aliases para inicializadores do To-do:', err);
}

