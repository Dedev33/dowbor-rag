# Assistente de Pesquisa — A Era do Capital Improdutivo

Assistente de pesquisa com IA para o livro **"A Era do Capital Improdutivo"** de **Ladislau Dowbor** (2017).

Demo para dowbor.org — construído com Next.js + OpenAI GPT-4o.

---

## Como funciona

**Sem vectors, sem banco de dados.** O sistema usa uma abordagem simples e eficaz para uma demonstração:

1. O conteúdo-chave do livro (conceitos, capítulos, citações) está embutido como contexto no `lib/book-content.ts`
2. Cada pergunta do usuário é enviada ao GPT-4o com esse contexto como system prompt
3. O modelo responde fundamentado no texto do livro, em streaming
4. Suporta perguntas em Português, Inglês, Espanhol e Francês

---

## Stack

- **Next.js 14** (App Router) — framework
- **OpenAI GPT-4o** — modelo de linguagem
- **Vercel** — hospedagem (plano free funciona)
- **CSS puro** — sem Tailwind, sem dependências de UI
- **Zero banco de dados** — sem vetores, sem infraestrutura

---

## Deploy no Vercel (5 minutos)

### Pré-requisitos
- Conta no [Vercel](https://vercel.com) (gratuita)
- Conta na [OpenAI](https://platform.openai.com) com créditos
- [Git](https://git-scm.com) instalado

### Passo a passo

**1. Suba o código para o GitHub**
```bash
git init
git add .
git commit -m "Assistente Dowbor - versão inicial"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/dowbor-assistente.git
git push -u origin main
```

**2. Importe no Vercel**
- Acesse [vercel.com/new](https://vercel.com/new)
- Clique em "Import Git Repository"
- Selecione o repositório `dowbor-assistente`
- Clique em "Deploy" (as configurações são detectadas automaticamente)

**3. Configure a variável de ambiente**
- No painel do Vercel, vá em: Settings → Environment Variables
- Adicione:
  - **Name:** `OPENAI_API_KEY`
  - **Value:** sua chave da OpenAI (começa com `sk-...`)
  - **Environment:** Production, Preview, Development (marque todos)
- Clique em "Save"

**4. Redeploy**
- Vá em Deployments → clique no último deploy → "Redeploy"
- Em ~1 minuto, o site estará no ar em `https://dowbor-assistente.vercel.app`

---

## Desenvolvimento local

```bash
# 1. Clone
git clone https://github.com/SEU_USUARIO/dowbor-assistente.git
cd dowbor-assistente

# 2. Instale dependências
npm install

# 3. Configure a API key
cp .env.example .env.local
# Edite .env.local e cole sua OPENAI_API_KEY

# 4. Rode em desenvolvimento
npm run dev
# Acesse: http://localhost:3000
```

---

## Estrutura do projeto

```
dowbor-assistente/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts      # API route — chama OpenAI com streaming
│   ├── globals.css           # Estilos — identidade visual dowbor.org
│   ├── layout.tsx            # Layout global com fontes
│   └── page.tsx              # Interface principal do chat
├── lib/
│   └── book-content.ts       # ⭐ Conteúdo do livro + system prompt
├── .env.example              # Modelo de variáveis de ambiente
├── package.json
├── tsconfig.json
└── vercel.json
```

---

## Expandindo para mais livros

Quando quiser adicionar mais livros ou usar vetores de verdade:

1. **Mais livros (sem vetores):** Adicione o conteúdo em `lib/book-content.ts` e expanda o system prompt. GPT-4o suporta 128k tokens de contexto.

2. **Com vetores (fase futura):** Migre para:
   - **Embeddings:** OpenAI `text-embedding-3-small` 
   - **Vector store:** Vercel KV + pgvector, ou Pinecone
   - **Ingestion:** Script Python para extrair e chunkar os PDFs do dowbor.org

---

## Custo estimado

Com GPT-4o a $2.50/1M tokens input e $10/1M tokens output:
- System prompt: ~3.000 tokens por chamada
- Resposta média: ~400 tokens
- **Custo por pergunta: ~$0.01 (1 centavo de dólar)**
- 1.000 perguntas = ~$10

Para reduzir custos, troque para `gpt-4o-mini` no `app/api/chat/route.ts` — qualidade um pouco menor mas 10x mais barato.

---

## Créditos

- **Autor do livro:** Prof. Ladislau Dowbor — [dowbor.org](https://dowbor.org)
- **Licença do conteúdo:** Creative Commons (CC BY-NC-ND 4.0)
- **Livro disponível gratuitamente:** [dowbor.org/wp-content/uploads/2018/11/Dowbor-_-A-ERA-DO-CAPITAL-IMPRODUTIVO.pdf](https://dowbor.org/wp-content/uploads/2018/11/Dowbor-_-A-ERA-DO-CAPITAL-IMPRODUTIVO.pdf)
