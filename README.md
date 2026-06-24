# 🏆 CopaPortal

O **CopaPortal** é uma plataforma moderna e em tempo real para acompanhamento da Copa do Mundo. Desenvolvido com foco em performance e experiência do usuário (UX/UI), o portal oferece resultados ao vivo, tabelas de classificação, estatísticas de jogadores e em breve um sistema completo de notícias.

## 🚀 Funcionalidades

- **🔴 Central de Jogos Ao Vivo:** Acompanhe os placares em tempo real com atualização automática a cada 15 segundos.
- **📊 Fase de Grupos:** Tabelas completas e atualizadas automaticamente com pontos, vitórias, saldo de gols e classificação.
- **👟 Estatísticas Individuais:** Rankings interativos da Chuteira de Ouro (Artilheiros) e Top Garçons (Assistências).
- **📺 Transmissão Oficial:** Área dedicada para integração com transmissões ao vivo via YouTube (ex: CazéTV).
- **📰 Portal de Notícias:** (Em desenvolvimento) Sistema de notícias gerenciado via banco de dados próprio.

## 💻 Tecnologias Utilizadas

Este projeto foi construído utilizando as ferramentas mais modernas do ecossistema front-end:

- **[Next.js](https://nextjs.org/)** - Framework React com App Router.
- **[Tailwind CSS](https://tailwindcss.com/)** - Estilização focada em utilitários com design *Dark Premium*.
- **[SWR](https://swr.vercel.app/)** - Biblioteca da Vercel para *data fetching*, cache e atualizações em tempo real (Long Polling).
- **[Football-Data API](https://www.football-data.org/)** - Consumo de dados oficiais da competição (REST API).

## 🛠️ Como rodar o projeto na sua máquina

### Pré-requisitos
Antes de começar, você vai precisar ter o [Node.js](https://nodejs.org/) instalado na sua máquina.

### 1. Clonando o repositório
```bash
git clone [https://github.com/SEU_USUARIO/copaportal.git](https://github.com/SEU_USUARIO/copaportal.git)
cd copaportal
2. Instalando as dependências
Bash
npm install
3. Configurando as Variáveis de Ambiente
Crie um arquivo chamado .env.local na raiz do projeto e adicione as suas chaves. Você precisará de um Token gratuito da football-data.org.

Plaintext
# Arquivo: .env.local
FOOTBALL_DATA_TOKEN=seu_token_da_api_aqui

# (Opcional) Banco de dados para a seção de notícias que faremos em breve
MONGODB_URI=sua_url_do_mongodb_aqui
4. Rodando o Servidor de Desenvolvimento
Bash
npm run dev
Abra o seu navegador e acesse http://localhost:3000 para ver a mágica acontecer! As páginas são atualizadas automaticamente conforme você edita os arquivos.

📂 Estrutura de Rotas Atuais
/ - Home / Ao Vivo: Painel principal com a transmissão e a lista de jogos do dia.

/grupos - Tabelas: A classificação completa dos 8 grupos da Copa.

/estatisticas - Estatísticas: Painel detalhado com o ranking de jogadores.

(Em breve) /noticias - Notícias: Feed de atualizações e matérias.

---
Desenvolvido com 💚 e muito código por **[Rafael Inacio](https://github.com/RafaelInaciodeOliveira)**.