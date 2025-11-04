// js/datalab.js
(function () {
    // evita executar mais de uma vez caso o HTML seja reinjetado
    if (window.__datalab_initialized) return;
    window.__datalab_initialized = true;

    // ---------- helpers ----------
    const toNumbers = s => {
        if (!s) return [];
        // aceita vírgula, espaço, ; e nova linha como separadores
        const cleaned = s.trim().replace(/\r\n/g, ',').replace(/\n/g, ',').replace(/;+/g, ',').replace(/\s+/g, ' ');
        const parts = cleaned.split(/[, ]+/).filter(Boolean);
        return parts.map(p => {
            const n = Number(p.toString().replace(',', '.'));
            return Number.isFinite(n) ? n : NaN;
        }).filter(v => !Number.isNaN(v));
    };

    function mean(arr) { return arr.reduce((a, b) => a + b, 0) / arr.length; }
    function median(arr) {
        const a = [...arr].sort((x, y) => x - y);
        const m = Math.floor(a.length / 2);
        return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
    }
    function mode(arr) {
        const freq = {};
        arr.forEach(v => freq[v] = (freq[v] || 0) + 1);
        let best = null, bestc = 0;
        for (const k in freq) if (freq[k] > bestc) { bestc = freq[k]; best = Number(k); }
        return { value: best, count: bestc };
    }
    function variance(arr, sample = false) {
        if (!arr.length) return NaN;
        const m = mean(arr);
        const s = arr.reduce((a, b) => a + (b - m) ** 2, 0);
        return s / (arr.length - (sample ? 1 : 0));
    }
    function std(arr, sample = false) { return Math.sqrt(variance(arr, sample)); }
    function quantile(arr, q) {
        const a = [...arr].sort((x, y) => x - y);
        if (!a.length) return NaN;
        const pos = (a.length - 1) * q;
        const lo = Math.floor(pos), hi = Math.ceil(pos);
        if (lo === hi) return a[pos];
        return a[lo] + (a[hi] - a[lo]) * (pos - lo);
    }

    // ---------- DOM ----------
    const $input = document.getElementById('dl-input');
    const $btn = document.getElementById('btn-calc');
    const $histBtn = document.getElementById('btn-hist');
    const $bootstrapBtn = document.getElementById('btn-bootstrap');
    const $csv = document.getElementById('btn-csv');
    const $summary = document.getElementById('dl-summary');
    const $stats = document.getElementById('dl-stats');
    const $input2 = document.getElementById('dl-input-2col');
    const ctxEl = document.getElementById('dl-hist');

    // valida DOM básico — se não existir (página diferente), aborta silenciosamente
    if (!$input || !$btn || !ctxEl) {
        console.warn('Data Lab: elementos esperados não encontrados, abortando inicialização.');
        return;
    }

    const ctx = ctxEl.getContext('2d');
    let histChart = null;

    function renderSummary(arr) {
        if (!arr.length) { $summary.innerHTML = '<em>Nenhum número válido detectado</em>'; $stats.innerHTML = ''; return; }
        const s = [];
        s.push(`<strong>n</strong>: ${arr.length}`);
        s.push(`<strong>média</strong>: ${mean(arr).toFixed(4)}`);
        s.push(`<strong>mediana</strong>: ${median(arr).toFixed(4)}`);
        s.push(`<strong>moda</strong>: ${JSON.stringify(mode(arr))}`);
        s.push(`<strong>min</strong>: ${Math.min(...arr)}`);
        s.push(`<strong>max</strong>: ${Math.max(...arr)}`);
        $summary.innerHTML = s.join(' &nbsp; • &nbsp; ');

        $stats.innerHTML = `
      <div><b>Desvio (pop)</b>: ${std(arr, false).toFixed(4)} &nbsp; <b>Desvio (amostra)</b>: ${std(arr, true).toFixed(4)}</div>
      <div><b>Variância (pop)</b>: ${variance(arr, false).toFixed(4)}</div>
      <div><b>Q1</b>: ${quantile(arr, 0.25).toFixed(4)} &nbsp; <b>Q3</b>: ${quantile(arr, 0.75).toFixed(4)}</div>
    `;
    }

    function safeDestroyChart() {
        try {
            if (histChart && typeof histChart.destroy === 'function') { histChart.destroy(); }
        } catch (e) { console.warn('erro destruindo chart:', e); }
        histChart = null;
        // limpar canvas para evitar artefatos que possam alterar layout
        try {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        } catch (e) { }
    }

    function drawHist(arr, bins = 10) {
        safeDestroyChart();
        if (!arr.length) return;

        // Verificação correta: antes de usar Chart.js
        if (typeof Chart === 'undefined') {
            console.error('Chart.js não carregado.');
            alert('Erro: biblioteca Chart.js não carregada. Verifique sua conexão ou ordem dos scripts.');
            return;
        }

        const min = Math.min(...arr), max = Math.max(...arr);
        const width = (max - min) / bins || 1;
        const labels = [], counts = new Array(bins).fill(0);
        for (let i = 0; i < bins; i++)
            labels.push(`${(min + i * width).toFixed(2)}–${(min + (i + 1) * width).toFixed(2)}`);
        arr.forEach(v => {
            let idx = Math.floor((v - min) / width);
            if (idx < 0) idx = 0;
            if (idx >= bins) idx = bins - 1;
            counts[idx]++;
        });

        // Cria chart (Chart.js)
        histChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Frequência',
                    data: counts,
                    backgroundColor: '#4e73dfaa'
                }]
            },
            options: {
                responsive: false,               // 🔒 evita recalcular tamanho
                maintainAspectRatio: false,      // já pode manter false
                animation: { duration: 0 },      // sem animação longa
                scales: {
                    x: { ticks: { maxRotation: 0 } },
                    y: { beginAtZero: true }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }


    // ---------- bootstrap simple ----------
    function bootstrapMeans(arr, nBoot = 1000, sampleSize = null) {
        if (!arr.length) return [];
        const sz = sampleSize || arr.length;
        const out = [];
        for (let b = 0; b < nBoot; b++) {
            const sample = [];
            for (let i = 0; i < sz; i++) {
                sample.push(arr[Math.floor(Math.random() * arr.length)]);
            }
            out.push(mean(sample));
        }
        return out;
    }

    // ---------- corr & regression ----------
    function pearson(x, y) {
        if (!x.length || x.length !== y.length) return NaN;
        const mx = mean(x), my = mean(y);
        let num = 0, denx = 0, deny = 0;
        for (let i = 0; i < x.length; i++) {
            const dx = x[i] - mx, dy = y[i] - my;
            num += dx * dy; denx += dx * dx; deny += dy * dy;
        }
        return num / Math.sqrt(denx * deny);
    }
    function linearRegression(x, y) {
        if (!x.length || x.length !== y.length) return null;
        const mx = mean(x), my = mean(y);
        let num = 0, den = 0;
        for (let i = 0; i < x.length; i++) { num += (x[i] - mx) * (y[i] - my); den += (x[i] - mx) ** 2; }
        const beta = num / den; const alpha = my - beta * mx;
        return { alpha, beta };
    }

    // ---------- safe attach once ----------
    const attachOnce = (el, ev, fn) => {
        if (!el) return;
        const key = '__attached_' + ev;
        if (el[key]) return;
        el.addEventListener(ev, fn);
        el[key] = true;
    };

    // reentrancy guard: global flag to prevent loop
    // (use window so it survives potential element re-creation)
    if (typeof window.__datalab_running === 'undefined') window.__datalab_running = false;

    attachOnce($btn, 'click', async () => {
        if (window.__datalab_running) return; // já rodando -> ignora
        window.__datalab_running = true;
        $btn.disabled = true;
        try {
            const arr = toNumbers($input.value);
            renderSummary(arr);
            // desenhar histograma apenas se existirem números
            if (arr.length) drawHist(arr, 12);
        } catch (err) {
            console.error('Erro no calculo DataLab:', err);
        } finally {
            // coloque um pequeno delay pra garantir que repaint termine antes de re-ativações
            setTimeout(() => {
                $btn.disabled = false;
                window.__datalab_running = false;
            }, 120);
        }
    });

    attachOnce($histBtn, 'click', () => {
        if (window.__datalab_running) return;
        window.__datalab_running = true;
        $histBtn.disabled = true;
        try {
            const arr = toNumbers($input.value);
            if (arr.length) drawHist(arr, 12);
        } finally {
            setTimeout(() => { $histBtn.disabled = false; window.__datalab_running = false; }, 120);
        }
    });

    attachOnce($bootstrapBtn, 'click', () => {
        if (window.__datalab_running) return;
        window.__datalab_running = true;
        $bootstrapBtn.disabled = true;
        try {
            const arr = toNumbers($input.value);
            if (!arr.length) { alert('Cole alguns números primeiro'); return; }
            const boots = bootstrapMeans(arr, 1000, Math.max(5, Math.floor(arr.length / 2)));
            const m = mean(boots), s = std(boots);
            $summary.innerHTML += `<br><small>Bootstrap (1000) — média: ${m.toFixed(4)} (sd ${s.toFixed(4)})</small>`;
        } finally {
            setTimeout(() => { $bootstrapBtn.disabled = false; window.__datalab_running = false; }, 120);
        }
    });

    attachOnce($csv, 'click', () => {
        const arr = toNumbers($input.value);
        if (!arr.length) return alert('Nada para exportar');
        const csv = arr.map((v, i) => `${i + 1},${v}`).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'datalab.csv'; a.click();
        URL.revokeObjectURL(url);
    });

    // correlação/regressão de duas colunas
    const corrBtn = document.getElementById('btn-corr');
    const regBtn = document.getElementById('btn-reg');
    const corrResult = document.getElementById('dl-corr-result');
    const regResult = document.getElementById('dl-regresult');

    attachOnce(corrBtn, 'click', () => {
        if (window.__datalab_running) return;
        const raw = ($input2 && $input2.value) ? $input2.value.trim() : '';
        if (!raw) return alert('Cole duas colunas');
        let x = [], y = [];
        if (raw.includes(';')) { const parts = raw.split(';'); x = toNumbers(parts[0]); y = toNumbers(parts[1]); }
        else {
            const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
            lines.forEach(l => {
                const p = l.split(/[ ,;\t]+/).filter(Boolean);
                if (p.length >= 2) { x.push(Number(p[0])); y.push(Number(p[1])); }
            });
        }
        if (x.length !== y.length || !x.length) return alert('Colunas com tamanhos diferentes ou vazias');
        const r = pearson(x, y);
        corrResult.innerHTML = `r = ${r.toFixed(4)} (Pearson)`;
    });

    attachOnce(regBtn, 'click', () => {
        if (window.__datalab_running) return;
        const raw = ($input2 && $input2.value) ? $input2.value.trim() : '';
        if (!raw) return alert('Cole duas colunas');
        let x = [], y = [];
        if (raw.includes(';')) { const parts = raw.split(';'); x = toNumbers(parts[0]); y = toNumbers(parts[1]); }
        else {
            const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
            lines.forEach(l => {
                const p = l.split(/[ ,;\t]+/).filter(Boolean);
                if (p.length >= 2) { x.push(Number(p[0])); y.push(Number(p[1])); }
            });
        }
        if (x.length !== y.length || !x.length) return alert('Colunas com tamanhos diferentes ou vazias');
        const lr = linearRegression(x, y);
        if (lr) regResult.innerHTML = `y = ${lr.alpha.toFixed(4)} + ${lr.beta.toFixed(4)} * x`;
    });

    try {
        AppLog.info('Iniciando DataLab');
        if (!$input?.value) AppLog.warn('Valores vazios detectados');
    } catch (e) {
        console.warn('AppLog não disponível:', e);
        console.error('Erro no cálculo DataLab:', e);
    }


    // fim init
})();
