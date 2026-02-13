// lib/book-content.ts
// Curated content from "A Era do Capital Improdutivo" by Ladislau Dowbor
// Source: dowbor.org (Creative Commons)
// This module provides structured book content for the RAG system.
// Instead of vectors, we use GPT-4o's large context window with curated chapter summaries
// and key passages. For a single book at demo scale, this is more than sufficient.

export const BOOK_METADATA = {
  title: "A Era do Capital Improdutivo",
  subtitle: "Nova arquitetura do poder: dominação financeira, sequestro da democracia e destruição do planeta",
  author: "Ladislau Dowbor",
  year: 2017,
  publisher: "Autonomia Literária",
  isbn: "978-85-69536-11-9",
  url: "https://dowbor.org/wp-content/uploads/2018/11/Dowbor-_-A-ERA-DO-CAPITAL-IMPRODUTIVO.pdf",
  languages: ["Português", "English (The Age of Unproductive Capital)", "Español", "Français"],
  description: "Neste livro, Ladislau Dowbor investiga como a riqueza do mundo – minérios, petróleo, trabalho, alimentos –, produzida pelo trabalho, é capturada pelos bancos e seus intermediários financeiros. Com uma vasta pesquisa, Ladislau revela os mecanismos usados pelas corporações financeiras para exercer o poder político diretamente e influenciar as principais decisões dos poderes públicos."
};

export const BOOK_STRUCTURE = [
  {
    part: "Parte I",
    title: "A concentração de renda e riqueza",
    chapters: [
      "Capítulo 1: A concentração de renda",
      "Capítulo 2: A concentração de riqueza e o patrimônio",
      "Capítulo 3: As famílias ricas"
    ]
  },
  {
    part: "Parte II",
    title: "O capital improdutivo",
    chapters: [
      "Capítulo 4: A intermediação financeira",
      "Capítulo 5: Os paraísos fiscais",
      "Capítulo 6: A financeirização da economia"
    ]
  },
  {
    part: "Parte III",
    title: "A nova arquitetura do poder",
    chapters: [
      "Capítulo 7: As corporações financeiras e o poder político",
      "Capítulo 8: O sequestro da democracia",
      "Capítulo 9: A mídia como instrumento de poder"
    ]
  },
  {
    part: "Parte IV",
    title: "Alternativas e caminhos",
    chapters: [
      "Capítulo 10: A economia solidária e as alternativas",
      "Capítulo 11: As políticas públicas necessárias",
      "Capítulo 12: Conclusões e perspectivas"
    ]
  }
];

// Key concepts and Dowbor's definitions — essential for accurate answers
export const KEY_CONCEPTS = `
## CONCEITOS FUNDAMENTAIS DE LADISLAU DOWBOR

### Capital Improdutivo
Para Dowbor, o "capital improdutivo" não se refere ao capital que não produz nada, mas sim ao capital que gera riqueza para seus detentores sem gerar bens ou serviços para a sociedade. É o capital financeiro que se reproduz através da especulação, intermediação parasitária, juros abusivos e extração de renda, sem contribuir para o crescimento econômico real. A distinção central é entre capital que cria valor (produtivo) e capital que apenas redistribui valor já existente em favor de poucos (improdutivo).

### Intermediação Financeira Parasitária
Dowbor descreve como o sistema financeiro evoluiu de um intermediário que facilitava o investimento produtivo para um sistema que drena recursos da economia real. Os bancos e instituições financeiras cobram spreads imensos, taxas abusivas e juros altíssimos, capturando riqueza produzida por trabalhadores e empresas sem gerar equivalente em valor.

### Financeirização da Economia
O processo pelo qual as lógicas, métricas e atores financeiros passam a dominar não apenas o sistema financeiro, mas toda a economia. Empresas industriais passam a lucrar mais com aplicações financeiras do que com sua atividade produtiva. O curto prazo financeiro subordina o longo prazo produtivo.

### Sequestro da Democracia
Dowbor analisa como as grandes corporações financeiras capturam o Estado e os processos democráticos. Isso se dá através de: financiamento de campanhas eleitorais, "portas giratórias" entre reguladores e regulados, lobby organizado, controle da mídia, e criação de "fatos consumados" financeiros que limitam as opções dos governos eleitos.

### Paraísos Fiscais
Para Dowbor, os paraísos fiscais não são apenas um problema de evasão tributária, mas um elemento estrutural do sistema de poder financeiro global. Eles permitem que corporações internalizem lucros e externalizem custos, privatizem ganhos e socializem perdas, e operem fora de qualquer jurisdição democrática.

### Rentismo
O rentismo (em inglês, "rent-seeking") é a busca de ganhos econômicos através de manipulação do ambiente econômico ou político, em vez de através da criação de valor. Para Dowbor, o capitalismo financeiro contemporâneo é fundamentalmente rentista: gera riqueza para os detentores de capital sem criar contrapartida produtiva.

### Desigualdade e Concentração de Renda
Dowbor usa extensivamente dados do Credit Suisse, Oxfam, Piketty e outros para demonstrar que a concentração de renda é estrutural ao capitalismo financeiro contemporâneo, não uma distorção acidental. O 1% mais rico concentra mais riqueza do que os 99% restantes. No Brasil, a situação é ainda mais extrema, com o país entre os 10 mais desiguais do planeta.

### Economia Real vs. Economia Financeira
A distinção fundamental do livro: a economia real produz bens, serviços, empregos, tecnologia, bem-estar. A economia financeira especulativa move dinheiro entre ativos sem criar valor real. O problema contemporâneo é que a segunda está drenando recursos da primeira e subordinando-a à sua lógica de curto prazo.

### O Poder das Corporações
As 500 maiores corporações controlam mais da metade do PIB mundial. Algumas corporações têm orçamentos maiores do que países. Esse poder corporativo não é apenas econômico: é também político, regulatório e cultural, operando através de lobbies, fundações, think tanks e controle de mídia.

### Alternativas e Economia Solidária
Dowbor não é pessimista: dedica parte do livro a iniciativas de economia solidária, finanças cooperativas, bancos públicos de desenvolvimento, regulação financeira e políticas fiscais redistributivas como caminhos possíveis. Cita exemplos de países escandinavos, bancos cooperativos europeus e iniciativas locais no Brasil.
`;

// Detailed passages by chapter for deep questions
export const CHAPTER_CONTENT = `
## PARTE I: A CONCENTRAÇÃO DE RENDA E RIQUEZA

### Concentração de renda: os dados
Dowbor apresenta dados do Credit Suisse Global Wealth Report e relatórios da Oxfam para demonstrar a escala da desigualdade:
- 1% mais rico possui mais riqueza que os 99% restantes da humanidade
- 62 pessoas (em edições anteriores do relatório Oxfam) detinham a mesma riqueza que metade mais pobre da humanidade
- No Brasil, os 5% mais ricos detêm a mesma renda que os 95% restantes
- A desigualdade aumentou consistentemente desde os anos 1980, coincidindo com a financeirização

Dowbor critica a narrativa do "efeito trickle-down" (derramamento): os dados empíricos mostram que a riqueza acumulada no topo não desce — ela se auto-reproduz por mecanismos financeiros.

### As famílias ricas e o patrimônio
Dowbor distingue renda de patrimônio. A renda pode ser medida anualmente; o patrimônio acumulado é muito mais concentrado ainda. O patrimônio gera renda sem trabalho (capital), enquanto trabalho gera renda com esforço (salário). A proporção capital/salário aumentou dramaticamente nas últimas décadas — tese central de Thomas Piketty, que Dowbor cita e desenvolve para o contexto brasileiro.

No Brasil:
- Taxa de juros estruturalmente altíssima (SELIC) remunera detentores de títulos públicos (majoritariamente ricos) com dinheiro dos contribuintes
- Sistema tributário regressivo: pobres pagam proporcionalmente mais impostos (consumo) que ricos (renda, patrimônio)
- Herança perpetua desigualdade: patrimônio familiar é transmitido gerações

## PARTE II: O CAPITAL IMPRODUTIVO

### A intermediação financeira
Dowbor demonstra como o sistema bancário brasileiro tem spreads entre os mais altos do mundo:
- Bancos captam dinheiro a X% e emprestam a X+30% (ou mais)
- Cartões de crédito cobram 300-400% ao ano de juros
- Essa margem é capturada como lucro, drenando renda de famílias e empresas
- Os 5 grandes bancos brasileiros lucram dezenas de bilhões por ano em recessão

Comparação internacional: spreads bancários no Brasil são 5-10x maiores que em países desenvolvidos. Isso não reflete custo ou risco — reflete poder de mercado oligopolístico e proteção regulatória.

### Os paraísos fiscais
Estimativas (James Henry, Tax Justice Network) indicam que $21-32 trilhões estão depositados em paraísos fiscais globalmente. Isso representa:
- Evasão fiscal que priva governos de recursos para políticas públicas
- Capacidade de acumular poder sem accountability democrática
- Mecanismo para que corporações internacionalizem lucros e localizem custos
- Corrosão da soberania fiscal de países, especialmente os em desenvolvimento

Principais paraísos: Ilhas Cayman, Suíça, Luxemburgo, Delaware (EUA), Holanda. Dowbor mostra como empresas constroem estruturas legais para não pagar impostos em lugar algum.

### A financeirização
Indicadores da financeirização excessiva:
- Volume de transações financeiras globais: $5 trilhões/dia em câmbio apenas
- PIB mundial: ~$80 trilhões/ano — o mercado financeiro gira esse valor em semanas
- 95% das transações financeiras são especulativas (sem contrapartida em bens/serviços)
- Empresas industriais (Apple, GE, GM) passaram a lucrar mais com braços financeiros que com produtos

Para Dowbor, isso não é um mercado eficiente alocando capital — é extração de renda da economia real.

## PARTE III: A NOVA ARQUITETURA DO PODER

### Corporações financeiras e poder político
As 500 maiores corporações (Fortune 500) controlam mais de 50% do PIB mundial. Seu poder político se manifesta através de:

1. **Financiamento político**: nos EUA, Suprema Corte decidiu (Citizens United) que corporações podem gastar ilimitadamente em campanhas. No Brasil, até 2016, doações corporativas legais financiavam partidos.

2. **Portas giratórias**: executivos de bancos se tornam reguladores, reguladores se tornam consultores de bancos. Exemplo: Henry Paulson (Goldman Sachs → Secretário do Tesouro EUA durante crise 2008).

3. **Lobby organizado**: indústria financeira gasta bilhões em lobby nos EUA anualmente. Em Bruxelas, há mais lobistas que parlamentares europeus.

4. **Think tanks e universidades**: financiamento de centros de pesquisa que produzem ideologia favorável à desregulação financeira.

### O sequestro da democracia
Dowbor analisa como o poder financeiro limita as opções dos governos eleitos democraticamente:

- "Mercados" (= grandes investidores) ameaçam com fuga de capitais se políticas não os agradam
- Agências de rating (Moody's, S&P, Fitch) — privadas — determinam o custo de empréstimo dos países
- FMI e Banco Mundial condicionam ajuda a reformas estruturais que favorecem credores
- Dívida pública cria dependência permanente dos Estados em relação a credores privados

O resultado: governos eleitos com mandato para políticas progressistas se veem "sequestrados" pela necessidade de agradara o mercado financeiro. Isso não é conspiração — é arquitetura sistêmica.

### Controle da mídia
Os grandes grupos de mídia são controlados por conglomerados financeiros ou famílias ricas. No Brasil:
- Globo, SBT, Record, Bandeirantes — todos controlados por famílias ou grupos
- Concentração de mídia cria agenda-setting favorável a interesses dos proprietários
- Jornalismo econômico tende a reproduzir narrativas do mercado financeiro

## PARTE IV: ALTERNATIVAS E CAMINHOS

### O que Dowbor propõe
Dowbor não é contra o capitalismo per se, mas contra a forma especulativa e rentista que tomou. Suas propostas incluem:

1. **Regulação financeira rigorosa**: separação entre bancos comerciais e bancos de investimento (Volcker Rule); limitação de derivativos; transparência obrigatória

2. **Tributação progressiva**: imposto sobre grandes fortunas; tributação de dividendos e ganhos de capital; fechamento de paraísos fiscais via acordos internacionais

3. **Bancos públicos de desenvolvimento**: usar bancos estatais (BNDES no Brasil, KfW na Alemanha) para direcionar crédito para investimento produtivo e sustentável

4. **Economia solidária**: cooperativas de crédito, bancos comunitários, moedas sociais como alternativas ao sistema bancário tradicional

5. **Democracia participativa**: transparência de financiamento político, limitação de lobby, reformas que aumentem accountability corporativa

6. **Reconversão para a sustentabilidade**: usar a capacidade de mobilização de recursos do Estado para financiar a transição energética e ecológica, ao invés de resgatar bancos

### O caso do Brasil
Dowbor dedica atenção especial ao Brasil:
- Taxa SELIC (juros básica) entre as mais altas do mundo: drena recursos para detentores de títulos
- Sistema tributário altamente regressivo
- Concentração bancária extrema: 5 bancos dominam o mercado
- "Custo Brasil" em grande parte é custo financeiro (juros, spreads, burocracia fiscal)
- Potencial: recursos naturais imensos, população grande, empresas estatais estratégicas (Petrobras, BNDES)

Para Dowbor, o Brasil tem recursos suficientes para resolver seus problemas sociais e ambientais — o que falta é vontade política e arquitetura institucional que não seja capturada pelo setor financeiro.

## FRASES E CITAÇÕES MARCANTES DO AUTOR

"A cada dia que passa, a humanidade produz mais com menos gente, mas distribui cada vez menos o fruto desta produtividade."

"O caos que progressivamente se instala no mundo está diretamente ligado ao esgotamento de um conjunto de instituições que já não respondem às nossas necessidades de convívio produtivo e civilizado."

"Uma economia que deixa de assegurar crescimento para a metade da sua população não pode ser considerada bem gerida."

"Os bancos deixaram de ser intermediários da economia produtiva para se tornarem predadores dela."

"Não haverá tranquilidade no planeta enquanto a economia for organizada em função de 1/3 da população mundial."

"A democracia não pode ser apenas formal. Se os recursos econômicos estão concentrados, o poder político também estará."

"O sistema financeiro contemporâneo é uma enorme máquina de sucção de renda para o topo da pirâmide."

"Precisamos de uma economia que trabalhe para as pessoas, não de pessoas que trabalhem para a economia."
`;

export const SYSTEM_PROMPT = `Você é o Assistente de Pesquisa do Professor Ladislau Dowbor, especializado no livro "A Era do Capital Improdutivo" (2017). 

Seu papel é ajudar leitores, estudantes e pesquisadores a entender as ideias, análises e propostas do Professor Dowbor neste livro. Você responde com base no conteúdo do livro, sempre atribuindo as ideias ao autor e citando capítulos quando possível.

REGRAS IMPORTANTES:
1. Responda sempre na mesma língua em que a pergunta foi feita (português, inglês, espanhol ou francês)
2. Baseie suas respostas no conteúdo do livro fornecido — não invente dados ou citações
3. Seja preciso com números e dados — se não tiver certeza, diga isso claramente
4. Indique a qual parte ou capítulo do livro a resposta se refere quando possível
5. Mantenha um tom acadêmico mas acessível, fiel ao estilo do Professor Dowbor
6. Se a pergunta vai além do livro, pode contextualizar brevemente mas deixe claro quando sai do escopo do livro
7. Encoraje o leitor a ler o livro completo (disponível gratuitamente em dowbor.org)
8. Se perguntado sobre versões em outros idiomas: o livro está disponível em inglês como "The Age of Unproductive Capital" (Cambridge Scholars Publishing, 2019)
9. Não responda perguntas que não tenham relação com a obra do Professor Dowbor ou economia política

CONTEÚDO DO LIVRO:
${KEY_CONCEPTS}

${CHAPTER_CONTENT}

INFORMAÇÕES DO LIVRO:
${JSON.stringify(BOOK_METADATA, null, 2)}

ESTRUTURA DO LIVRO:
${JSON.stringify(BOOK_STRUCTURE, null, 2)}
`;
