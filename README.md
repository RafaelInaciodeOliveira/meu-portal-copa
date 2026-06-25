# CopaPortal

O **CopaPortal** é uma plataforma Full-Stack moderna e em tempo real para acompanhamento de torneios de seleções. Desenvolvido com foco absoluto em performance, arquitetura de dados e experiência do usuário (UX/UI), o portal oferece desde o consumo de dados estatísticos complexos via APIs externas até um sistema próprio de gerenciamento de conteúdo (Headless CMS).

## Funcionalidades e Arquitetura

* **Central de Jogos Ao Vivo:** Acompanhamento de placares em tempo real com sincronização via Long Polling, destacando partidas em andamento, agendadas e encerradas.
* **Sistema Estatístico Interativo (Drill-down):**
  * Classificação de grupos com algoritmo de cálculo para os "Melhores Terceiros Colocados".
  * Ranking de Artilharia (Chuteira de Ouro) e Assistências.
  * Análise de Melhor Ataque e Melhor Defesa, com modais interativos revelando os goleadores específicos de cada seleção.
  * Modais de "Raio-X" consumindo dados detalhados de atletas específicos sob demanda.
* **Painel de Notícias Full-Stack:** Sistema CRUD completo com banco de dados próprio para publicações editoriais, integrado nativamente à interface pública.
* **Área Administrativa Segura:** Rota protegida (`/admin`) contendo um painel de controle para criação, edição e exclusão de manchetes jornalísticas.
* **UX/UI Premium:** Interface *Dark Mode* corporativa utilizando *Skeleton Loaders* para mitigar a percepção de latência de rede, garantindo transições de tela suaves sem layout shift.

## Tecnologias Utilizadas

Este projeto foi construído utilizando os padrões mais recentes do ecossistema front-end e back-end:

* **[Next.js](https://nextjs.org/)** - Framework React (App Router) para renderização otimizada e construção de rotas de API.
* **[Tailwind CSS](https://tailwindcss.com/)** - Estilização baseada em utilitários para um design responsivo e minimalista.
* **[SWR](https://swr.vercel.app/)** - Estratégia de cache e revalidação de dados para manter a interface rápida e atualizada.
* **[MongoDB & Mongoose](https://www.mongodb.com/)** - Banco de dados NoSQL e modelagem de dados para o módulo de notícias.
* **APIs de Futebol (REST)** - Integração com *Football-Data API* e *API-Sports* para consumo e higienização de dados em tempo real.

## Como executar o projeto localmente

### Pré-requisitos
Para rodar a aplicação, é necessário ter o [Node.js](https://nodejs.org/) instalado em sua máquina.

### 1. Clonando o repositório
```bash
git clone [https://github.com/SEU_USUARIO/copaportal.git](https://github.com/SEU_USUARIO/copaportal.git)
cd copaportal
2. Instalando as dependências
Bash
npm install
3. Configurando as Variáveis de Ambiente
Crie um arquivo chamado .env.local na raiz do projeto. Você precisará preencher as chaves de integração externas e a string de conexão com o seu banco de dados.

Plaintext
# Arquivo: .env.local

# API 1: Dados de Partidas e Tabelas
FOOTBALL_DATA_TOKEN=seu_token_aqui

# API 2: Dados Individuais de Jogadores
API_FOOTBALL_KEY=sua_chave_aqui

# Banco de Dados: Sistema de Notícias
MONGODB_URI=sua_connection_string_do_mongodb_atlas_aqui
4. Iniciando o Servidor
Bash
npm run dev
Acesse http://localhost:3000 em seu navegador. O Next.js compilará as páginas sob demanda.

Estrutura de Rotas
/ - Home: Painel principal com transmissão e central de partidas do dia.

/grupos - Tabelas: Classificação completa e cruzamento de dados para a próxima fase.

/estatisticas - Estatísticas: Painéis de desempenho individual e coletivo das seleções.

/noticias - Portal de Notícias: Feed público de reportagens consumidas do MongoDB.

/admin - Dashboard CMS: Painel de controle restrito para gestão de conteúdo (CRUD).

Desenvolvido com 💚 e muito código por **[Rafael Inacio](https://github.com/RafaelInaciodeOliveira)**.