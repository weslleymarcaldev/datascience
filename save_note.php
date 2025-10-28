<?php
// ds/save_note.php
header('Content-Type: application/json; charset=utf-8');

// Só aceita POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'msg' => 'Método não permitido']);
    exit;
}

// Lê JSON bruto
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

// Valida campo html
if (!$data || !isset($data['html'])) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'msg' => 'Payload inválido: html ausente']);
    exit;
}

$conteudoHTML = $data['html'];

// ------------------------------------------------------------------
// Modo UPDATE (salvar automático sem prompt)
// front envia:
// {
//   "html": "...",
//   "filename": "notas/probabilidade-20251028-132455.html",
//   "modo": "update"
// }
// ------------------------------------------------------------------
if (isset($data['filename'])) {
    $filenameRelativo = $data['filename'];

    // Segurança básica: não deixar subir diretório tipo ../../
    $filenameLimpo = basename($filenameRelativo);

    $dirNotas = __DIR__ . '/notas';
    if (!is_dir($dirNotas)) {
        mkdir($dirNotas, 0775, true);
    }

    $caminhoArquivo = $dirNotas . '/' . $filenameLimpo;

    // Recriamos o HTML completo bonitinho antes de salvar
    // MAS: pra manter o título correto no <title> e no <h1>,
    // tentamos reaproveitar o nome base do arquivo como título "estimado".
    // Ex: probabilidade-20251028-132455.html -> "probabilidade"
    $tituloEstimado = preg_replace('/-\d{8}-\d{6}\.html$/', '', $filenameLimpo); // tira timestamp se tiver
    $tituloEstimado = preg_replace('/[-_]+/', ' ', $tituloEstimado); // vira nome legível
    $tituloEstimado = ucwords($tituloEstimado); // primeira letra maiúscula

    $documentoCompleto = montarDocumentoHTML($tituloEstimado, $conteudoHTML);

    $ok = file_put_contents($caminhoArquivo, $documentoCompleto);

    if ($ok === false) {
        http_response_code(500);
        echo json_encode(['ok' => false, 'msg' => 'Falha ao atualizar arquivo']);
        exit;
    }

    echo json_encode([
        'ok'   => true,
        'msg'  => 'Arquivo atualizado',
        'file' => $filenameLimpo
    ]);
    exit;
}

// ------------------------------------------------------------------
// Modo CREATE (primeira vez, prompt de título)
// front envia:
// {
//   "html": "...",
//   "titulo": "Estudo de Probabilidade",
//   "modo": "create"
// }
// ------------------------------------------------------------------

if (!isset($data['titulo'])) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'msg' => 'Título ausente para criação']);
    exit;
}

$titulo = $data['titulo'];

// normaliza pra criar o nome do arquivo
$arquivoBase = preg_replace('/[^a-zA-Z0-9-_]+/', '-', strtolower($titulo));
$arquivoBase = trim($arquivoBase, '-');
if ($arquivoBase === '') {
    $arquivoBase = 'anotacao';
}

// timestamp pra diferenciar versões
$timestamp = date('Ymd-His'); // ex: 2025-10-28-13:24:55

$dirNotas = __DIR__ . '/notas';
if (!is_dir($dirNotas)) {
    mkdir($dirNotas, 0775, true);
}

$nomeArquivoFinal = $arquivoBase . '-' . $timestamp . '.html';
$caminhoArquivo   = $dirNotas . '/' . $nomeArquivoFinal;

$documentoCompleto = montarDocumentoHTML($titulo, $conteudoHTML);

$ok = file_put_contents($caminhoArquivo, $documentoCompleto);

if ($ok === false) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'msg' => 'Falha ao salvar arquivo']);
    exit;
}

echo json_encode([
    'ok'   => true,
    'msg'  => 'Arquivo criado',
    'file' => $nomeArquivoFinal // importante: só o nome, sem "notas/"
]);
exit;


// ==================================================================
// Função helper pra montar o HTML final offline
// ==================================================================
function montarDocumentoHTML($tituloPagina, $conteudoHTML)
{
    $tituloEsc = htmlspecialchars($tituloPagina ?? 'Minhas Anotações', ENT_QUOTES, 'UTF-8');

    return "<!DOCTYPE html>
    <html lang=\"pt-BR\">
    <head>
    <meta charset=\"UTF-8\" />
    <title>{$tituloEsc}</title>
    <style>
    body {
        background-color: #0b1220;
        color: #e8eaed;
        font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,sans-serif;
        line-height: 1.6;
        padding: 2rem;
    }
    table {
        border-collapse: collapse;
    }
    table, td, th {
        border: 1px solid #2a3a4f;
    }
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
    <h1 style=\"color:#fff;font-size:1.4rem;margin-top:0;margin-bottom:1rem;\">{$tituloEsc}</h1>
    {$conteudoHTML}
    </body>
    </html>";
}
