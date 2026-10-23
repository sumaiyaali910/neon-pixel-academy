const https = require('https');

/**
 * Vercel Serverless Function (`api/gemini.js`)
 *
 * Handles `POST /api/gemini` on Vercel.
 * Fetches the API key exclusively from `process.env.GEMINI_API_KEY`.
 * Answers ANY general, conversational, coding, creative, or academic question just like Google Gemini!
 */
module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const prompt = (body.prompt || '').trim();
    const subject = body.subject || 'General (Anything)';
    const mode = body.mode || 'general';
    const history = Array.isArray(body.history) ? body.history : [];

    if (!prompt) {
      return res.status(400).json({ error: 'Please enter a question or message.' });
    }

    const apiKey = (process.env.GEMINI_API_KEY || '').trim();
    const smartFallback = await generateGeneralAIResponse(prompt, subject, mode);

    if (!apiKey) {
      return res.status(200).json({
        reply: smartFallback.reply,
        diagramType: smartFallback.diagramType,
        topicTitle: smartFallback.topicTitle,
        model: 'gemini-general-engine (Add GEMINI_API_KEY in Vercel Settings for live Gemini 2.5 Flash)',
        envConfigured: false,
        subject,
        mode,
      });
    }

    const systemInstruction =
      'You are PIXEL-OWL 9000, a brilliant, versatile, and friendly general-purpose AI assistant ' +
      '(powered by Google Gemini) inside the Neon Pixel Academy lounge. ' +
      'You can answer ANY question on ANY topic — general knowledge, daily life, coding, creative writing, ' +
      'math, science, gaming, history, pop culture, or casual conversation — just like Google Gemini! ' +
      `Context category: ${subject}. Response style mode: ${mode}.`;

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
          generationConfig: { temperature: 0.7, maxOutputTokens: 1500 },
        }),
      }
    );

    const data = await geminiRes.json().catch(() => ({}));
    if (!geminiRes.ok) {
      return res.status(200).json({
        reply:
          smartFallback.reply +
          `\n\n*(Note: Gemini API returned status ${geminiRes.status} — answered via built-in General Knowledge Engine.)*`,
        diagramType: smartFallback.diagramType,
        topicTitle: smartFallback.topicTitle,
        model: 'pixel-owl-general-fallback',
        envConfigured: true,
      });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || smartFallback.reply;

    return res.status(200).json({
      reply,
      diagramType: smartFallback.diagramType,
      topicTitle: smartFallback.topicTitle,
      model: 'gemini-2.5-flash',
      envConfigured: true,
      subject,
      mode,
    });
  } catch (err) {
    console.error('Error in /api/gemini serverless function:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
};

async function tryWikipediaSummary(query) {
  try {
    const cleaned = query
      .replace(/^(what is|what are|who is|who was|tell me about|explain|define|how does|how do|where is|history of)\s+/i, '')
      .replace(/[?!.]+$/g, '')
      .trim();

    if (!cleaned || cleaned.length < 2) return '';

    const searchUrl =
      'https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=' +
      encodeURIComponent(cleaned) +
      '&utf8=&format=json&srlimit=1';

    const searchRes = await fetch(searchUrl, {
      headers: { 'User-Agent': 'NeonPixelAcademy/2.6' },
    });
    const searchData = await searchRes.json();
    const results = searchData?.query?.search || [];
    if (!results.length) return '';

    const title = results[0].title;
    const sumUrl =
      'https://en.wikipedia.org/api/rest_v1/page/summary/' +
      encodeURIComponent(title.replace(/ /g, '_'));
    const sumRes = await fetch(sumUrl, {
      headers: { 'User-Agent': 'NeonPixelAcademy/2.6' },
    });
    const sumData = await sumRes.json();
    if (sumData && sumData.extract) {
      return `### 🌐 ${title}\n\n${sumData.extract}`;
    }
  } catch (e) {
    // ignore
  }
  return '';
}

async function generateGeneralAIResponse(prompt, subject, mode) {
  const pClean = prompt.trim();
  const pLower = pClean.toLowerCase();

  let diagramType = 'general_flow';
  if (/newton|force|physics|velocity|acceleration|gravity|momentum/.test(pLower)) {
    diagramType = 'physics_force';
  } else if (/quadratic|parabola|calculus|derivative|integral|equation|graph|math/.test(pLower)) {
    diagramType = 'math_parabola';
  } else if (/binary|algorithm|code|python|javascript|programming|tree|array|html|css/.test(pLower)) {
    diagramType = 'cs_binary';
  }

  if (['hi', 'hello', 'hey', 'yo', 'sup', 'good morning', 'good evening', 'salam', 'assalam o alaikum'].includes(pLower)) {
    return {
      reply:
        "### 👋 Hey there! I'm **PIXEL-OWL 9000** (Your General & Academic Gemini AI)\n\n" +
        'You can ask me **anything at all** — just like Google Gemini! For example:\n' +
        '- 🌍 **General Knowledge**: *"How do black holes work?"*, *"Who invented the internet?"*\n' +
        '- 💻 **Coding & Tech**: *"Write a Python function for Binary Search"*\n' +
        '- 😂 **Fun & Daily Life**: *"Tell me a joke"*, *"Give me a study routine"*\n' +
        '- 📐 **Academic Problems**: *"Explain Newton\'s Second Law with a 5kg block and 20N force"*',
      diagramType,
      topicTitle: 'General AI Assistant // Ready for Any Question',
    };
  }

  if (pLower.includes('joke') || pLower.includes('funny')) {
    return {
      reply:
        "### 😂 Here's a Retro Tech & Science Joke for You:\n\n" +
        '- **Why do programmers always mix up Halloween and Christmas?**\n' +
        '  Because `Oct 31 == Dec 25`! 🎃🎄\n\n' +
        "- **Bonus Physics Joke**: Why can't you trust an atom?\n" +
        '  Because they *make up everything*! ⚛️',
      diagramType: 'general_flow',
      topicTitle: 'Humor Module // Tech & Science Jokes',
    };
  }

  if (pLower.includes('binary search') || pLower.includes('python') || pLower.includes('write code')) {
    return {
      reply:
        '### 💻 Binary Search Implementation & Explanation\n\n' +
        'Binary search works on a **sorted array** by repeatedly dividing the search interval in half ($O(\\log n)$ time complexity):\n\n' +
        '```python\n' +
        'def binary_search(arr, target):\n' +
        '    low, high = 0, len(arr) - 1\n' +
        '    while low <= high:\n' +
        '        mid = (low + high) // 2\n' +
        '        if arr[mid] == target:\n' +
        '            return mid\n' +
        '        elif arr[mid] < target:\n' +
        '            low = mid + 1\n' +
        '        else:\n' +
        '            high = mid - 1\n' +
        '    return -1\n' +
        '```',
      diagramType: 'cs_binary',
      topicTitle: `Code Synthesizer // ${pClean.slice(0, 42)}`,
    };
  }

  if (pLower.includes('newton') || (pLower.includes('force') && pLower.includes('kg'))) {
    return {
      reply:
        "### ⚡ Newton's Laws of Motion & Force Vector Breakdown\n\n" +
        '1. **First Law (Inertia)**: An object stays at rest or in uniform motion unless acted on by a net external force.\n' +
        '2. **Second Law ($F = m \\times a$)**: For a $5\\text{ kg}$ block with a $20\\text{ N}$ net force, acceleration is $a = 20 / 5 = 4\\text{ m/s}^2$.\n' +
        '3. **Third Law**: Every action has an equal and opposite reaction.',
      diagramType: 'physics_force',
      topicTitle: "Newton's Laws & Force Vectors (F = m × a)",
    };
  }

  const wiki = await tryWikipediaSummary(pClean);
  if (wiki) {
    return {
      reply: wiki,
      diagramType,
      topicTitle: `Knowledge Base // ${pClean.slice(0, 44)}`,
    };
  }

  return {
    reply:
      `### 💡 PIXEL-OWL 9000 // Response to *"${pClean}"*\n\n` +
      `1. **Core Insight**: Breaking down **${pClean}** into clear, practical concepts.\n` +
      `2. **Actionable Steps**: Understand the core mechanism, test with a real-world example, and iterate.\n` +
      `3. **Live Gemini 2.5 Flash**: Add \`GEMINI_API_KEY\` in your Vercel Project Environment Variables for full streaming Gemini responses!`,
    diagramType,
    topicTitle: `General AI Analysis // ${pClean.slice(0, 42)}`,
  };
}
