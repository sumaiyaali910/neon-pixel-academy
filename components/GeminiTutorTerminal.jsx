import React, { useState } from 'react';

/**
 * Clean, Reusable Next.js / React Component (`components/GeminiTutorTerminal.jsx`)
 *
 * Connects exclusively to the secure `/api/gemini` backend route.
 * Supports ANY general question (just like Google Gemini) as well as study/academic prompts!
 * Contains ZERO hardcoded or placeholder API keys on the client side.
 */
export default function GeminiTutorTerminal({ defaultSubject = 'General (Anything)' }) {
  const [prompt, setPrompt] = useState('');
  const [subject, setSubject] = useState(defaultSubject);
  const [mode, setMode] = useState('general');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!prompt.trim()) return;

    const currentPrompt = prompt.trim();
    setPrompt('');
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: currentPrompt, subject, mode, history }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch response from /api/gemini');
      }

      setHistory((prev) => [
        ...prev,
        { role: 'user', content: currentPrompt },
        { role: 'assistant', content: data.reply, model: data.model },
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pixel-card gemini-terminal">
      <div className="terminal-header">
        <span className="status-dot cyan-pulse" />
        <h3>🦉 PIXEL-OWL 9000 // GENERAL & ACADEMIC GEMINI AI</h3>
      </div>

      <form onSubmit={handleSubmit} className="terminal-form">
        <div className="terminal-controls">
          <select value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option value="General (Anything)">🌐 General (Ask Anything!)</option>
            <option value="Physics">⚡ Physics</option>
            <option value="Mathematics">📐 Mathematics</option>
            <option value="Computer Science">💻 Computer Science</option>
            <option value="Chemistry">🧪 Chemistry</option>
            <option value="Biology">🧬 Biology</option>
            <option value="History">🏛️ History</option>
          </select>

          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="general">💬 General Gemini Chat (Anything)</option>
            <option value="solve">🔍 Step-by-Step Solution</option>
            <option value="notes">📓 Generate Study Notes</option>
            <option value="flashcards">🃏 Make 3 Flashcards</option>
          </select>
        </div>

        <div className="terminal-input-row">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask me anything at all — general knowledge, coding, trivia, advice, or homework..."
          />
          <button type="submit" disabled={loading} className="pixel-btn cyan-btn">
            {loading ? 'THINKING...' : 'ASK GEMINI ⚡'}
          </button>
        </div>
      </form>

      {error && <div className="terminal-error">⚠️ {error}</div>}

      <div className="terminal-output">
        {history.map((msg, idx) => (
          <div key={idx} className={`chat-turn ${msg.role}`}>
            <strong>{msg.role === 'user' ? '🧑 You:' : '🦉 Gemini AI:'}</strong>
            <div>{msg.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
