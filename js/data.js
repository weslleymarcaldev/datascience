// ds/js/data.js
// Dados estáticos usados pelo app (projetos, roadmap, grade curricular)

/* ---------------- PROJETOS ---------------- */
const PROJETOS_DATA = [
    {
        titulo: "Análise Exploratória de Dados Públicos",
        dificuldade: "iniciante",
        corBadge: "success",
        descricao: "Escolha uma base de dados pública (ex.: acidentes de trânsito, COVID-19, imóveis, criminalidade) e faça uma análise exploratória completa.",
        atividades: [
            "Importar e limpar os dados",
            "Estatísticas descritivas",
            "Visualizações (gráficos de barra, linha, dispersão)",
            "Identificar padrões e correlações",
            "Criar um relatório em Jupyter Notebook"
        ],
        habilidades: ["Pandas", "Matplotlib", "Seaborn", "Estatística", "Storytelling"]
    },
    {
        titulo: "Classificador de Fraude/Spam",
        dificuldade: "intermediário",
        corBadge: "warning",
        descricao: "Criar um modelo de Machine Learning para detectar transações fraudulentas ou emails de spam.",
        atividades: [
            "Pré-processar dados desbalanceados",
            "Feature engineering",
            "Treinar modelos (Logistic Regression, Random Forest, XGBoost)",
            "Avaliar com métricas apropriadas (Precision, Recall, F1, AUC-ROC)",
            "Tunar hiperparâmetros"
        ],
        habilidades: ["Scikit-learn", "Classificação", "Validação", "Métricas", "Tuning"]
    },
    {
        titulo: "Previsão de Demanda/Vendas",
        dificuldade: "intermediário",
        corBadge: "warning",
        descricao: "Prever vendas futuras de um produto ou demanda de um serviço usando séries temporais.",
        atividades: [
            "Análise de séries temporais",
            "Decomposição (tendência, sazonalidade)",
            "Modelos (ARIMA, Prophet, LSTM)",
            "Avaliar performance (RMSE, MAE, MAPE)",
            "Visualizar previsões vs valores reais"
        ],
        habilidades: ["Séries Temporais", "Regressão", "Prophet", "Forecasting", "Validação"]
    },
    {
        titulo: "Dashboard Interativo",
        dificuldade: "iniciante",
        corBadge: "success",
        descricao: "Criar um dashboard web interativo para visualizar dados em tempo real.",
        atividades: [
            "Conectar a uma base de dados ou API",
            "Criar visualizações interativas",
            "Adicionar filtros e seletores",
            "Deploy em Streamlit, Dash ou mesmo HTML/JS",
            "Documentar e compartilhar"
        ],
        habilidades: ["Streamlit", "Plotly", "Visualização", "Deploy", "UI/UX"]
    },
    {
        titulo: "API de Modelo ML",
        dificuldade: "avançado",
        corBadge: "danger",
        descricao: "Treinar um modelo e disponibilizá-lo como API REST para consumo externo.",
        atividades: [
            "Treinar e salvar modelo (pickle/joblib)",
            "Criar API com FastAPI",
            "Documentação automática (Swagger)",
            "Containerizar com Docker",
            "Deploy em cloud (Render, Railway, AWS)"
        ],
        habilidades: ["FastAPI", "Docker", "Deploy", "APIs", "MLOps"]
    },
    {
        titulo: "Sistema de Recomendação",
        dificuldade: "intermediário",
        corBadge: "warning",
        descricao: "Criar um sistema que recomenda filmes, produtos ou conteúdos baseado em preferências do usuário.",
        atividades: [
            "Usar base de ratings (MovieLens, por exemplo)",
            "Implementar filtragem colaborativa",
            "Implementar filtragem baseada em conteúdo",
            "Avaliar recomendações (RMSE, MAP)",
            "Interface simples para testar"
        ],
        habilidades: ["Recomendação", "Collaborative Filtering", "Similarity", "Scikit-learn", "Sparse Matrix"]
    }
];

/* ---------------- ROADMAP ---------------- */
const ROADMAP_DATA = [
    {
        fase: 1,
        titulo: "Fase 1: Base (3-4 meses)",
        objetivo: "Dominar fundamentos essenciais",
        topicos: [
            "Python básico e intermediário (lógica, funções, OOP)",
            "SQL (SELECT, JOIN, agregações, subconsultas)",
            "Estatística básica (média, mediana, variância, distribuições)",
            "Git e GitHub (versionamento, commits, branches)",
            "Jupyter Notebook"
        ],
        badges: [
            { texto: "Python", cor: "success" },
            { texto: "SQL", cor: "success" },
            { texto: "Estatística", cor: "success" },
            { texto: "Git", cor: "success" }
        ]
    },
    {
        fase: 2,
        titulo: "Fase 2: Análise de Dados (3-4 meses)",
        objetivo: "Transformar dados em insights",
        topicos: [
            "Pandas (DataFrames, groupby, merge, pivot)",
            "NumPy (arrays, operações vetorizadas)",
            "Matplotlib e Seaborn (visualizações estáticas)",
            "Plotly (visualizações interativas)",
            "EDA (Análise Exploratória de Dados)",
            "Storytelling com dados",
            "<strong>Projeto:</strong> Análise completa de dataset público com relatório"
        ],
        badges: [
            { texto: "Pandas", cor: "primary" },
            { texto: "NumPy", cor: "primary" },
            { texto: "Visualização", cor: "primary" },
            { texto: "EDA", cor: "primary" }
        ]
    },
    {
        fase: 3,
        titulo: "Fase 3: Machine Learning Clássico (4-5 meses)",
        objetivo: "Criar modelos preditivos",
        topicos: [
            "Álgebra Linear básica (vetores, matrizes)",
            "Probabilidade e estatística inferencial",
            "Scikit-learn (regressão, classificação, clustering)",
            "Feature engineering e seleção",
            "Validação cruzada e métricas",
            "Tuning de hiperparâmetros",
            "<strong>Projetos:</strong> Classificador de fraude + Previsão de vendas"
        ],
        badges: [
            { texto: "Scikit-learn", cor: "warning" },
            { texto: "ML", cor: "warning" },
            { texto: "Validação", cor: "warning" },
            { texto: "Métricas", cor: "warning" }
        ]
    },
    {
        fase: 4,
        titulo: "Fase 4: Deploy e Portfólio (2-3 meses)",
        objetivo: "Colocar modelos em produção",
        topicos: [
            "FastAPI (criar APIs REST)",
            "Docker básico (containerização)",
            "Deploy em cloud (Render, Railway, Heroku)",
            "Streamlit (dashboards interativos)",
            "GitHub Pages ou portfólio web",
            "<strong>Projetos:</strong> API de modelo ML + Dashboard interativo",
            "Documentar projetos com README detalhado"
        ],
        badges: [
            { texto: "FastAPI", cor: "danger" },
            { texto: "Docker", cor: "danger" },
            { texto: "Deploy", cor: "danger" },
            { texto: "Streamlit", cor: "danger" }
        ]
    },
    {
        fase: 5,
        titulo: "Fase 5: Entrevista e Vaga (ongoing)",
        objetivo: "Conseguir a primeira vaga",
        topicos: [
            "Currículo orientado a impacto (resultados, não só tecnologias)",
            "LinkedIn otimizado (palavras-chave, projetos, posts)",
            "Portfolio com 3-5 projetos completos no GitHub",
            "Praticar SQL e Python (LeetCode, HackerRank)",
            "Estudar cases de negócio (Como você analisaria X?)",
            "Networking (eventos, meetups, comunidades)",
            "Aplicar para vagas de Analista de Dados Jr / Cientista de Dados Jr",
            "Preparar apresentação de projetos (storytelling)"
        ],
        badges: [
            { texto: "Currículo", cor: "info" },
            { texto: "LinkedIn", cor: "info" },
            { texto: "Portfolio", cor: "info" },
            { texto: "Networking", cor: "info" }
        ]
    }
];

/* ---------------- GRADE CURRICULAR ---------------- */
/* Conteúdo copiado direto de data/periodos_curso.json */
const PERIODOS_CURSO = {
    "1": [
        {
            "codigo": "DCC203",
            "nome": "Programação e Desenvolvimento de Software I",
            "ch": 60,
            "creditos": 4,
            "pre": []
        },
        {
            "codigo": "DCC638",
            "nome": "Introdução à Lógica Computacional",
            "ch": 60,
            "creditos": 4,
            "pre": []
        },
        {
            "codigo": "ICE071",
            "nome": "Fundamentos de Ciência de Dados",
            "ch": 60,
            "creditos": 4,
            "pre": []
        },
        {
            "codigo": "MAT001",
            "nome": "Cálculo Diferencial e Integral I",
            "ch": 90,
            "creditos": 6,
            "pre": []
        },
        {
            "codigo": "CAD103",
            "nome": "Administração TGA",
            "ch": 60,
            "creditos": 4,
            "pre": []
        }
    ],
    "2": [
        {
            "codigo": "DCC204",
            "nome": "Programação e Desenvolvimento de Software II",
            "ch": 60,
            "creditos": 4,
            "pre": ["DCC203"]
        },
        {
            "codigo": "DCC216",
            "nome": "Matemática Discreta",
            "ch": 60,
            "creditos": 4,
            "pre": ["DCC638"]
        },
        {
            "codigo": "EST229",
            "nome": "Estatística Básica",
            "ch": 60,
            "creditos": 4,
            "pre": ["ICE071"]
        },
        {
            "codigo": "MAT038",
            "nome": "Geometria Analítica e Álgebra Linear",
            "ch": 60,
            "creditos": 4,
            "pre": []
        },
        {
            "codigo": "MAT039",
            "nome": "Cálculo Diferencial e Integral II",
            "ch": 60,
            "creditos": 4,
            "pre": ["MAT001"]
        }
    ],
    "3": [
        {
            "codigo": "DCC011",
            "nome": "Introdução a Banco de Dados",
            "ch": 60,
            "creditos": 4,
            "pre": ["DCC204", "DCC638"]
        },
        {
            "codigo": "DCC205",
            "nome": "Estruturas de Dados",
            "ch": 60,
            "creditos": 4,
            "pre": ["DCC204"]
        },
        {
            "codigo": "DCC639",
            "nome": "Álgebra Linear Computacional",
            "ch": 60,
            "creditos": 4,
            "pre": ["MAT001", "MAT038"]
        },
        {
            "codigo": "ECN140",
            "nome": "Introdução à Economia",
            "ch": 60,
            "creditos": 4,
            "pre": []
        },
        {
            "codigo": "EST230",
            "nome": "Probabilidade",
            "ch": 90,
            "creditos": 6,
            "pre": ["MAT039"]
        }
    ],
    "4": [
        {
            "codigo": "DCC194",
            "nome": "Interação Humano-Computador",
            "ch": 60,
            "creditos": 4,
            "pre": []
        },
        {
            "codigo": "DCC206",
            "nome": "Algoritmos I",
            "ch": 60,
            "creditos": 4,
            "pre": ["DCC205"]
        },
        {
            "codigo": "EST035",
            "nome": "Análise de Regressão",
            "ch": 60,
            "creditos": 4,
            "pre": ["EST229"]
        },
        {
            "codigo": "EST231",
            "nome": "Inferência Clássica",
            "ch": 60,
            "creditos": 4,
            "pre": ["EST230"]
        },
        {
            "codigo": "ICE072",
            "nome": "Introdução à Ciência de Dados",
            "ch": 60,
            "creditos": 4,
            "pre": ["DCC639", "EST230"]
        }
    ],
    "5": [
        {
            "codigo": "DCC074",
            "nome": "Fundamentos de Arquitetura de Computadores",
            "ch": 60,
            "creditos": 4,
            "pre": []
        },
        {
            "codigo": "DCC603",
            "nome": "Engenharia de Software",
            "ch": 60,
            "creditos": 4,
            "pre": ["DCC205"]
        },
        {
            "codigo": "DCC642",
            "nome": "Introdução à Inteligência Artificial",
            "ch": 30,
            "creditos": 2,
            "pre": []
        },
        {
            "codigo": "EST079",
            "nome": "Modelos Lineares Generalizados",
            "ch": 60,
            "creditos": 4,
            "pre": ["EST035", "EST231"]
        },
        {
            "codigo": "EST088",
            "nome": "Inferência Estatística com Abordagem Bayesiana",
            "ch": 60,
            "creditos": 4,
            "pre": ["EST230", "EST231"]
        },
        {
            "codigo": "ICE144",
            "nome": "Mineração de Dados",
            "ch": 60,
            "creditos": 4,
            "pre": ["ICE072"]
        }
    ],
    "6": [
        {
            "codigo": "DCC075",
            "nome": "Fundamentos de Sistemas Computacionais",
            "ch": 60,
            "creditos": 4,
            "pre": ["DCC074"]
        },
        {
            "codigo": "EST011",
            "nome": "Estatística Multivariada",
            "ch": 60,
            "creditos": 4,
            "pre": ["EST035", "MAT038", "EST231"]
        },
        {
            "codigo": "EST080",
            "nome": "Estatística Não Paramétrica",
            "ch": 60,
            "creditos": 4,
            "pre": ["EST231"]
        },
        {
            "codigo": "ICE145",
            "nome": "Ciência de Dados e Sociedade",
            "ch": 30,
            "creditos": 2,
            "pre": ["ICE072"]
        },
        {
            "codigo": "ICE146",
            "nome": "Ética e Ciência de Dados",
            "ch": 30,
            "creditos": 2,
            "pre": ["ICE072"]
        },
        {
            "codigo": "ICE147",
            "nome": "Aprendizado de Máquina Supervisionado",
            "ch": 60,
            "creditos": 4,
            "pre": ["ICE144"]
        }
    ],
    "7": [
        {
            "codigo": "DCC076",
            "nome": "Recuperação de Informação",
            "ch": 60,
            "creditos": 4,
            "pre": ["DCC206"]
        },
        {
            "codigo": "DCC077",
            "nome": "Introdução à Computação Visual",
            "ch": 60,
            "creditos": 4,
            "pre": ["MAT038"]
        },
        {
            "codigo": "EST038",
            "nome": "Métodos Estatísticos de Previsão",
            "ch": 60,
            "creditos": 4,
            "pre": ["EST231"]
        },
        {
            "codigo": "EST090",
            "nome": "Análise de Sobrevivência",
            "ch": 60,
            "creditos": 4,
            "pre": ["EST035", "EST231"]
        },
        {
            "codigo": "ICE148",
            "nome": "Aprendizado de Máquina Não Supervisionado",
            "ch": 60,
            "creditos": 4,
            "pre": ["ICE147"]
        },
        {
            "codigo": "OPT7",
            "nome": "Optativas",
            "ch": 60,
            "creditos": 4,
            "pre": []
        }
    ],
    "8": [
        {
            "codigo": "ICE149",
            "nome": "Monografia I",
            "ch": 60,
            "creditos": 4,
            "pre": []
        }
    ],
    "9": [
        {
            "codigo": "ICE150",
            "nome": "Monografia II",
            "ch": 60,
            "creditos": 4,
            "pre": ["ICE149"]
        },
        {
            "codigo": "NG9",
            "nome": "Núcleo Geral",
            "ch": 60,
            "creditos": 4,
            "pre": []
        },
        {
            "codigo": "OPT9",
            "nome": "Optativas",
            "ch": 270,
            "creditos": 18,
            "pre": []
        }
    ]
};

/* ---------------- Função helper para a UI ---------------- */
function carregarPeriodosCurso() {
    // agora é só devolver direto, nada de fetch, então sem async/await
    return PERIODOS_CURSO;
}
