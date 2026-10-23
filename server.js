/**
 * Express / Node.js Backend Server (`server.js`)
 *
 * Serves the Retro Pixelated Educational Hub and handles `/api/gemini` POST calls.
 * Fetches the API key exclusively from `process.env.GEMINI_API_KEY`.
 * Answers ANY general, conversational, coding, creative, or academic question just like Gemini!
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/api/gemini') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const apiKey = process.env.GEMINI_API_KEY;
        const parsed = JSON.parse(body || '{}');
        const { prompt, subject = 'General (Anything)', mode = 'general', history = [] } = parsed;

        if (!prompt || typeof prompt !== 'string') {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'A valid `prompt` string is required.' }));
        }

        if (!apiKey) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(
            JSON.stringify({
              fallbackMode: true,
              reply: `🦉 **[PIXEL-OWL 9000 // GENERAL AI]**\n\n Set \`GEMINI_API_KEY\` in your environment variables to connect live to Gemini 2.5 Flash for: "${prompt}".`,
            })
          );
        }

        const systemInstruction = `You are PIXEL-OWL 9000, a brilliant, versatile, and friendly general-purpose AI assistant (powered by Google Gemini) inside the Neon Pixel Academy lounge.
You can answer ANY question on ANY topic — general knowledge, daily life, coding, creative writing, advice, math, science, gaming, history, pop culture, or casual conversation — just like Google Gemini!`;

        const contents = [
          ...history.slice(-8).map((m) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: String(m.content || '') }],
          })),
          { role: 'user', parts: [{ text: prompt }] },
        ];

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: systemInstruction }] },
              contents,
            }),
          }
        );

        const data = await geminiRes.json();
        if (!geminiRes.ok) {
          res.writeHead(geminiRes.status, { 'Content-Type': 'application/json' });
          return res.end(
            JSON.stringify({
              error: data?.error?.message || 'Error communicating with Gemini API.',
            })
          );
        }

        const reply =
          data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ reply, model: 'gemini-2.5-flash', subject, mode }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  let safeUrl = req.url.split('?')[0];
  if (safeUrl === '/') safeUrl = '/index.html';
  const filePath = path.join(__dirname, safeUrl);

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('404 Not Found');
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`NEON PIXEL ACADEMY running at http://localhost:${PORT}`);
});
