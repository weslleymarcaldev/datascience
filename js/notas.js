const STORAGE_NOTAS_KEY = 'cdd_notas_html';
const STORAGE_FILENAME_KEY = 'cdd_notas_filename';

let quill = null;

// ========== REGISTRO DO BLOT <hr> ==========
const BlockEmbed = Quill.import('blots/block/embed');

class DividerBlot extends BlockEmbed {
    static create() {
        const node = super.create();
        node.setAttribute(
            'style',
            'border:0;border-top:1px solid #2a3a4f;margin:1.5rem 0;opacity:.6;'
        );
        return node;
    }
}
DividerBlot.blotName = 'divider';
DividerBlot.tagName = 'hr';

Quill.register(DividerBlot);

// ========== HANDLERS CUSTOM ==========
const toolbarHandlers = {
    divider: function () {
        const range = this.quill.getSelection(true);
        if (!range) return;

        this.quill.insertEmbed(range.index, 'divider', true, Quill.sources.USER);
        this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
    }
    // vamos falar de table daqui a pouco 👇
};

// ========== INIT DO EDITOR ==========
function initNotas() {
    const editorEl = document.getElementById('editor-notas');
    if (!editorEl) {
        console.error('initNotas: #editor-notas não encontrado');
        return;
    }

    quill = new Quill('#editor-notas', {
        theme: 'snow',
        modules: {
            toolbar: {
                container: '#notas-toolbar',
                handlers: toolbarHandlers
            }
        },
        placeholder: 'Escreva aqui suas anotações, ideias, exercícios, fórmulas...'
    });

    // carrega notas do localStorage
    try {
        const salvo = localStorage.getItem(STORAGE_NOTAS_KEY);
        if (salvo) {
            quill.root.innerHTML = salvo;
        }
    } catch (err) {
        console.warn('Não consegui carregar notas do localStorage:', err);
    }
}

// ========== GERA TÍTULO AUTOMÁTICO ========== 
function gerarTituloAutomaticoDoQuill(quillInstance) {
    const textoPlano = quillInstance.getText().trim();
    if (!textoPlano) {
        return 'Minhas Anotações';
    }

    let primeiraLinha = textoPlano.split('\n')[0];
    if (primeiraLinha.length > 60) {
        primeiraLinha = primeiraLinha.slice(0, 60) + '...';
    }

    return primeiraLinha || 'Minhas Anotações';
}

// ========== SALVAR NOTAS (local + backend) ==========
function salvarNotas() {
    if (!quill) {
        console.error('Quill não inicializado');
        feedbackNotas('Editor não carregado ❌', 'text-danger');
        return;
    }

    const html = quill.root.innerHTML;

    // salva local
    try {
        localStorage.setItem(STORAGE_NOTAS_KEY, html);
    } catch (err) {
        console.warn('Falha ao salvar localmente:', err);
    }

    // vê se já existe arquivo no servidor
    let filenameExistente = null;
    try {
        filenameExistente = localStorage.getItem(STORAGE_FILENAME_KEY);
    } catch (err) {
        console.warn('Falha ao ler filename existente:', err);
    }

    if (filenameExistente) {
        // UPDATE silencioso
        enviarProServidor({
            html: html,
            filename: filenameExistente,
            modo: 'update'
        });
        return;
    }

    // CREATE (primeiro save)
    const tituloSugerido = gerarTituloSugerido();
    let tituloEscolhido = prompt(
        'Título desta nota para salvar no arquivo?',
        tituloSugerido
    );

    if (!tituloEscolhido || !tituloEscolhido.trim()) {
        tituloEscolhido = tituloSugerido;
    }

    enviarProServidor({
        html: html,
        titulo: tituloEscolhido,
        modo: 'create'
    });
}

// ========== GERAR SUGESTÃO DE TÍTULO ========== 
function gerarTituloSugerido() {
    const tituloCampo = document.getElementById('nota-titulo');
    if (tituloCampo && tituloCampo.value.trim() !== '') {
        return tituloCampo.value.trim();
    }

    const textoPlano = quill.getText().trim();
    if (!textoPlano) {
        return 'Minhas Anotações';
    }

    let primeiraLinha = textoPlano.split('\n')[0];
    if (primeiraLinha.length > 60) {
        primeiraLinha = primeiraLinha.slice(0, 60) + '...';
    }
    return primeiraLinha || 'Minhas Anotações';
}

// ========== POST PRO BACKEND ========== 
function enviarProServidor(payload) {
    fetch('save_note.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
        .then(r => r.json())
        .then(res => {
            console.log('Resposta do servidor:', res);

            if (res.ok) {
                // guarda filename pra próximos saves automáticos
                if (res.file) {
                    try {
                        localStorage.setItem(STORAGE_FILENAME_KEY, res.file);
                    } catch (err) {
                        console.warn('Não consegui gravar o filename localmente:', err);
                    }
                }

                const msgOk = payload.modo === 'create'
                    ? 'Arquivo criado ✅'
                    : 'Arquivo atualizado ✅';

                feedbackNotas(
                    msgOk + '<br><small>' + (res.file || '') + '</small>',
                    'text-success'
                );
            } else {
                feedbackNotas(
                    'Salvei local, mas NÃO consegui salvar no servidor ❌ (' + res.msg + ')',
                    'text-warning'
                );
            }
        })
        .catch(err => {
            console.error('Falha no fetch:', err);
            feedbackNotas(
                'Salvei local, mas deu erro ao enviar pro servidor ❌',
                'text-warning'
            );
        });
}

// ========== CARREGAR / LIMPAR / EXPORTAR / IMPORTAR ========== 
function carregarNotas() {
    if (!quill) {
        console.error('Quill não inicializado');
        feedbackNotas('Editor não carregado ❌', 'text-danger');
        return;
    }

    try {
        const salvo = localStorage.getItem(STORAGE_NOTAS_KEY) || '';
        quill.root.innerHTML = salvo;
        feedbackNotas('Notas carregadas do navegador ✔', 'text-info');
        setTimeout(() => feedbackNotas('', ''), 2000);
    } catch (err) {
        console.error('Erro ao carregar notas:', err);
        feedbackNotas('Erro ao carregar notas ❌', 'text-danger');
    }
}

// ========== LIMPAR NOTAS ========== 
function limparNotas() {
    if (!confirm('Tem certeza que deseja limpar todas as anotações?')) return;
    if (!quill) return;

    quill.setText('');
    try {
        localStorage.removeItem(STORAGE_NOTAS_KEY);
    } catch (err) {
        console.warn('Falha ao limpar localStorage:', err);
    }

    feedbackNotas('Notas limpas 🧹', 'text-warning');
    setTimeout(() => feedbackNotas('', ''), 2000);
}

// ========== FEEDBACK NOTAS ========== 
function feedbackNotas(msg, cls) {
    const box = document.getElementById('notas-feedback');
    if (!box) return;
    box.className = 'mt-2 small ' + (cls || 'text-muted');
    box.innerHTML = msg;
}

// ========== EXPORTAR NOTAS HTML ========== 
function exportarNotasHTML() {
    if (!quill) return;

    const conteudo = quill.root.innerHTML;

    const fullDoc = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Minhas Anotações</title>
<style>
body {
    background-color: #0b1220;
    color: #e8eaed;
    font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,sans-serif;
    line-height: 1.6;
    padding: 2rem;
}
table { border-collapse: collapse; }
table, td, th { border: 1px solid #2a3a4f; }
code {
    background-color: rgba(74,144,226,0.15);
    border: 1px solid rgba(74,144,226,0.4);
    border-radius: 4px;
    padding: 0 .3rem;
    font-family: Consolas,'Courier New',monospace;
    color: #8ecbff;
}
pre {
    background-color: #0f1a2d;
    border: 1px solid #2a3a4f;
    border-radius: 8px;
    padding: .75rem 1rem;
    font-family: Consolas,'Courier New',monospace;
    color: #8ecbff;
    overflow-x: auto;
}
blockquote {
    border-left: 3px solid #4a90e2;
    background-color: rgba(74,144,226,0.08);
    padding: .5rem .75rem;
    border-radius: 4px;
    font-style: italic;
    color: #9aa5b1;
}
hr {
    border: 0;
    border-top: 1px solid #2a3a4f;
    margin: 1.5rem 0;
    opacity: .6;
}
</style>
</head>
<body>
${conteudo}
</body>
</html>`;

    const blob = new Blob([fullDoc], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    const dataAgora = new Date();
    const stamp = dataAgora.toISOString().replace(/[:.]/g, '-');

    a.href = url;
    a.download = `anotacoes-${stamp}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    feedbackNotas('Arquivo exportado com sucesso ✅', 'text-success');
}

function importarNotasHTML(inputFileEl) {
    if (!quill) return;
    if (!inputFileEl.files || !inputFileEl.files[0]) {
        feedbackNotas('Nenhum arquivo selecionado.', 'text-warning');
        return;
    }

    const file = inputFileEl.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const html = e.target.result;
        quill.root.innerHTML = html;

        try {
            localStorage.setItem(STORAGE_NOTAS_KEY, html);
            feedbackNotas('Importado e salvo ✅', 'text-success');
        } catch (err) {
            console.error('Erro ao salvar após importar:', err);
            feedbackNotas('Importado, mas não consegui salvar localmente ❌', 'text-danger');
        }
    };

    reader.onerror = function () {
        console.error('Erro ao ler arquivo importado');
        feedbackNotas('Erro ao importar arquivo ❌', 'text-danger');
    };

    reader.readAsText(file, 'utf-8');

    inputFileEl.value = '';
}

// ========== TORNAR PÚBLICO NO WINDOW ========== 
window.initNotas = initNotas;
window.salvarNotas = salvarNotas;
window.carregarNotas = carregarNotas;
window.limparNotas = limparNotas;
window.exportarNotasHTML = exportarNotasHTML;
window.importarNotasHTML = importarNotasHTML;
