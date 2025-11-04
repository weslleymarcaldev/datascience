// js/logger.js
(function () {
    if (window.__logger_initialized) return;
    window.__logger_initialized = true;

    const MAX_LOGS = 300;
    const LOG_KEY = 'cdd_logs_v1';

    // --- cria painel flutuante (inicialmente oculto) ---
    const panel = document.createElement('div');
    panel.id = 'debug-panel';
    Object.assign(panel.style, {
        position: 'fixed',
        bottom: '56px',
        right: '12px',
        background: 'rgba(8,10,14,0.96)',
        color: '#e6eef6',
        fontSize: '12px',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        padding: '8px',
        borderRadius: '8px',
        width: '340px',
        maxHeight: '44vh',
        overflowY: 'auto',
        zIndex: 999999,
        boxShadow: '0 6px 18px rgba(0,0,0,0.5)',
        display: 'none'
    });
    document.body.appendChild(panel);

    // header do painel (títulos + ações)
    const header = document.createElement('div');
    header.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:8px;';
    header.innerHTML = `
    <strong style="flex:1">CDD — Debug Log</strong>
    <button id="dbg-download" title="Baixar logs" style="background:#0b1220;color:#cfe8ff;border:0;padding:.25rem .5rem;border-radius:6px;cursor:pointer">↓</button>
    <button id="dbg-clear" title="Limpar logs" style="background:#0b1220;color:#ffb3b3;border:0;padding:.25rem .5rem;border-radius:6px;cursor:pointer">✕</button>
  `;
    panel.appendChild(header);

    // lista de logs
    const list = document.createElement('div');
    list.id = 'dbg-list';
    list.style.cssText = 'display:flex;flex-direction:column;gap:6px;';
    panel.appendChild(list);

    // --- botão fixo (visual toggle) ---
    const btn = document.createElement('button');
    btn.id = 'debug-toggle-btn';
    btn.title = 'Toggle debug (Ctrl+Shift+L)';
    Object.assign(btn.style, {
        position: 'fixed',
        bottom: '12px',
        right: '12px',
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        border: 'none',
        zIndex: 999999,
        cursor: 'pointer',
        background: '#0b1220',
        color: '#aee1ff',
        boxShadow: '0 6px 20px rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700
    });
    btn.innerHTML = 'DB';
    document.body.appendChild(btn);

    // badge contador dentro do botão
    const badge = document.createElement('span');
    Object.assign(badge.style, {
        position: 'absolute',
        top: '-6px',
        right: '-6px',
        background: '#ff6b6b',
        color: '#fff',
        borderRadius: '10px',
        padding: '2px 6px',
        fontSize: '11px',
        display: 'none',
        pointerEvents: 'none'
    });
    btn.appendChild(badge);

    // --- helpers de armazenamento e render ---
    function readLogs() {
        try { return JSON.parse(localStorage.getItem(LOG_KEY) || '[]'); }
        catch { return []; }
    }
    function writeLogs(arr) {
        try { localStorage.setItem(LOG_KEY, JSON.stringify(arr.slice(-MAX_LOGS))); }
        catch (e) { console.warn('Logger: não foi possível salvar logs', e); }
    }

    function pushLog(type, msg, details) {
        const logs = readLogs();
        const entry = {
            id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
            timeISO: new Date().toISOString(),
            time: new Date().toLocaleString(),
            type: type || 'info',
            msg: msg || '',
            details: (details === undefined || details === null) ? '' : (typeof details === 'string' ? details : safeStringify(details))
        };
        logs.push(entry);
        writeLogs(logs);
        renderLogs();
        updateBadge();
    }

    function safeStringify(v) {
        try { return JSON.stringify(v, null, 2); } catch { return String(v); }
    }

    function escapeHtml(s) {
        return String(s)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#39;');
    }

    function renderLogs() {
        const logs = readLogs().slice().reverse(); // mais recente em cima
        list.innerHTML = logs.map(l => {
            const color = l.type === 'error' ? '#ffb3b3' : (l.type === 'warn' ? '#ffd08a' : '#bfe7ff');
            const details = l.details ? `<div style="margin-top:4px;color:#9fb6c8;white-space:pre-wrap;max-height:110px;overflow:auto">${escapeHtml(l.details)}</div>` : '';
            return `<div style="padding:6px 8px;border-radius:6px;background:rgba(255,255,255,0.02)">
                <div style="display:flex;justify-content:space-between;gap:8px">
                  <div style="min-width:0"><span style="color:#96aabd;font-size:11px">${l.time}</span> <b style="color:${color};margin-left:6px">${escapeHtml(l.type)}</b> — <span style="color:#e6eef6">${escapeHtml(l.msg)}</span></div>
                  <div style="font-size:11px;color:#7892a5">${l.id.slice(-6)}</div>
                </div>
                ${details}
              </div>`;
        }).join('');
    }

    function updateBadge() {
        const count = readLogs().length;
        if (count > 0) {
            badge.style.display = 'inline-block';
            badge.textContent = count > 99 ? '99+' : String(count);
        } else {
            badge.style.display = 'none';
        }
    }

    // ações dos botões do painel
    header.querySelector('#dbg-clear').addEventListener('click', () => {
        localStorage.removeItem(LOG_KEY);
        renderLogs();
        updateBadge();
    });
    header.querySelector('#dbg-download').addEventListener('click', () => {
        const logs = readLogs();
        const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'cdd-logs.json'; a.click();
        URL.revokeObjectURL(url);
    });

    // toggle via botão
    btn.addEventListener('click', () => {
        panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
        renderLogs();
    });

    // toggle via atalho Ctrl+Shift+L
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'l') {
            panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
            renderLogs();
        }
    });

    // captura global de erros/promises e envio pro log
    window.addEventListener('error', (ev) => {
        try {
            pushLog('error', ev.message || 'window.error', { filename: ev.filename, lineno: ev.lineno, colno: ev.colno });
        } catch (e) { /* swallow */ }
    });
    window.addEventListener('unhandledrejection', (ev) => {
        try {
            pushLog('error', 'Unhandled promise rejection', ev.reason);
        } catch (e) { }
    });

    // API pública simples
    window.AppLog = {
        info: (msg, details) => pushLog('info', String(msg), details),
        warn: (msg, details) => pushLog('warn', String(msg), details),
        error: (msg, details) => pushLog('error', String(msg), details),
        clear: () => { localStorage.removeItem(LOG_KEY); renderLogs(); updateBadge(); },
        show: () => { panel.style.display = 'block'; renderLogs(); updateBadge(); },
        hide: () => { panel.style.display = 'none'; },
        toggle: () => { panel.style.display = panel.style.display === 'block' ? 'none' : 'block'; renderLogs(); updateBadge(); },
        getAll: () => readLogs()
    };

    // inicializa visual
    renderLogs();
    updateBadge();
})();
