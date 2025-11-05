/*
 * ds\js\sidebar.js
 * 
 * Responsável por controlar o estado da sidebar (colapsada ou não)
 * e restaurar o estado salvo no localStorage.
 */

const wrapper = document.querySelector('.app-wrapper');
const btnToggle = document.getElementById('btn-toggle-sidebar');
const btnClose = document.getElementById('btn-close-sidebar');

// Restaurar estado salvo
const saved = localStorage.getItem('cdd_sidebar_collapsed');
if (saved === 'true') {
    wrapper.classList.add('is-collapsed');
}

// Clicar no hamburguer -> alterna
if (btnToggle) {
    btnToggle.addEventListener('click', () => {
        wrapper.classList.toggle('is-collapsed');

        const collapsedNow = wrapper.classList.contains('is-collapsed');
        localStorage.setItem('cdd_sidebar_collapsed', collapsedNow ? 'true' : 'false');
    });
}

// Clicar no X dentro da sidebar -> força fechar (bom pra mobile)
if (btnClose) {
    btnClose.addEventListener('click', () => {
        wrapper.classList.add('is-collapsed');
        localStorage.setItem('cdd_sidebar_collapsed', 'true');
    });
}