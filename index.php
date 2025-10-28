<!DOCTYPE html>
<html lang="pt-BR" data-bs-theme="dark">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CDD - Hub de Ciência de Dados</title>
    <link href="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css" rel="stylesheet">

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">
    <!-- Estilos custom -->
    <link href="assets/styles.css" rel="stylesheet">
</head>

<body class="bg-dark text-light">
    <div class="app-wrapper d-flex">

        <!-- SIDEBAR -->
        <nav id="sidebar"
            class="sidebar-area bg-black p-3"
            style="min-width:250px;max-width:250px;min-height:100vh; border-right:1px solid #2a3a4f;">

            <div class="sidebar-header mb-4 d-flex flex-column">
                <div class="d-flex align-items-start justify-content-between w-100">
                    <div>
                        <h3 class="m-0 d-flex align-items-center gap-2 text-light">
                            <i class="bi bi-mortarboard-fill text-primary"></i>
                            <span>CDD Hub</span>
                        </h3>
                        <p class="text-muted small mb-0">Ciência de Dados</p>
                    </div>

                    <!-- botão fechar lateral em telas menores -->
                    <button class="btn btn-sm btn-outline-light d-lg-none"
                        id="btn-close-sidebar"
                        style="line-height:1;padding:.25rem .4rem;"
                        aria-label="Fechar painel lateral"
                        title="Fechar painel lateral">
                        <i class="bi bi-x-lg" aria-hidden="true"></i>
                    </button>


                </div>
            </div>

            <div class="accordion accordion-flush" id="sidebar-accordion">

                <!-- TRILHA DE ESTUDO -->
                <div class="accordion-item bg-black border-0">
                    <h2 class="accordion-header" id="group-estudo-heading">
                        <button class="accordion-button collapsed bg-black text-light border-0 px-0"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#group-estudo"
                            aria-expanded="false"
                            aria-controls="group-estudo">
                            <i class="bi bi-journal-check me-2 text-primary"></i>
                            Trilha de Estudo
                        </button>
                    </h2>
                    <div id="group-estudo"
                        class="accordion-collapse collapse show"
                        aria-labelledby="group-estudo-heading"
                        data-bs-parent="#sidebar-accordion">
                        <div class="accordion-body py-2 px-0">
                            <a href="#" class="sidebar-link d-block py-2 text-decoration-none text-light ps-4" data-section="resumo">
                                <i class="bi bi-house-door me-2"></i> Resumo
                            </a>
                            <a href="#" class="sidebar-link d-block py-2 text-decoration-none text-light ps-4" data-section="roadmap">
                                <i class="bi bi-map me-2"></i> Roadmap
                            </a>
                            <a href="#" class="sidebar-link d-block py-2 text-decoration-none text-light ps-4" data-section="grade">
                                <i class="bi bi-journal-text me-2"></i> Grade de Estudos
                            </a>
                            <a href="#" class="sidebar-link d-block py-2 text-decoration-none text-light ps-4" data-section="fundamentos">
                                <i class="bi bi-book me-2"></i> Fundamentos
                            </a>
                            <a href="#" class="sidebar-link d-block py-2 text-decoration-none text-light ps-4" data-section="ferramentas">
                                <i class="bi bi-tools me-2"></i> Ferramentas
                            </a>
                            <a href="#" class="sidebar-link d-block py-2 text-decoration-none text-light ps-4" data-section="optativas">
                                <i class="bi bi-diagram-3 me-2"></i> Optativas
                            </a>
                        </div>
                    </div>
                </div>

                <!-- PRÁTICA E PORTFÓLIO -->
                <div class="accordion-item bg-black border-0">
                    <h2 class="accordion-header" id="group-portfolio-heading">
                        <button class="accordion-button collapsed bg-black text-light border-0 px-0"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#group-portfolio"
                            aria-expanded="false"
                            aria-controls="group-portfolio">
                            <i class="bi bi-braces-asterisk me-2 text-warning"></i>
                            Prática &amp; Portfólio
                        </button>
                    </h2>
                    <div id="group-portfolio"
                        class="accordion-collapse collapse"
                        aria-labelledby="group-portfolio-heading"
                        data-bs-parent="#sidebar-accordion">
                        <div class="accordion-body py-2 px-0">
                            <a href="#" class="sidebar-link d-block py-2 text-decoration-none text-light ps-4" data-section="projetos">
                                <i class="bi bi-folder me-2"></i> Projetos
                            </a>
                            <a href="#" class="sidebar-link d-block py-2 text-decoration-none text-light ps-4" data-section="datasets">
                                <i class="bi bi-table me-2"></i> Datasets
                            </a>
                            <a href="#" class="sidebar-link d-block py-2 text-decoration-none text-light ps-4" data-section="mldemo">
                                <i class="bi bi-cpu me-2"></i> ML Demo
                            </a>
                            <a href="#" class="sidebar-link d-block py-2 text-decoration-none text-light ps-4" data-section="comparacao">
                                <i class="bi bi-diagram-3 me-2"></i> Comparação
                            </a>
                            <a href="#" class="sidebar-link d-block py-2 text-decoration-none text-light ps-4" data-section="curriculo">
                                <i class="bi bi-file-person me-2"></i> Currículo
                            </a>
                        </div>
                    </div>
                </div>

                <!-- EXECUÇÃO DIÁRIA -->
                <!-- <div class="accordion-item bg-black border-0"> 
                    <h2 class="accordion-header" id="group-diario-heading"> 
                        <button class="accordion-button collapsed bg-black text-light border-0 px-0" type="button" data-bs-toggle="collapse" data-bs-target="#group-diario" aria-expanded="false" aria-controls="group-diario"> 
                            <i class="bi bi-rocket-takeoff me-2 text-success"></i> Execução Diária </button> 
                        </h2> 
                        <div id="group-diario" class="accordion-collapse collapse" aria-labelledby="group-diario-heading" data-bs-parent="#sidebar-accordion"> 
                            <div class="accordion-body py-2 px-0"> 
                                <a href="#" class="sidebar-link d-block py-2 text-decoration-none text-light ps-4" data-section="checklist"> 
                                    <i class="bi bi-check-square me-2"></i> Checklist </a> 
                                <a href="#" class="sidebar-link d-block py-2 text-decoration-none text-light ps-4" data-section="todo"> 
                                    <i class="bi bi-kanban me-2"></i> To-do </a> 
                                <a href="#" class="sidebar-link d-block py-2 text-decoration-none text-light ps-4" data-section="anotacoes"> 
                                    <i class="bi bi-pencil-square me-2"></i> Anotações </a> 
                                <a href="#" class="sidebar-link d-block py-2 text-decoration-none text-light ps-4" data-section="datalab"> 
                                    <i class="bi bi-calculator me-2"></i> Data Lab </a> 
                                </div> 
                            </div> 
                        </div> 
                    </div> -->

            </div>
        </nav>

        <!-- ÁREA DINÂMICA / CONTEÚDO -->
        <div id="content" class="content flex-grow-1 p-4 text-light" style="background-color:#0b1220;">

            <!-- HEADER SUPERIOR COM BOTÃO HAMBURGUER -->
            <div class="d-flex align-items-center justify-content-between flex-wrap mb-4 border-bottom border-secondary pb-2">
                <button class="btn btn-outline-light btn-sm" id="btn-toggle-sidebar" style="line-height:1;">
                    <i class="bi bi-list"></i>
                </button>

                <div class="small text-muted ms-auto ps-3 d-none d-md-block text-end">
                    <div><i class="bi bi-person-workspace"></i> Modo Estudo Ativo</div>
                    <div class="text-secondary" id="status-progresso-dia">
                        Foco: Probabilidade
                    </div>
                </div>
            </div>

            <!-- AÇÕES RÁPIDAS (seus botões de topo) -->
            <div class="d-flex flex-wrap gap-3 align-items-center mb-4">
                <button class="action-open position-relative bg-transparent border-0 p-0 text-start" data-target="checklist">
                    <i class="bi bi-check-square text-success"></i>
                    <span class="text-success">Checklist</span>

                    <span id="badge-checklist-hoje"
                        class="position-absolute translate-middle badge rounded-pill bg-success"
                        style="top:-10px; left:48px;">
                        0/35
                    </span>
                </button>

                <button class="action-open bg-transparent border-0 p-0 text-start" data-target="todo">
                    <i class="bi bi-kanban text-warning"></i>
                    <span class="text-warning">To-do</span>
                </button>

                <button class="action-open bg-transparent border-0 p-0 text-start" data-target="anotacoes">
                    <i class="bi bi-pencil-square text-primary"></i>
                    <span class="text-primary">Anotar</span>
                </button>

                <button class="action-open bg-transparent border-0 p-0 text-start" data-target="datalab">
                    <i class="bi bi-calculator text-primary"></i>
                    <span class="text-primary">Data Lab</span>
                </button>
            </div>

            <!-- Aqui vamos injetar a página ativa -->
            <div id="page-container"></div>
        </div>
    </div>


    <!-- jQuery CDN -->
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <!-- Bootstrap Bundle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.min.js"></script>
    <script src="js/notas.js"></script>

    <!-- Seus módulos -->
    <script src="js/state.js"></script>
    <script src="js/data.js"></script>
    <script src="js/ui.js"></script>
    <!-- Orquestrador final -->
    <script src="js/app.js"></script>
    <script>
        (function() {
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
        })();
    </script>

</body>

</html>