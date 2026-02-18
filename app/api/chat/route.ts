import { OpenAI } from 'openai';
import { BOOK_METADATA } from '@/lib/book-content';

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function getQueryEmbedding(text: string): Promise<number[]> {
  const res = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });
  return res.data[0].embedding;
}

async function retrieveChunks(embedding: number[], count = 5): Promise<string[]> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/match_documents`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query_embedding: embedding, match_count: count }),
  });

  if (!res.ok) {
    console.error('Supabase retrieval error:', await res.text());
    return [];
  }

  const rows = (await res.json()) as { content: string; page: number | null }[];
  return rows.map((r) => (r.page ? `[p. ${r.page}] ${r.content}` : r.content));
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Invalid request' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Retrieve relevant chunks based on the latest user message
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
    const query: string = lastUserMessage?.content ?? '';

    let contextBlock = '';
    if (query) {
      try {
        const embedding = await getQueryEmbedding(query);
        const chunks = await retrieveChunks(embedding, 5);
        if (chunks.length > 0) {
          contextBlock =
            '\n\n## TRECHOS RELEVANTES DO LIVRO:\n' +
            chunks.map((c, i) => `### Trecho ${i + 1}\n${c}`).join('\n\n');
        }
      } catch (err) {
        console.error('RAG retrieval failed, continuing without context:', err);
      }
    }

    const systemPrompt =
      `Você é o Assistente de Pesquisa do Professor Ladislau Dowbor, especializado no livro` +
      ` "${BOOK_METADATA.title}" (${BOOK_METADATA.year}).\n\n` +
      `Seu papel é ajudar leitores, estudantes e pesquisadores a entender as ideias, análises e propostas do Professor Dowbor neste livro.\n\n` +
      `REGRAS:\n` +
      `1. Responda sempre na mesma língua da pergunta\n` +
      `2. Baseie suas respostas nos trechos do livro fornecidos abaixo\n` +
      `3. Seja preciso com dados e números — se não tiver certeza, diga isso claramente\n` +
      `4. Indique a página quando disponível (ex: "p. 87")\n` +
      `5. Se a pergunta estiver fora do escopo do livro, diga isso claramente\n` +
      `6. Encoraje o leitor a acessar o livro completo em dowbor.org` +
      contextBlock;

    // Keep conversation history but limit to last 10 messages to control token usage
    const recentMessages = messages.slice(-10);

    const stream = await openai.chat.completions.create({
      model: 'gpt-4o',
      stream: true,
      max_tokens: 1000,
      temperature: 0.3,
      messages: [
        { role: 'system', content: systemPrompt },
        ...recentMessages,
      ],
    });

    // Stream the response back to the client
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || '';
            if (text) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: unknown) {
    console.error('Chat API error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
