# CDD - Hub Pessoal de Ciência de Dados

Hub pessoal de estudos para transição de carreira para Ciência de Dados.

## Sobre o Projeto

Este é um painel pessoal completo criado para organizar e acompanhar minha jornada de aprendizado em Ciência de Dados. O projeto funciona totalmente no front-end, sem necessidade de backend, utilizando localStorage para persistência de dados.

## Funcionalidades

O hub contém 15 seções principais:

1. **Resumo** - Visão geral sobre Ciência de Dados e o papel do cientista de dados
2. **Fundamentos** - Base de conhecimento necessária (Programação, Matemática, Ciência de Dados, Comunicação)
3. **Ferramentas** - Ferramentas para iniciantes e avançados
4. **Grade de Estudos** - Currículo completo baseado no Bacharelado em Ciência de Dados da UFMG 2025
5. **Playlist** - Vídeos recomendados do YouTube
6. **Projetos** - Ideias de projetos práticos para portfólio
7. **Datasets** - Fontes de dados públicas
8. **Roadmap** - Caminho estruturado do aprendizado até a vaga
9. **Currículo** - Como vender o perfil na transição de carreira
10. **Checklist** - Marcar conteúdos já dominados (salvo no localStorage)
11. **To-do** - Kanban simples com 3 colunas: Estudar, Praticar, Entregar
12. **Anotações** - Bloco de notas livre
13. **Data Lab** - Calculadora de estatísticas descritivas
14. **ML Demo** - Demonstração de previsão com modelo simplificado
15. **Comparação** - Diferenças entre Analista, Cientista e Engenheiro de Dados

## Tecnologias Utilizadas

- **HTML5**
- **CSS3** (tema dark customizado)
- **Bootstrap 5.3.2** (grid, componentes, responsividade)
- **jQuery 3.7.1** (navegação SPA, manipulação DOM)
- **JavaScript puro** (lógica de negócio modular)
- **localStorage** (persistência de dados)
- **Vite** (build tool)

## Estrutura de Arquivos

```
cdd/
├── index.html                  # Página principal
├── assets/
│   └── styles.css             # CSS customizado dark theme
├── js/
│   ├── app.js                 # Inicialização e navegação
│   ├── state.js               # Gerenciamento de localStorage
│   ├── data.js                # Dados estáticos e carregamento do JSON
│   └── ui.js                  # Funções de renderização
├── data/
│   └── periodos_curso.json    # Grade curricular estruturada
└── notes/
    └── notes.md               # Anotações iniciais
```

## Como Usar

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Execute o servidor de desenvolvimento: `npm run dev`
4. Ou abra o arquivo `index.html` diretamente no navegador

## Build para Produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

## Funcionalidades de Persistência

O projeto utiliza localStorage para salvar:
- Progresso do checklist
- Tarefas do Kanban (Estudar, Praticar, Entregar)
- Anotações pessoais

Todos os dados são salvos automaticamente no navegador.

## Características do Design

- Tema dark com paleta de cores profissional
- Sidebar fixa para navegação
- Cards com border-radius de 14px
- Animações suaves de transição
- Totalmente responsivo (mobile e desktop)
- Badges e alertas coloridos para destacar informações
- Timeline visual para o Roadmap

## Autor

Projeto criado como ferramenta de estudo pessoal para transição de carreira em Ciência de Dados.