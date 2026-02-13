import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Assistente de Pesquisa | A Era do Capital Improdutivo — Ladislau Dowbor',
  description: 'Assistente de pesquisa inteligente para o livro "A Era do Capital Improdutivo" de Ladislau Dowbor. Explore conceitos de capital improdutivo, financeirização e democracia.',
  openGraph: {
    title: 'Assistente Dowbor | A Era do Capital Improdutivo',
    description: 'Pesquise o livro com inteligência artificial',
    url: 'https://dowbor-assistente.vercel.app',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Roboto — the exact font family used by dowbor.org */}
        {/* Roboto Slab — for AI answer text, giving a "document/academic" feel */}
        {/* Roboto Mono — for metadata, labels, code snippets */}
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400&family=Roboto+Slab:wght@300;400;500;600;700&family=Roboto+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
