'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { BOOK_METADATA, BOOK_STRUCTURE } from '@/lib/book-content';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTED_QUESTIONS = {
  pt: [
    'O que é capital improdutivo?',
    'Como funciona a intermediação financeira parasitária?',
    'O que são paraísos fiscais e qual seu impacto?',
    'O que Dowbor entende por "sequestro da democracia"?',
    'Quais alternativas o autor propõe?',
    'Como a desigualdade brasileira se compara ao mundo?',
    'O que é financeirização da economia?',
    'Por que os bancos brasileiros são tão lucrativos?',
  ],
  en: [
    'What is unproductive capital?',
    'How does parasitic financial intermediation work?',
    'What does Dowbor mean by "seizure of democracy"?',
    'What alternatives does the author propose?',
    'How does financialization affect the economy?',
    'What role do tax havens play?',
  ],
  es: [
    '¿Qué es el capital improductivo?',
    '¿Cómo funciona la intermediación financiera parasitaria?',
    '¿Qué propone Dowbor como alternativas?',
    '¿Qué son los paraísos fiscales?',
  ],
  fr: [
    "Qu'est-ce que le capital improductif?",
    "Quelles alternatives Dowbor propose-t-il?",
    "Qu'est-ce que la financiarisation de l'économie?",
  ],
};

function renderContent(text: string): string {
  return text
    .split('\n\n')
    .map(para => {
      const trimmed = para.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
        const items = trimmed.split('\n').filter(l => l.trim());
        const lis = items
          .map(i =>
            `<li>${i.replace(/^[-•]\s*/, '')
              .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.+?)\*/g, '<em>$1</em>')}</li>`
          )
          .join('');
        return `<ul>${lis}</ul>`;
      }
      const line = trimmed
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>');
      return `<p>${line}</p>`;
    })
    .join('');
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeLang, setActiveLang] = useState<'pt' | 'en' | 'es' | 'fr'>('pt');
  const [streamingContent, setStreamingContent] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: content.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);
    setStreamingContent('');

    abortRef.current = new AbortController();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Erro ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No stream');

      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const lines = decoder.decode(value, { stream: true }).split('\n');
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') {
            setMessages(prev => [...prev, { role: 'assistant', content: accumulated }]);
            setStreamingContent('');
            break;
          }
          try {
            const { text } = JSON.parse(data);
            if (text) { accumulated += text; setStreamingContent(accumulated); }
          } catch { /* skip */ }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setStreamingContent('');
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); sendMessage(input); };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  const handleClear = () => {
    if (isLoading) abortRef.current?.abort();
    setMessages([]); setStreamingContent(''); setError(null); setIsLoading(false);
  };

  const placeholders = {
    pt: 'Faça uma pergunta sobre o livro… (Enter para enviar)',
    en: 'Ask a question about the book… (Enter to send)',
    es: 'Haz una pregunta sobre el libro… (Enter)',
    fr: 'Posez une question sur le livre… (Entrée)',
  };

  return (
    <div className="page-wrapper">

      {/* ── HEADER — white bg, red logo, uppercase nav, exactly dowbor.org ── */}
      <header className="site-header">
        <div className="header-inner">
          <a href="https://dowbor.org" className="header-logo" target="_blank" rel="noopener noreferrer">
            <span className="logo-wordmark">dowbor.org</span>
            <span className="logo-divider" />
            <span className="logo-subtitle">Assistente de Pesquisa</span>
          </a>

          <nav className="header-nav">
            <a href="https://dowbor.org/category/por-ladislau/livros" className="nav-link" target="_blank" rel="noopener noreferrer">
              Livros
            </a>
            <a href="https://dowbor.org/artigos" className="nav-link" target="_blank" rel="noopener noreferrer">
              Artigos
            </a>
            <a href="https://dowbor.org/sobre" className="nav-link" target="_blank" rel="noopener noreferrer">
              Sobre
            </a>
            <a
              href="https://dowbor.org/wp-content/uploads/2018/11/Dowbor-_-A-ERA-DO-CAPITAL-IMPRODUTIVO.pdf"
              className="nav-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              PDF do Livro
            </a>
            <span className="beta-tag">Beta</span>
          </nav>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="main-content">

        {/* ── SIDEBAR ── */}
        <aside className="sidebar">

          {/* Book card */}
          <div className="card book-card">
            <div className="book-cover">
              <img
                src="/book-cover.png"
                alt="A Era do Capital Improdutivo — Ladislau Dowbor"
                className="book-cover-img"
              />
            </div>
            <div className="book-info">
              <div className="info-row">
                <span className="info-label">Autor</span>
                <span className="info-value">{BOOK_METADATA.author}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Editora</span>
                <span className="info-value">{BOOK_METADATA.publisher}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Ano</span>
                <span className="info-value">{BOOK_METADATA.year}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Idiomas</span>
                <span className="info-value">PT · EN · ES · FR</span>
              </div>
              <div className="info-row">
                <span className="info-label">Licença</span>
                <span className="info-value">Creative Commons</span>
              </div>
            </div>
            <a
              href="https://dowbor.org/wp-content/uploads/2018/11/Dowbor-_-A-ERA-DO-CAPITAL-IMPRODUTIVO.pdf"
              className="book-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              ↓ Baixar PDF Gratuitamente
            </a>
          </div>

          {/* Suggested questions */}
          <div className="card">
            <div className="card-header">
              <span className="card-header-title">Perguntas Sugeridas</span>
            </div>
            <div className="questions-list">
              {SUGGESTED_QUESTIONS[activeLang].map((q, i) => (
                <button
                  key={i}
                  className="question-btn"
                  onClick={() => { sendMessage(q); inputRef.current?.focus(); }}
                  disabled={isLoading}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Book structure */}
          <div className="card">
            <div className="card-header">
              <span className="card-header-title">Estrutura do Livro</span>
            </div>
            <div className="structure-list">
              {BOOK_STRUCTURE.map((part, i) => (
                <div key={i} className="structure-part">
                  <div className="part-label">{part.part}</div>
                  <div className="part-title">{part.title}</div>
                  {part.chapters.map((ch, j) => (
                    <div key={j} className="chapter-item">{ch}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>

        </aside>

        {/* ── CHAT ── */}
        <section className="chat-area">

          {/* Chat header bar */}
          <div className="chat-header">
            <div>
              <div className="chat-title">Assistente de Pesquisa</div>
              <div className="chat-subtitle">
                Perguntas sobre conceitos, argumentos e propostas do livro
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div className="lang-selector">
                {(['pt', 'en', 'es', 'fr'] as const).map(lang => (
                  <button
                    key={lang}
                    className={`lang-btn${activeLang === lang ? ' active' : ''}`}
                    onClick={() => setActiveLang(lang)}
                    title={lang === 'pt' ? 'Português' : lang === 'en' ? 'English' : lang === 'es' ? 'Español' : 'Français'}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
              {messages.length > 0 && (
                <button className="clear-btn" onClick={handleClear}>
                  Limpar
                </button>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="messages-container">

            {messages.length === 0 && !streamingContent && (
              <div className="welcome-msg animate-fade-in">
                <span className="welcome-icon">📖</span>
                <div className="welcome-title">Como posso ajudar?</div>
                <hr className="welcome-rule" />
                <div className="welcome-desc">
                  Sou um assistente especializado em{' '}
                  <em>A Era do Capital Improdutivo</em> de Ladislau Dowbor.
                  Explico conceitos, analiso argumentos e guio sua leitura.
                  Escolha uma pergunta sugerida ou escreva a sua própria.
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`message message-${msg.role}`}>
                <div className={`message-avatar avatar-${msg.role}`}>
                  {msg.role === 'user' ? 'V' : 'D'}
                </div>
                <div className={`message-bubble bubble-${msg.role}`}>
                  {msg.role === 'assistant' ? (
                    <div dangerouslySetInnerHTML={{ __html: renderContent(msg.content) }} />
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}

            {/* Streaming */}
            {streamingContent && (
              <div className="message message-assistant animate-slide-left">
                <div className="message-avatar avatar-assistant">D</div>
                <div className="message-bubble bubble-assistant">
                  <div dangerouslySetInnerHTML={{ __html: renderContent(streamingContent) }} />
                  <div className="typing-indicator">
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                  </div>
                </div>
              </div>
            )}

            {/* Loading */}
            {isLoading && !streamingContent && (
              <div className="message message-assistant animate-slide-left">
                <div className="message-avatar avatar-assistant">D</div>
                <div className="message-bubble bubble-assistant">
                  <div className="typing-indicator">
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="error-msg">
                ⚠ {error}. Verifique se a API key está configurada no Vercel e tente novamente.
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="input-area">
            <form className="input-form" onSubmit={handleSubmit}>
              <div className="input-wrapper">
                <textarea
                  ref={inputRef}
                  className="message-input"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholders[activeLang]}
                  rows={1}
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                className="send-btn"
                disabled={!input.trim() || isLoading}
              >
                {isLoading ? (
                  <><span className="spinner" /> Aguarde</>
                ) : (
                  <>Enviar →</>
                )}
              </button>
            </form>
            <div className="input-hint">
              <span>↵ Enter para enviar · Shift+Enter nova linha · Respostas baseadas no livro</span>
            </div>
          </div>

        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="site-footer">
        <div className="footer-inner">
          <span className="footer-text">
            Assistente de pesquisa para{' '}
            <em>A Era do Capital Improdutivo</em> · Ladislau Dowbor ·{' '}
            <a href="https://dowbor.org" className="footer-link" target="_blank" rel="noopener noreferrer">
              dowbor.org
            </a>
          </span>
          <div className="footer-links">
            <span className="footer-cc">Creative Commons CC BY-NC-ND 4.0</span>
            <a
              href="https://dowbor.org/wp-content/uploads/2018/11/Dowbor-_-A-ERA-DO-CAPITAL-IMPRODUTIVO.pdf"
              className="footer-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Livro completo (PDF)
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
