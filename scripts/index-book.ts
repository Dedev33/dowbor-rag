/**
 * scripts/index-book.ts
 * Reads a local PDF, splits it into chunks, generates OpenAI embeddings,
 * and inserts records into the Supabase `documents` table.
 *
 * Usage:
 *   npx tsx scripts/index-book.ts ./path/to/book.pdf
 *
 * Required env vars:
 *   OPENAI_API_KEY
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Required Supabase table (run once in SQL editor):
 *   create extension if not exists vector;
 *   create table documents (
 *     id        bigserial primary key,
 *     content   text not null,
 *     embedding vector(1536),
 *     metadata  jsonb
 *   );
 *   create index on documents using ivfflat (embedding vector_cosine_ops)
 *     with (lists = 100);
 */
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';


// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const BOOK_AUTHOR = 'Ladislau Dowbor';
const BOOK_TITLE = 'Resgatar a Funcão Social da Economia';

const EMBEDDING_MODEL = 'text-embedding-3-small'; // 1536 dimensions
const CHARS_PER_CHUNK = 2800; // ≈700 tokens (1 token ≈ 4 chars)
const CHUNK_OVERLAP = 280;    // ≈10% overlap between consecutive chunks
const BATCH_SIZE = 10;        // records per Supabase insert

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PageData {
  page: number;
  text: string;
}

interface DocumentRecord {
  content: string;
  embedding: number[];
  author: string;
  book: string;
  chapter: null;
  page: number;
}

// ---------------------------------------------------------------------------
// PDF helpers
// ---------------------------------------------------------------------------

/** Extract text per page using pdf-parse's pagerender hook. */
async function extractPages(buffer: Buffer): Promise<PageData[]> {
  const pages: PageData[] = [];
  let pageIndex = 0;

  await pdfParse(buffer, {
    pagerender(pageData: any) {
      const index = ++pageIndex;
      return (pageData.getTextContent() as Promise<any>).then((content: any) => {
        const text: string = content.items
          .map((item: any) => item.str as string)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
        pages.push({ page: index, text });
        return text;
      });
    },
  });

  return pages;
}

/** Split a text into overlapping chunks of ≈CHARS_PER_CHUNK characters. */
function splitIntoChunks(text: string): string[] {
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    const chunk = text.slice(i, i + CHARS_PER_CHUNK).trim();
    if (chunk.length > 100) chunks.push(chunk); // skip tiny fragments
    i += CHARS_PER_CHUNK - CHUNK_OVERLAP;
  }
  return chunks;
}

// ---------------------------------------------------------------------------
// OpenAI
// ---------------------------------------------------------------------------

async function getEmbedding(text: string): Promise<number[]> {
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model: EMBEDDING_MODEL, input: text }),
  });

  if (!res.ok) {
    throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
  }

  const json = (await res.json()) as { data: { embedding: number[] }[] };
  return json.data[0].embedding;
}

// ---------------------------------------------------------------------------
// Supabase
// ---------------------------------------------------------------------------

async function insertBatch(records: DocumentRecord[]): Promise<void> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/documents`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(records),
  });

  if (!res.ok) {
    throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  if (!OPENAI_API_KEY) throw new Error('Missing env var: OPENAI_API_KEY');
  if (!SUPABASE_URL) throw new Error('Missing env var: SUPABASE_URL');
  if (!SUPABASE_SERVICE_ROLE_KEY) throw new Error('Missing env var: SUPABASE_SERVICE_ROLE_KEY');

  const pdfPath = process.argv[2];
  if (!pdfPath) {
    console.error('Usage: npx tsx scripts/index-book.ts <path-to-pdf>');
    process.exit(1);
  }

  const fullPath = path.resolve(pdfPath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${fullPath}`);
  }

  console.log(`Parsing PDF: ${fullPath}`);
  const buffer = fs.readFileSync(fullPath);
  const pages = await extractPages(buffer);
  console.log(`Extracted ${pages.length} pages.\n`);
  let chunkCount = 0;
  let totalInserted = 0;
  const batch: DocumentRecord[] = [];

  for (const { page, text } of pages) {
    if (!text) continue;

    for (const chunk of splitIntoChunks(text)) {
      chunkCount++;
      process.stdout.write(
        `\r[chunk ${chunkCount}] page=${page} — generating embedding...`
      );

      let embedding: number[];
      try {
        embedding = await getEmbedding(chunk);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`\nSkipping chunk at page ${page}: ${msg}`);
        continue;
      }

      batch.push({
        content: chunk,
        embedding,
        author: BOOK_AUTHOR,
        book: BOOK_TITLE,
        chapter: null,
        page,
      });

      if (batch.length >= BATCH_SIZE) {
        const toInsert = batch.splice(0, BATCH_SIZE);
        try {
          await insertBatch(toInsert);
          totalInserted += toInsert.length;
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          console.error(`\nBatch insert failed: ${msg}`);
        }
      }
    }
  }

  // Flush remaining records
  if (batch.length > 0) {
    try {
      await insertBatch(batch);
      totalInserted += batch.length;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`\nFinal batch insert failed: ${msg}`);
    }
  }

  console.log(`\n\nDone. ${totalInserted} chunks inserted into Supabase.`);
}

main().catch((err) => {
  console.error('Fatal error:', err instanceof Error ? err.message : err);
  process.exit(1);
});
