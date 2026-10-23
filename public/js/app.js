/**
 * NEON PIXEL ACADEMY // MAIN APPLICATION CONTROLLER (`js/app.js`)
 * Connects to `/api/gemini` backend route (zero frontend API keys).
 * Drives visual solution holograms, teacher 1-click SOS & appointments,
 * notes/PDF/website library, 3D flashcards, arcade quiz, and indoor/outdoor game seat reservation.
 */

const SUBJECT_DATA = {
  All: { label: '🌌 All Subjects' },
  Physics: { label: '⚡ Physics' },
  Mathematics: { label: '📐 Mathematics' },
  'Computer Science': { label: '💻 Computer Science' },
  Chemistry: { label: '🧪 Chemistry' },
  Biology: { label: '🧬 Biology' },
  History: { label: '🏛️ History' },
};

const TEACHERS = [
  {
    id: 't1',
    name: 'Prof. Aria Vance',
    subject: 'Physics',
    specialty: 'Quantum Mechanics, Force Vectors & Electromagnetism',
    avatar: '👩‍🚀',
    status: 'Online • Instant SOS Ready',
    room: 'Lab 404 / Hologram Pod A',
    nextSlot: 'Today, 12:30 PM',
  },
  {
    id: 't2',
    name: 'Dr. Kenji Takahashi',
    subject: 'Computer Science',
    specialty: 'Algorithms, Data Structures & AI Neural Nets',
    avatar: '🧙‍♂️',
    status: 'Online • Debugging Live',
    room: 'Cyber Deck 202',
    nextSlot: 'Today, 01:15 PM',
  },
  {
    id: 't3',
    name: 'Prof. Elena Rostova',
    subject: 'Mathematics',
    specialty: 'Calculus, Linear Algebra & Differential Equations',
    avatar: '📐',
    status: 'Online • Instant SOS Ready',
    room: 'Euler Suite 108',
    nextSlot: 'Today, 02:00 PM',
  },
  {
    id: 't4',
    name: 'Dr. Marcus Sterling',
    subject: 'Chemistry',
    specialty: 'Organic Synthesis, Thermodynamics & Molecular Bonding',
    avatar: '🧪',
    status: 'In Lab • SOS Priority Open',
    room: 'Alchemy Wing B',
    nextSlot: 'Today, 03:00 PM',
  },
  {
    id: 't5',
    name: 'Prof. Maya Lin',
    subject: 'Biology',
    specialty: 'Cellular ATP Cycles, Genetics & Neurobiology',
    avatar: '🧬',
    status: 'Online • Instant SOS Ready',
    room: 'Bio-Dome 3',
    nextSlot: 'Today, 03:45 PM',
  },
  {
    id: 't6',
    name: 'Dr. Julian Vance',
    subject: 'History',
    specialty: 'World Civilizations, Scientific Revolution & Archives',
    avatar: '🏛️',
    status: 'Online • Instant SOS Ready',
    room: 'Chronicle Hall 12',
    nextSlot: 'Tomorrow, 10:00 AM',
  },
];

const LIBRARY_RESOURCES = [
  // Notes
  {
    id: 'r1',
    type: 'notes',
    subject: 'Physics',
    title: 'Newtonian Mechanics & Free-Body Diagrams Cheat Sheet',
    summary: 'Complete vector decomposition formulas, friction laws, and tension shortcuts with pixel diagrams.',
    content: `<h3>⚡ Newtonian Mechanics & Free-Body Diagrams</h3>
      <p><strong>1. First Law (Inertia):</strong> If $\\sum \\vec{F} = 0$, velocity $\\vec{v}$ remains constant.</p>
      <p><strong>2. Second Law:</strong> $\\vec{F}_{\\text{net}} = m \\cdot \\vec{a}$. Always split forces into perpendicular $x$ and $y$ axes!</p>
      <p><strong>3. Inclined Plane Shortcut:</strong></p>
      <ul>
        <li>Parallel to ramp: $F_{\\parallel} = mg \\sin(\\theta)$</li>
        <li>Perpendicular to ramp: $F_{\\perp} = mg \\cos(\\theta)$</li>
        <li>Kinetic Friction: $f_k = \\mu_k N$</li>
      </ul>`,
  },
  {
    id: 'r2',
    type: 'notes',
    subject: 'Computer Science',
    title: 'Big-O Complexity & Binary Search Master Notes',
    summary: 'Visual comparison of O(1), O(log n), O(n), and O(n²) with Python/JS templates.',
    content: `<h3>💻 Big-O & Binary Search Blueprint</h3>
      <p><strong>Why Binary Search?</strong> Cuts the search space in half every step: $O(\\log_2 n)$ time complexity.</p>
      <pre style="background:#050a18;padding:10px;border:1px solid #00f5d4;color:#00f5d4;margin-top:8px;">
function binarySearch(arr, target) {
  let low = 0, high = arr.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}</pre>`,
  },
  {
    id: 'r3',
    type: 'notes',
    subject: 'Mathematics',
    title: 'Calculus Derivatives, Integrals & Quadratic Vertex Guide',
    summary: 'Power rule, chain rule, product rule, and parabolic vertex coordinates explained visually.',
    content: `<h3>📐 Calculus & Quadratic Essentials</h3>
      <ul>
        <li><strong>Quadratic Formula:</strong> $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$</li>
        <li><strong>Vertex Coordinate:</strong> $x_v = -\\frac{b}{2a}$</li>
        <li><strong>Power Rule:</strong> $\\frac{d}{dx}[x^n] = n x^{n-1}$</li>
        <li><strong>Chain Rule:</strong> $\\frac{d}{dx}[f(g(x))] = f'(g(x)) \\cdot g'(x)$</li>
      </ul>`,
  },
  // PDFs / Books
  {
    id: 'r4',
    type: 'pdf',
    subject: 'Physics',
    title: '📘 [PDF] Retro Illustrated Guide to Quantum & Classical Physics (2026 Ed.)',
    summary: '48-page interactive textbook covering kinematics, circuits, waves, and relativity.',
    content: `<h3>📘 PDF READER // Retro Illustrated Physics Handbook</h3>
      <p><em>Page 1 of 48 — Chapter 1: Kinematics & Force Fields</em></p>
      <hr style="border-color:#233975;margin:10px 0;"/>
      <p>Every physical problem in the universe can be modeled as a state transition! Measure initial position $x_0$, velocity $v_0$, and net force $F$ to predict future trajectories:</p>
      <p style="color:#00f5d4;font-family:monospace;margin:10px 0;">x(t) = x₀ + v₀·t + ½·a·t²</p>
      <p>✅ <strong>Interactive Tip:</strong> Send any chapter question to PIXEL-OWL 9000 above for a live custom breakdown.</p>`,
  },
  {
    id: 'r5',
    type: 'pdf',
    subject: 'Biology',
    title: '📗 [PDF] Cellular Energy, ATP Synthase & Photosynthesis Atlas',
    summary: 'Full-color schematic PDF book showing chloroplasts, mitochondria, and metabolic pathways.',
    content: `<h3>📗 PDF READER // Cellular Energy & Photosynthesis Atlas</h3>
      <p><em>Chapter 3: Light-Dependent Reactions & The Calvin Cycle</em></p>
      <hr style="border-color:#233975;margin:10px 0;"/>
      <p>Chloroplasts act like solar-powered pixel batteries! Photons strike Photosystem II, splitting water ($2\\text{H}_2\\text{O} \\rightarrow 4\\text{H}^+ + 4e^- + \\text{O}_2$) and pumping protons to spin the ATP Synthase rotor.</p>`,
  },
  {
    id: 'r6',
    type: 'pdf',
    subject: 'Chemistry',
    title: '📙 [PDF] Periodic Table & Molecular Orbital Pixel Compendium',
    summary: 'Electronegativity trends, covalent vs. ionic bonding, and stoichiometry solved examples.',
    content: `<h3>📙 PDF READER // Periodic Table & Bonding Compendium</h3>
      <p><strong> Stoichiometry Golden Rule:</strong> Convert grams $\\rightarrow$ moles using Molar Mass ($M$), use balanced equation mole ratios, then convert back to target units!</p>`,
  },
  // Curated Websites
  {
    id: 'r7',
    type: 'website',
    subject: 'Mathematics',
    title: '🌐 Desmos & 3Blue1Brown Interactive Math Visualizer Portal',
    summary: 'Curated interactive graphing calculator and visual linear algebra/calculus simulations.',
    url: 'https://www.desmos.com/calculator',
  },
  {
    id: 'r8',
    type: 'website',
    subject: 'Physics',
    title: '🌐 PhET Interactive Physics & Chemistry Simulations',
    summary: 'University of Colorado Boulder interactive circuit builders, pendulum labs, and wave simulators.',
    url: 'https://phet.colorado.edu',
  },
  {
    id: 'r9',
    type: 'website',
    subject: 'Computer Science',
    title: '🌐 VisuAlgo — Data Structures & Algorithms Step-by-Step Animator',
    summary: 'Watch sorting, graph traversal, and dynamic programming execute frame by frame.',
    url: 'https://visualgo.net',
  },
];

const FLASHCARDS = [
  {
    subject: 'Physics',
    q: 'What does Newton’s Second Law state mathematically, and what happens if mass doubles while net force stays constant?',
    a: 'F_net = m × a. If mass (m) doubles for the same net force, acceleration (a) is halved!',
  },
  {
    subject: 'Computer Science',
    q: 'What is the time complexity of Binary Search on a sorted array of N elements?',
    a: 'O(log₂ N) — because each comparison eliminates half of the remaining elements.',
  },
  {
    subject: 'Mathematics',
    q: 'How do you find the x-coordinate of the vertex of a parabola y = ax² + bx + c?',
    a: 'x_vertex = -b / (2a). Substitute x_vertex back into the equation to find y_vertex!',
  },
  {
    subject: 'Biology',
    q: 'Which organelle is the primary site of ATP synthesis via oxidative phosphorylation?',
    a: 'The Mitochondrion (specifically across the inner mitochondrial membrane via ATP Synthase).',
  },
  {
    subject: 'Chemistry',
    q: 'What is the difference between an endothermic and exothermic reaction in terms of enthalpy (ΔH)?',
    a: 'Exothermic reactions release heat (ΔH < 0), while endothermic reactions absorb heat from surroundings (ΔH > 0).',
  },
  {
    subject: 'History',
    q: 'Which 15th-century invention by Johannes Gutenberg revolutionized the spread of scientific and educational knowledge?',
    a: 'The movable-type printing press (c. 1440), dramatically lowering the cost of books and notes.',
  },
];

const ARCADE_QUESTIONS = [
  {
    subject: 'Physics',
    question: '⚡ [BOSS WAVE 1] A 4 kg hover-drone experiences a net cyan thruster force of 24 N. What is its acceleration?',
    options: ['6 m/s²', '96 m/s²', '4 m/s²', '0.16 m/s²'],
    correct: 0,
  },
  {
    subject: 'Computer Science',
    question: '💻 [BOSS WAVE 2] Maximum comparisons needed by Binary Search on 1,024 sorted items?',
    options: ['512 steps', '10 steps', '100 steps', '32 steps'],
    correct: 1,
  },
  {
    subject: 'Mathematics',
    question: '📐 [BOSS WAVE 3] What is the derivative d/dx of f(x) = 3x⁴ - 5x² + 9?',
    options: ['12x³ - 10x', '3x³ - 5x', '12x⁴ - 10x', '4x³ - 2x'],
    correct: 0,
  },
  {
    subject: 'Chemistry',
    question: '🧪 [BOSS WAVE 4] A neutral solution at 25°C has what pH value?',
    options: ['pH 0', 'pH 14', 'pH 7', 'pH 5.5'],
    correct: 2,
  },
  {
    subject: 'Biology',
    question: '🧬 [BOSS WAVE 5] During photosynthesis, what gas is released when water molecules are split?',
    options: ['Carbon Dioxide (CO₂)', 'Oxygen (O₂)', 'Nitrogen (N₂)', 'Methane (CH₄)'],
    correct: 1,
  },
];

const GAME_ZONES = [
  {
    id: 'indoor-table-tennis',
    type: 'INDOOR',
    name: '🏓 Neon Table Tennis Pod',
    nextFreeIn: '12 mins (Before Class Ends)',
    slots: [
      { id: 'TT-A1', label: 'Table 1 • Seat A', occupied: true },
      { id: 'TT-A2', label: 'Table 1 • Seat B', occupied: true },
      { id: 'TT-B1', label: 'Table 2 • Seat A', occupied: false },
      { id: 'TT-B2', label: 'Table 2 • Seat B', occupied: false },
      { id: 'TT-C1', label: 'Table 3 • Seat A', occupied: true },
      { id: 'TT-C2', label: 'Table 3 • Seat B', occupied: false },
      { id: 'TT-D1', label: 'VIP Glow Table A', occupied: false },
      { id: 'TT-D2', label: 'VIP Glow Table B', occupied: false },
    ],
  },
  {
    id: 'indoor-ps5-vr',
    type: 'INDOOR',
    name: '🎮 Retro Arcade & VR Lounge',
    nextFreeIn: '08 mins (Pre-Book Open!)',
    slots: [
      { id: 'VR-01', label: 'VR Pod #1', occupied: true },
      { id: 'VR-02', label: 'VR Pod #2', occupied: true },
      { id: 'VR-03', label: 'Co-Op Couch #1', occupied: false },
      { id: 'VR-04', label: 'Co-Op Couch #2', occupied: false },
      { id: 'VR-05', label: 'Arcade Cab #1', occupied: true },
      { id: 'VR-06', label: 'Arcade Cab #2', occupied: false },
      { id: 'VR-07', label: 'Chess Hologram A', occupied: false },
      { id: 'VR-08', label: 'Chess Hologram B', occupied: false },
    ],
  },
  {
    id: 'outdoor-futsal',
    type: 'OUTDOOR',
    name: '⚽ Cyan Turf 5v5 Futsal Court',
    nextFreeIn: '18 mins (Next Break Slot)',
    slots: [
      { id: 'FT-01', label: 'Striker Slot #1', occupied: true },
      { id: 'FT-02', label: 'Midfield Slot #2', occupied: true },
      { id: 'FT-03', label: 'Midfield Slot #3', occupied: false },
      { id: 'FT-04', label: 'Defender Slot #4', occupied: false },
      { id: 'FT-05', label: 'Goalie Slot #5', occupied: false },
      { id: 'FT-06', label: 'Team B Slot #6', occupied: true },
      { id: 'FT-07', label: 'Team B Slot #7', occupied: false },
      { id: 'FT-08', label: 'Team B Slot #8', occupied: false },
    ],
  },
  {
    id: 'outdoor-basketball',
    type: 'OUTDOOR',
    name: '🏀 Sunset Neon 3v3 Basketball & Badminton',
    nextFreeIn: '05 mins (Almost Free!)',
    slots: [
      { id: 'BB-01', label: 'Hoop North #1', occupied: true },
      { id: 'BB-02', label: 'Hoop North #2', occupied: false },
      { id: 'BB-03', label: 'Hoop North #3', occupied: false },
      { id: 'BB-04', label: 'Badminton Court A', occupied: true },
      { id: 'BB-05', label: 'Badminton Court B', occupied: false },
      { id: 'BB-06', label: 'Badminton Court C', occupied: false },
      { id: 'BB-07', label: 'Spectator Lounge 1', occupied: false },
      { id: 'BB-08', label: 'Spectator Lounge 2', occupied: false },
    ],
  },
];

const CAMPUS_EVENTS = [
  {
    id: 'ev1',
    category: 'Hackathon',
    title: '⚡ 24-Hour Retro AI & Robotics Game Jam',
    time: 'Friday • 04:00 PM',
    reward: '+250 XP & Neon Badge',
    participants: 42,
    joined: false,
  },
  {
    id: 'ev2',
    category: 'Study Quest',
    title: '🔭 Midnight Rooftop Astrophysics & Telescope Session',
    time: 'Saturday • 08:30 PM',
    reward: '+150 XP & Star Notes',
    participants: 29,
    joined: false,
  },
  {
    id: 'ev3',
    category: 'Tournament',
    title: '🏓 Inter-Department Table Tennis & Chess Blitz Cup',
    time: 'Tomorrow • 01:30 PM',
    reward: '+200 XP & Trophy',
    participants: 64,
    joined: false,
  },
  {
    id: 'ev4',
    category: 'Peer Group',
    title: '📐 Calculus & Algorithms Chill Lo-Fi Cram Circle',
    time: 'Today • 05:00 PM',
    reward: '+120 XP & PDF Pack',
    participants: 19,
    joined: false,
  },
];

// Application State
let appState = {
  activeSubject: 'All',
  xp: 1250,
  libraryFilter: 'all',
  flashcardIndex: 0,
  arcadeIndex: 0,
  arcadeScore: 0,
  selectedZoneId: 'indoor-table-tennis',
  selectedSeatId: null,
  reservedSeats: ['TT-D1'],
  appointments: [],
  chatHistory: [],
};

/* ==========================================================================
   INITIALIZATION & GLOBAL NEON CLICK BURST
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initGlobalNeonClickEffect();
  renderSubjectTabs();
  renderTeachers();
  renderLibrary();
  renderFlashcard();
  renderArcadeQuestion();
  renderGameZones();
  renderSelectedZoneSeats();
  renderCampusEvents();
  renderVisualSolutionHologram('physics_force', "Newton's Second Law & Force Vector Solution");
  startClassCountdownTimer();
});

function initGlobalNeonClickEffect() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('button, .subject-tab, .preset-chip, .seat-slot, .zone-item, a');
    if (btn) {
      window.soundEngine.playClick();
      btn.classList.add('neon-active-burst');
      setTimeout(() => btn.classList.remove('neon-active-burst'), 220);
      spawnNeonSparks(e.clientX, e.clientY);
    }
  });
}

function spawnNeonSparks(x, y) {
  const colors = ['#00f5d4', '#38f9ff', '#ff2a85', '#ffd166'];
  for (let i = 0; i < 8; i++) {
    const spark = document.createElement('div');
    spark.className = 'neon-spark';
    const color = colors[i % colors.length];
    spark.style.background = color;
    spark.style.boxShadow = `0 0 8px ${color}`;
    spark.style.left = `${x}px`;
    spark.style.top = `${y}px`;
    document.body.appendChild(spark);

    const angle = (Math.PI * 2 * i) / 8;
    const dist = 24 + Math.random() * 24;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;

    spark.animate(
      [
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 },
      ],
      { duration: 420, easing: ' cubic-bezier(0.16, 1, 0.3, 1)' }
    ).onfinish = () => spark.remove();
  }
}

function addXP(amount, reason) {
  appState.xp += amount;
  const xpEl = document.getElementById('hud-xp-value');
  if (xpEl) xpEl.textContent = `${appState.xp} XP`;
  showToast(`⚡ +${amount} XP // ${reason}`);
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'neon-toast';
  toast.innerHTML = `<span>🕹️</span> <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 250);
  }, 3600);
}

/* ==========================================================================
   SUBJECT CATEGORY FILTERING
   ========================================================================== */
function renderSubjectTabs() {
  const container = document.getElementById('subject-tabs-container');
  if (!container) return;
  container.innerHTML = Object.keys(SUBJECT_DATA)
    .map(
      (key) => `
      <button class="subject-tab ${appState.activeSubject === key ? 'active' : ''}"
              onclick="selectSubject('${key}')">
        ${SUBJECT_DATA[key].label}
      </button>
    `
    )
    .join('');
}

window.selectSubject = function (subject) {
  appState.activeSubject = subject;
  const aiSubSelect = document.getElementById('ai-subject-select');
  if (aiSubSelect && subject !== 'All') {
    aiSubSelect.value = subject;
  }
  renderSubjectTabs();
  renderTeachers();
  renderLibrary();
  appState.flashcardIndex = 0;
  renderFlashcard();
  showToast(`Category Filter Set: ${SUBJECT_DATA[subject].label}`);
};

/* ==========================================================================
   SECTION 1: GEMINI AI TUTOR TERMINAL & VISUAL SOLUTION HOLOGRAM
   ========================================================================== */
window.fillPresetPrompt = function (promptText, subject = 'General (Anything)', mode = 'general') {
  const input = document.getElementById('ai-prompt-input');
  const subSelect = document.getElementById('ai-subject-select');
  const modeSelect = document.getElementById('ai-mode-select');
  if (input) input.value = promptText;
  if (subSelect && subject) subSelect.value = subject;
  if (modeSelect && mode) modeSelect.value = mode;
  submitGeminiPrompt();
};

window.clearChatHistory = function () {
  appState.chatHistory = [];
  const outputScreen = document.getElementById('ai-response-screen');
  if (outputScreen) {
    outputScreen.innerHTML = `
      <div class="chat-bubble ai-bubble">
        <h3>🦉 PIXEL-OWL 9000 // GENERAL & ACADEMIC GEMINI AI</h3>
        <p>Chat cleared! Ask me <strong>anything at all</strong> — general questions, trivia, coding, creative ideas, daily advice, or homework!</p>
      </div>
    `;
  }
  showToast('🗑️ Conversation history cleared');
};

window.submitGeminiPrompt = async function (e) {
  if (e) e.preventDefault();
  const input = document.getElementById('ai-prompt-input');
  const subSelect = document.getElementById('ai-subject-select');
  const modeSelect = document.getElementById('ai-mode-select');
  const outputScreen = document.getElementById('ai-response-screen');
  const metaModel = document.getElementById('ai-meta-model');
  const submitBtn = document.getElementById('ai-submit-btn');

  const prompt = input ? input.value.trim() : '';
  const subject = subSelect ? subSelect.value : 'General (Anything)';
  const mode = modeSelect ? modeSelect.value : 'general';

  if (!prompt) {
    window.soundEngine.playError();
    showToast('⚠️ Type any question or message first!');
    return;
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'THINKING...';
  }

  // Append User Message Bubble + Thinking indicator
  const userHtml = `
    <div style="background:rgba(0, 245, 212, 0.12);border-left:4px solid var(--cyan-primary);padding:0.65rem 0.9rem;margin-bottom:0.75rem;">
      <div style="font-family:var(--font-pixel);font-size:0.58rem;color:var(--cyan-primary);margin-bottom:0.25rem;">🧑 YOU ASKED:</div>
      <div style="color:#fff;font-weight:600;">${prompt.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
    </div>
  `;
  const loadingId = 'loading-' + Date.now();
  const loadingHtml = `
    <div id="${loadingId}" style="color:var(--cyan-primary);font-family:var(--font-terminal);font-size:1.2rem;margin-bottom:0.75rem;">
      ⏳ PIXEL-OWL 9000 is thinking via <code>POST /api/gemini</code>...
    </div>
  `;

  if (outputScreen) {
    if (appState.chatHistory.length === 0) {
      outputScreen.innerHTML = userHtml + loadingHtml;
    } else {
      outputScreen.insertAdjacentHTML('beforeend', userHtml + loadingHtml);
    }
    outputScreen.scrollTop = outputScreen.scrollHeight;
  }

  if (input) input.value = '';

  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        subject,
        mode,
        history: appState.chatHistory,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Error communicating with /api/gemini');
    }

    window.soundEngine.playSuccess();
    appState.chatHistory.push({ role: 'user', content: prompt });
    appState.chatHistory.push({ role: 'assistant', content: data.reply || '' });

    const loaderEl = document.getElementById(loadingId);
    if (loaderEl) loaderEl.remove();

    const aiReplyHtml = `
      <div style="background:rgba(16, 27, 59, 0.85);border:1px solid var(--navy-border);border-left:4px solid var(--neon-gold);padding:0.85rem 1rem;margin-bottom:1rem;">
        ${formatMarkdownToHTML(data.reply || 'No response received.')}
      </div>
    `;

    if (outputScreen) {
      outputScreen.insertAdjacentHTML('beforeend', aiReplyHtml);
      outputScreen.scrollTop = outputScreen.scrollHeight;
    }
    if (metaModel) {
      metaModel.textContent = `MODEL: ${data.model || 'gemini-2.5-flash'} | TOPIC: ${subject.toUpperCase()}`;
    }

    // Update Visual Solution Diagram Hologram
    renderVisualSolutionHologram(
      data.diagramType || inferDiagramType(prompt, subject),
      data.topicTitle || `AI Synthesis: ${prompt.slice(0, 42)}`
    );

    addXP(35, 'Asked Gemini AI');
  } catch (err) {
    window.soundEngine.playError();
    const loaderEl = document.getElementById(loadingId);
    if (loaderEl) {
      loaderEl.innerHTML = `<span style="color:var(--neon-magenta);">⚠️ ${err.message}</span>`;
    }
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'ASK GEMINI ⚡';
    }
  }
};

function inferDiagramType(prompt, subject) {
  const s = (prompt + ' ' + subject).toLowerCase();
  if (s.includes('physics') || s.includes('force') || s.includes('newton')) return 'physics_force';
  if (s.includes('math') || s.includes('quadratic') || s.includes('calculus')) return 'math_parabola';
  if (s.includes('computer') || s.includes('binary') || s.includes('algorithm') || s.includes('python') || s.includes('code')) return 'cs_binary';
  return 'general_flow';
}

function formatMarkdownToHTML(md) {
  return md
    .replace(/```([a-zA-Z]*)\n([\s\S]*?)```/g, '<pre style="background:#050a18;padding:10px;border:1px solid var(--cyan-primary);color:var(--cyan-primary);overflow-x:auto;margin:8px 0;font-family:monospace;"><code>$2</code></pre>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--cyan-primary);">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em style="color:var(--neon-gold);">$1</em>')
    .replace(/`([^`]+)`/g, '<code style="background:#050a18;padding:2px 6px;border:1px solid var(--cyan-primary);color:var(--cyan-primary);">$1</code>')
    .replace(/\n/g, '<br/>');
}

window.renderVisualSolutionHologram = function (diagramType, title) {
  const container = document.getElementById('hologram-svg-container');
  const titleEl = document.getElementById('hologram-title');
  if (titleEl && title) titleEl.textContent = title;
  if (!container) return;

  if (diagramType === 'physics_force') {
    container.innerHTML = `
      <svg viewBox="0 0 420 220" width="100%" height="220">
        <rect width="420" height="220" fill="#050a18" stroke="#233975" stroke-width="2"/>
        <!-- Grid lines -->
        <line x1="0" y1="165" x2="420" y2="165" stroke="#00f5d4" stroke-width="2" stroke-dasharray="6,4"/>
        <!-- Mass Block -->
        <rect x="155" y="105" width="90" height="60" fill="#101b3b" stroke="#00f5d4" stroke-width="3"/>
        <text x="200" y="138" fill="#00f5d4" font-family="monospace" font-size="14" text-anchor="middle" font-weight="bold">m = 5 kg</text>
        <!-- Thrust Vector F -->
        <line x1="245" y1="135" x2="365" y2="135" stroke="#00f5d4" stroke-width="4"/>
        <polygon points="365,127 382,135 365,143" fill="#00f5d4"/>
        <text x="315" y="122" fill="#00f5d4" font-family="monospace" font-size="13">F_net = 20 N</text>
        <!-- Friction Vector -->
        <line x1="155" y1="150" x2="85" y2="150" stroke="#ff2a85" stroke-width="3"/>
        <polygon points="85,144 70,150 85,156" fill="#ff2a85"/>
        <text x="110" y="140" fill="#ff2a85" font-family="monospace" font-size="12">f_k</text>
        <!-- Normal & Gravity -->
        <line x1="200" y1="105" x2="200" y2="45" stroke="#ffd166" stroke-width="3"/>
        <polygon points="194,45 200,32 206,45" fill="#ffd166"/>
        <text x="235" y="52" fill="#ffd166" font-family="monospace" font-size="12">N = mg</text>
        <!-- Solution Result Pill -->
        <rect x="18" y="16" width="155" height="34" fill="#101b3b" stroke="#06d6a0" stroke-width="2"/>
        <text x="95" y="38" fill="#06d6a0" font-family="monospace" font-size="13" text-anchor="middle">a = F/m = 4 m/s²</text>
      </svg>
    `;
  } else if (diagramType === 'math_parabola') {
    container.innerHTML = `
      <svg viewBox="0 0 420 220" width="100%" height="220">
        <rect width="420" height="220" fill="#050a18" stroke="#233975" stroke-width="2"/>
        <!-- Axes -->
        <line x1="40" y1="150" x2="390" y2="150" stroke="#93b0d8" stroke-width="2"/>
        <line x1="210" y1="20" x2="210" y2="205" stroke="#93b0d8" stroke-width="2"/>
        <!-- Parabola Curve -->
        <path d="M 95 30 Q 210 250 325 30" fill="none" stroke="#00f5d4" stroke-width="4"/>
        <!-- Roots -->
        <circle cx="138" cy="150" r="6" fill="#ff2a85"/>
        <circle cx="282" cy="150" r="6" fill="#ff2a85"/>
        <text x="125" y="172" fill="#ff2a85" font-family="monospace" font-size="12">Root x₁</text>
        <text x="275" y="172" fill="#ff2a85" font-family="monospace" font-size="12">Root x₂</text>
        <!-- Vertex -->
        <circle cx="210" cy="140" r="6" fill="#ffd166"/>
        <text x="210" y="195" fill="#ffd166" font-family="monospace" font-size="12" text-anchor="middle">Vertex (-b/2a, f(x))</text>
      </svg>
    `;
  } else if (diagramType === 'cs_binary') {
    container.innerHTML = `
      <svg viewBox="0 0 420 220" width="100%" height="220">
        <rect width="420" height="220" fill="#050a18" stroke="#233975" stroke-width="2"/>
        <text x="210" y="28" fill="#00f5d4" font-family="monospace" font-size="13" text-anchor="middle">BINARY SEARCH PIVOT TREE // O(log₂ N)</text>
        <!-- Edges -->
        <line x1="210" y1="60" x2="120" y2="115" stroke="#233975" stroke-width="2"/>
        <line x1="210" y1="60" x2="300" y2="115" stroke="#00f5d4" stroke-width="3"/>
        <line x1="300" y1="115" x2="255" y2="175" stroke="#00f5d4" stroke-width="3"/>
        <line x1="300" y1="115" x2="345" y2="175" stroke="#233975" stroke-width="2"/>
        <!-- Nodes -->
        <circle cx="210" cy="60" r="20" fill="#101b3b" stroke="#00f5d4" stroke-width="2"/>
        <text x="210" y="65" fill="#fff" font-family="monospace" font-size="13" text-anchor="middle">50</text>
        <circle cx="120" cy="115" r="18" fill="#101b3b" stroke="#233975" stroke-width="2"/>
        <text x="120" y="120" fill="#93b0d8" font-family="monospace" font-size="12" text-anchor="middle">25</text>
        <circle cx="300" cy="115" r="18" fill="#101b3b" stroke="#00f5d4" stroke-width="2"/>
        <text x="300" y="120" fill="#00f5d4" font-family="monospace" font-size="12" text-anchor="middle">75</text>
        <circle cx="255" cy="175" r="20" fill="#06d6a0" stroke="#fff" stroke-width="2"/>
        <text x="255" y="180" fill="#050a18" font-family="monospace" font-size="13" font-weight="bold" text-anchor="middle">62✓</text>
      </svg>
    `;
  } else {
    container.innerHTML = `
      <svg viewBox="0 0 420 220" width="100%" height="220">
        <rect width="420" height="220" fill="#050a18" stroke="#233975" stroke-width="2"/>
        <rect x="25" y="75" width="100" height="65" fill="#101b3b" stroke="#ff2a85" stroke-width="2"/>
        <text x="75" y="105" fill="#ff2a85" font-family="monospace" font-size="12" text-anchor="middle">1. PROBLEM</text>
        <text x="75" y="122" fill="#e6f4ff" font-family="monospace" font-size="10" text-anchor="middle">Deconstruct</text>

        <line x1="125" y1="108" x2="155" y2="108" stroke="#00f5d4" stroke-width="3"/>

        <rect x="155" y="75" width="110" height="65" fill="#101b3b" stroke="#00f5d4" stroke-width="2"/>
        <text x="210" y="105" fill="#00f5d4" font-family="monospace" font-size="12" text-anchor="middle">2. AI + VISUAL</text>
        <text x="210" y="122" fill="#e6f4ff" font-family="monospace" font-size="10" text-anchor="middle">Pattern Match</text>

        <line x1="265" y1="108" x2="295" y2="108" stroke="#ffd166" stroke-width="3"/>

        <rect x="295" y="75" width="100" height="65" fill="#101b3b" stroke="#06d6a0" stroke-width="2"/>
        <text x="345" y="105" fill="#06d6a0" font-family="monospace" font-size="12" text-anchor="middle">3. MASTERY</text>
        <text x="345" y="122" fill="#e6f4ff" font-family="monospace" font-size="10" text-anchor="middle">Solved +35 XP</text>
      </svg>
    `;
  }
};

/* ==========================================================================
   SECTION 2: TEACHERS COMMAND CENTER (1-CLICK SOS & APPOINTMENTS)
   ========================================================================== */
function renderTeachers() {
  const grid = document.getElementById('teachers-grid');
  if (!grid) return;

  const filtered =
    appState.activeSubject === 'All'
      ? TEACHERS
      : TEACHERS.filter((t) => t.subject === appState.activeSubject);

  grid.innerHTML = filtered
    .map(
      (t) => `
      <div class="pixel-card teacher-card">
        <div>
          <div class="teacher-header">
            <div class="teacher-avatar">${t.avatar}</div>
            <div>
              <span class="status-badge">● ${t.status}</span>
              <h3 style="margin-top:0.35rem;font-size:1.1rem;color:#fff;">${t.name}</h3>
              <div style="color:var(--cyan-primary);font-family:var(--font-terminal);font-size:1.1rem;">
                ${t.subject} • ${t.room}
              </div>
            </div>
          </div>
          <p style="margin-top:0.85rem;color:var(--text-muted);font-size:0.92rem;line-height:1.5;">
            ${t.specialty}
          </p>
          <div style="margin-top:0.65rem;font-family:var(--font-terminal);font-size:1.05rem;color:var(--neon-gold);">
            🕒 Next Open Slot: ${t.nextSlot}
          </div>
        </div>

        <div class="teacher-actions">
          <button class="pixel-btn magenta-btn" onclick="triggerOneClickSOS('${t.id}')">
            🚨 1-CLICK SOS
          </button>
          <button class="pixel-btn" onclick="openAppointmentModal('${t.id}')">
            📅 BOOK SLOT
          </button>
        </div>
      </div>
    `
    )
    .join('');
}

window.triggerOneClickSOS = function (teacherId) {
  const teacher = TEACHERS.find((t) => t.id === teacherId);
  if (!teacher) return;
  window.soundEngine.playSOS();
  addXP(25, `1-Click SOS Sent to ${teacher.name}`);
  openModal(`
    <div style="border-bottom:2px solid var(--neon-magenta);padding-bottom:0.75rem;margin-bottom:1rem;">
      <span style="font-family:var(--font-pixel);font-size:0.75rem;color:var(--neon-magenta);">
        🚨 1-CLICK TEACHER SOS BEACON TRANSMITTED!
      </span>
    </div>
    <p style="font-size:1.05rem;line-height:1.6;margin-bottom:1rem;">
      <strong>${teacher.name}</strong> (${teacher.subject}) has received your instant problem ping in <strong>${teacher.room}</strong>!
    </p>
    <div style="background:var(--navy-deepest);border:2px solid var(--cyan-primary);padding:1rem;margin-bottom:1rem;">
      <div style="font-family:var(--font-terminal);font-size:1.2rem;color:var(--cyan-primary);">
        💬 LIVE AUTO-RESPONSE FROM ${teacher.name.toUpperCase()}:
      </div>
      <p style="margin-top:0.4rem;color:var(--text-main);">
        "Hey! I see your SOS beacon. Join Hologram Channel #4 or drop by ${teacher.room} in 2 minutes—I have the solution diagram ready for you!"
      </p>
    </div>
    <button class="pixel-btn" onclick="closeModal()">AWESOME, THANKS! ⚡</button>
  `);
};

window.openAppointmentModal = function (teacherId) {
  const teacher = TEACHERS.find((t) => t.id === teacherId);
  if (!teacher) return;

  openModal(`
    <h3 style="font-family:var(--font-pixel);font-size:0.85rem;color:var(--cyan-primary);margin-bottom:1rem;">
      📅 SCHEDULE 1-ON-1 APPOINTMENT // ${teacher.name}
    </h3>
    <form onsubmit="confirmAppointment(event, '${teacher.id}')" style="display:flex;flex-direction:column;gap:0.9rem;">
      <div>
        <label style="font-family:var(--font-terminal);font-size:1.15rem;color:var(--text-muted);">Select Time Slot:</label>
        <select id="appt-time" class="pixel-select" required>
          <option value="${teacher.nextSlot}">${teacher.nextSlot} (Recommended)</option>
          <option value="Today, 04:15 PM">Today, 04:15 PM</option>
          <option value="Tomorrow, 11:00 AM">Tomorrow, 11:00 AM</option>
        </select>
      </div>
      <div>
        <label style="font-family:var(--font-terminal);font-size:1.15rem;color:var(--text-muted);">Problem / Topic to Discuss:</label>
        <input id="appt-topic" type="text" class="pixel-input" placeholder="e.g., Need help with Exam Prep & Problem Set #3" required />
      </div>
      <div style="display:flex;gap:0.75rem;justify-content:flex-end;margin-top:0.5rem;">
        <button type="button" class="pixel-btn magenta-btn" onclick="closeModal()">CANCEL</button>
        <button type="submit" class="pixel-btn gold-btn">CONFIRM BOOKING ✓</button>
      </div>
    </form>
  `);
};

window.confirmAppointment = function (e, teacherId) {
  e.preventDefault();
  const teacher = TEACHERS.find((t) => t.id === teacherId);
  const time = document.getElementById('appt-time').value;
  const topic = document.getElementById('appt-topic').value;

  appState.appointments.push({
    teacherName: teacher.name,
    subject: teacher.subject,
    time,
    topic,
  });

  window.soundEngine.playSuccess();
  closeModal();
  renderAppointmentsList();
  addXP(40, `Booked Appointment with ${teacher.name}`);
};

function renderAppointmentsList() {
  const box = document.getElementById('appointments-list-box');
  if (!box) return;
  if (appState.appointments.length === 0) {
    box.style.display = 'none';
    return;
  }
  box.style.display = 'block';
  box.innerHTML = `
    <div style="font-family:var(--font-pixel);font-size:0.7rem;color:var(--neon-gold);margin-bottom:0.6rem;">
      📌 YOUR CONFIRMED TEACHER APPOINTMENTS (${appState.appointments.length})
    </div>
    <div style="display:grid;gap:0.5rem;">
      ${appState.appointments
        .map(
          (a) => `
        <div style="background:var(--navy-card);padding:0.6rem 0.9rem;border-left:4px solid var(--cyan-primary);display:flex;justify-content:space-between;flex-wrap:wrap;gap:0.5rem;">
          <span><strong>${a.teacherName}</strong> (${a.subject}) — <em>"${a.topic}"</em></span>
          <span style="color:var(--cyan-primary);font-family:var(--font-terminal);font-size:1.1rem;">🕒 ${a.time}</span>
        </div>
      `
        )
        .join('')}
    </div>
  `;
}

/* ==========================================================================
   SECTION 3: NOTES VAULT, PDF BOOKS & CURATED WEBSITES
   ========================================================================== */
window.setLibraryFilter = function (filterType) {
  appState.libraryFilter = filterType;
  renderLibrary();
};

function renderLibrary() {
  const grid = document.getElementById('library-grid');
  if (!grid) return;

  const filtered = LIBRARY_RESOURCES.filter((item) => {
    const matchesSubject =
      appState.activeSubject === 'All' || item.subject === appState.activeSubject;
    const matchesType =
      appState.libraryFilter === 'all' || item.type === appState.libraryFilter;
    return matchesSubject && matchesType;
  });

  grid.innerHTML = filtered
    .map((item) => {
      const badgeLabel =
        item.type === 'notes'
          ? '📓 STUDY NOTES'
          : item.type === 'pdf'
          ? '📘 PDF BOOK'
          : '🌐 WEB PORTAL';
      const actionBtn =
        item.type === 'website'
          ? `<a href="${item.url}" target="_blank" rel="noopener noreferrer" class="pixel-btn gold-btn" style="text-decoration:none;">LAUNCH SITE ↗</a>`
          : `<button class="pixel-btn" onclick="openResourceReader('${item.id}')">READ NOW 📖</button>`;

      return `
        <div class="pixel-card resource-card">
          <div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.65rem;">
              <span class="resource-tag">${badgeLabel}</span>
              <span style="font-family:var(--font-terminal);font-size:1.05rem;color:var(--neon-gold);">${item.subject}</span>
            </div>
            <h3 style="font-size:1.05rem;color:#fff;margin-bottom:0.5rem;line-height:1.4;">${item.title}</h3>
            <p style="font-size:0.9rem;color:var(--text-muted);line-height:1.5;">${item.summary}</p>
          </div>
          <div style="display:flex;gap:0.6rem;margin-top:0.5rem;">
            ${actionBtn}
            <button class="pixel-btn lime-btn" onclick="askAIAboutResource('${item.id}')">ASK AI 🦉</button>
          </div>
        </div>
      `;
    })
    .join('');
}

window.openResourceReader = function (resId) {
  const item = LIBRARY_RESOURCES.find((r) => r.id === resId);
  if (!item) return;
  addXP(20, `Read ${item.title.slice(0, 28)}...`);
  openModal(`
    <div style="line-height:1.65;">
      ${item.content}
      <div style="margin-top:1.25rem;display:flex;justify-content:flex-end;">
        <button class="pixel-btn" onclick="closeModal()">CLOSE READER ✓</button>
      </div>
    </div>
  `);
};

window.askAIAboutResource = function (resId) {
  const item = LIBRARY_RESOURCES.find((r) => r.id === resId);
  if (!item) return;
  document.getElementById('ai-workspace-section').scrollIntoView({ behavior: 'smooth' });
  fillPresetPrompt(`Summarize and give me a solved example from: ${item.title}`, item.subject, 'notes');
};

/* ==========================================================================
   SECTION 4: 3D FLASHCARDS & ARCADE REVISION MINI-GAME
   ========================================================================== */
function getActiveFlashcards() {
  if (appState.activeSubject === 'All') return FLASHCARDS;
  const subCards = FLASHCARDS.filter((f) => f.subject === appState.activeSubject);
  return subCards.length > 0 ? subCards : FLASHCARDS;
}

function renderFlashcard() {
  const deck = getActiveFlashcards();
  const card = deck[appState.flashcardIndex % deck.length];
  const stage = document.getElementById('flashcard-stage');
  if (stage) stage.classList.remove('flipped');

  const frontSub = document.getElementById('fc-front-subject');
  const frontQ = document.getElementById('fc-front-question');
  const backA = document.getElementById('fc-back-answer');
  const counter = document.getElementById('fc-counter');

  if (frontSub) frontSub.textContent = `CARD // ${card.subject.toUpperCase()} (CLICK TO FLIP)`;
  if (frontQ) frontQ.textContent = card.q;
  if (backA) backA.textContent = card.a;
  if (counter) counter.textContent = `${(appState.flashcardIndex % deck.length) + 1} / ${deck.length}`;
}

window.flipFlashcard = function () {
  const stage = document.getElementById('flashcard-stage');
  if (stage) {
    stage.classList.toggle('flipped');
    window.soundEngine.playFlip();
  }
};

window.nextFlashcard = function (dir = 1) {
  const deck = getActiveFlashcards();
  appState.flashcardIndex = (appState.flashcardIndex + dir + deck.length) % deck.length;
  renderFlashcard();
  addXP(10, 'Reviewed Flashcard');
};

function renderArcadeQuestion() {
  const qObj = ARCADE_QUESTIONS[appState.arcadeIndex % ARCADE_QUESTIONS.length];
  const qBox = document.getElementById('arcade-question-text');
  const optGrid = document.getElementById('arcade-options-grid');
  const scoreEl = document.getElementById('arcade-score-val');
  const waveEl = document.getElementById('arcade-wave-val');

  if (qBox) qBox.textContent = qObj.question;
  if (scoreEl) scoreEl.textContent = `SCORE: ${appState.arcadeScore}`;
  if (waveEl) waveEl.textContent = `WAVE ${(appState.arcadeIndex % ARCADE_QUESTIONS.length) + 1}/${ARCADE_QUESTIONS.length}`;

  if (optGrid) {
    optGrid.innerHTML = qObj.options
      .map(
        (opt, idx) => `
        <button class="pixel-btn" onclick="answerArcadeQuiz(${idx})">
          ${opt}
        </button>
      `
      )
      .join('');
  }
}

window.answerArcadeQuiz = function (choiceIdx) {
  const qObj = ARCADE_QUESTIONS[appState.arcadeIndex % ARCADE_QUESTIONS.length];
  const feedback = document.getElementById('arcade-feedback');

  if (choiceIdx === qObj.correct) {
    window.soundEngine.playSuccess();
    appState.arcadeScore += 100;
    addXP(50, 'Arcade Quiz Boss Hit!');
    if (feedback) {
      feedback.style.color = 'var(--neon-lime)';
      feedback.textContent = '🎯 DIRECT HIT! +100 ARCADE PTS! Advancing to next wave...';
    }
    appState.arcadeIndex++;
    setTimeout(() => {
      if (feedback) feedback.textContent = 'Select the correct answer to power up your shield!';
      renderArcadeQuestion();
    }, 900);
  } else {
    window.soundEngine.playError();
    if (feedback) {
      feedback.style.color = 'var(--neon-magenta)';
      feedback.textContent = '💥 SHIELD GRAZED! Try another option or ask PIXEL-OWL 9000!';
    }
  }
};

/* ==========================================================================
   SECTION 5: INDOOR & OUTDOOR GAME ARENA SEAT PRE-BOOKING
   ========================================================================== */
function renderGameZones() {
  const list = document.getElementById('game-zones-list');
  if (!list) return;

  list.innerHTML = GAME_ZONES.map((z) => {
    const freeCount = z.slots.filter(
      (s) => !s.occupied && !appState.reservedSeats.includes(s.id)
    ).length;
    return `
      <div class="zone-item ${appState.selectedZoneId === z.id ? 'active' : ''}"
           onclick="selectGameZone('${z.id}')">
        <div style="display:flex;justify-content:space-between;font-family:var(--font-pixel);font-size:0.58rem;color:var(--cyan-primary);margin-bottom:0.4rem;">
          <span>${z.type} ARENA</span>
          <span style="color:var(--neon-lime);">${freeCount} SEATS FREE</span>
        </div>
        <div style="font-weight:700;font-size:1rem;color:#fff;margin-bottom:0.3rem;">${z.name}</div>
        <div style="font-family:var(--font-terminal);font-size:1.05rem;color:var(--neon-gold);">
          ⏳ Next Wave: ${z.nextFreeIn}
        </div>
      </div>
    `;
  }).join('');
}

window.selectGameZone = function (zoneId) {
  appState.selectedZoneId = zoneId;
  appState.selectedSeatId = null;
  renderGameZones();
  renderSelectedZoneSeats();
};

function renderSelectedZoneSeats() {
  const zone = GAME_ZONES.find((z) => z.id === appState.selectedZoneId);
  const titleEl = document.getElementById('selected-zone-title');
  const grid = document.getElementById('seat-map-grid');
  if (!zone || !grid) return;

  if (titleEl) {
    titleEl.textContent = `${zone.name} // Select Seat Before Class Ends`;
  }

  grid.innerHTML = zone.slots
    .map((slot) => {
      const isYours = appState.reservedSeats.includes(slot.id);
      const isSelected = appState.selectedSeatId === slot.id;
      let cls = 'seat-slot';
      let statusText = 'OPEN';
      if (isYours) {
        cls += ' reserved-by-you';
        statusText = 'YOUR SEAT ✓';
      } else if (slot.occupied) {
        cls += ' occupied';
        statusText = 'IN GAME';
      } else if (isSelected) {
        cls += ' selected';
        statusText = 'SELECTED';
      }

      return `
        <div class="${cls}" onclick="clickSeatSlot('${slot.id}', ${slot.occupied})">
          <div style="font-weight:700;">${slot.id}</div>
          <div style="font-size:0.9rem;">${slot.label}</div>
          <div style="font-size:0.85rem;margin-top:2px;">[${statusText}]</div>
        </div>
      `;
    })
    .join('');
}

window.clickSeatSlot = function (slotId, isOccupied) {
  if (isOccupied) {
    window.soundEngine.playError();
    showToast('⚠️ That station is currently in a match! Pick an OPEN cyan slot or pre-book for after class.');
    return;
  }
  if (appState.reservedSeats.includes(slotId)) {
    showToast('✅ You already reserved this seat for right after class!');
    return;
  }
  appState.selectedSeatId = slotId;
  renderSelectedZoneSeats();
};

window.confirmSeatReservation = function () {
  if (!appState.selectedSeatId) {
    window.soundEngine.playError();
    showToast('⚠️ Click an OPEN cyan seat on the map first!');
    return;
  }
  const timeWindow = document.getElementById('booking-time-window').value;
  appState.reservedSeats.push(appState.selectedSeatId);
  const bookedId = appState.selectedSeatId;
  appState.selectedSeatId = null;

  window.soundEngine.playSuccess();
  renderGameZones();
  renderSelectedZoneSeats();
  addXP(30, `Reserved Game Seat ${bookedId} (${timeWindow})`);
};

function startClassCountdownTimer() {
  let secondsLeft = 14 * 60 + 25; // 14m 25s until class bell
  const timerEl = document.getElementById('class-bell-countdown');
  setInterval(() => {
    if (secondsLeft > 0) secondsLeft--;
    const mins = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
    const secs = String(secondsLeft % 60).padStart(2, '0');
    if (timerEl) timerEl.textContent = `${mins}:${secs}`;
  }, 1000);
}

/* ==========================================================================
   SECTION 6: CAMPUS QUESTS & 1-CLICK PARTICIPATION
   ========================================================================== */
function renderCampusEvents() {
  const grid = document.getElementById('campus-events-grid');
  if (!grid) return;

  grid.innerHTML = CAMPUS_EVENTS.map(
    (ev) => `
      <div class="pixel-card" style="display:flex;flex-direction:column;justify-content:space-between;gap:0.9rem;">
        <div>
          <span class="resource-tag">${ev.category}</span>
          <h3 style="font-size:1.05rem;color:#fff;margin-top:0.6rem;">${ev.title}</h3>
          <div style="font-family:var(--font-terminal);font-size:1.1rem;color:var(--cyan-primary);margin-top:0.4rem;">
            🕒 ${ev.time} • 👥 ${ev.participants} Joined
          </div>
          <div style="font-family:var(--font-terminal);font-size:1.05rem;color:var(--neon-gold);margin-top:0.2rem;">
            🏆 Reward: ${ev.reward}
          </div>
        </div>
        <button class="pixel-btn ${ev.joined ? 'lime-btn' : 'gold-btn'}"
                onclick="toggleEventJoin('${ev.id}')">
          ${ev.joined ? '✓ REGISTERED IN QUEST' : '🚀 1-CLICK PARTICIPATE'}
        </button>
      </div>
    `
  ).join('');
}

window.toggleEventJoin = function (evId) {
  const ev = CAMPUS_EVENTS.find((e) => e.id === evId);
  if (!ev) return;
  if (!ev.joined) {
    ev.joined = true;
    ev.participants++;
    window.soundEngine.playSuccess();
    addXP(60, `Joined ${ev.title.slice(0, 26)}`);
  } else {
    showToast(`You're already registered for ${ev.title}!`);
  }
  renderCampusEvents();
};

/* ==========================================================================
   AUDIO & VISUAL LOUNGE CONTROLS + MODAL HELPERS
   ========================================================================== */
window.toggleAmbientLounge = function () {
  const playing = window.soundEngine.toggleAmbient();
  const btn = document.getElementById('ambient-toggle-btn');
  const eq = document.getElementById('lounge-eq-bars');
  if (btn) {
    btn.textContent = playing ? '🎵 LO-FI SYNTH: ON' : '🎵 LO-FI SYNTH: OFF';
  }
  if (eq) {
    eq.classList.toggle('playing', playing);
  }
  showToast(playing ? '🌊 Relaxing Navy & Cyan Synthwave Ambient Started' : '🔇 Ambient Synth Paused');
};

window.toggleSfxMute = function () {
  window.soundEngine.sfxEnabled = !window.soundEngine.sfxEnabled;
  const btn = document.getElementById('sfx-toggle-btn');
  if (btn) {
    btn.textContent = window.soundEngine.sfxEnabled ? '🔊 8-BIT SFX: ON' : '🔇 8-BIT SFX: MUTE';
  }
};

window.toggleCRTLines = function () {
  document.body.classList.toggle('crt-enabled');
  showToast('📺 Retro CRT Scanline Filter Toggled');
};

window.openModal = function (htmlContent) {
  const backdrop = document.getElementById('global-modal-backdrop');
  const content = document.getElementById('global-modal-content');
  if (content) content.innerHTML = htmlContent;
  if (backdrop) backdrop.classList.add('open');
};

window.closeModal = function () {
  const backdrop = document.getElementById('global-modal-backdrop');
  if (backdrop) backdrop.classList.remove('open');
};

/* ==========================================================================
   BLACK CRT JUDGE PRESENTATION & AUTOMATED LIVE FEATURE SHOWCASE
   ========================================================================== */
let presentationTimers = [];
let presentationActive = false;

function clearPresentationTimers() {
  presentationTimers.forEach((t) => clearTimeout(t));
  presentationTimers = [];
  document.querySelectorAll('.tour-spotlight').forEach((el) => el.classList.remove('tour-spotlight'));
}

function typewriteYellowCRT(text, speedMs = 34, onComplete) {
  const textEl = document.getElementById('crt-typewriter-text');
  if (!textEl) return;
  textEl.textContent = '';

  let idx = 0;
  function step() {
    if (!presentationActive) return;
    if (idx < text.length) {
      const ch = text[idx];
      textEl.textContent += ch;
      if (ch !== ' ' && ch !== '\n' && idx % 2 === 0) {
        window.soundEngine.playTypeBlip(idx);
      }
      idx++;
      const delay = ch === '\n' ? speedMs * 4 : ch === '.' || ch === '!' ? speedMs * 3 : speedMs;
      presentationTimers.push(setTimeout(step, delay));
    } else if (onComplete) {
      presentationTimers.push(setTimeout(onComplete, 1800));
    }
  }
  step();
}

window.startJudgePresentation = function () {
  clearPresentationTimers();
  presentationActive = true;
  closeModal();

  const overlay = document.getElementById('crt-intro-overlay');
  const badge = document.getElementById('crt-stage-badge');
  const counter = document.getElementById('crt-scene-counter');
  const tourBar = document.getElementById('tour-banner-bar');

  if (tourBar) tourBar.classList.remove('active');
  if (overlay) overlay.classList.add('active');

  // SCENE 1: THE PROBLEM ON BLACK CRT
  if (counter) counter.textContent = 'SCENE 01 / 02 // PROBLEM STATEMENT';
  if (badge) badge.textContent = '⚠️ THE PROBLEM: WHY STUDENTS STRUGGLE TODAY';

  const problemScript =
    '> INITIALIZING CAMPUS DIAGNOSTIC...\n\n' +
    '1. BORING, LIFELESS PORTALS: Traditional educational websites feel cold, stressful, and exhausting to use.\n' +
    '2. STUCK ON TOUGH PROBLEMS: Students get stuck on Physics, Math, or Coding at home with no instant visual explanation.\n' +
    '3. DELAYED TEACHER HELP: Reaching teachers or booking 1-on-1 help takes days of back-and-forth emails.\n' +
    '4. CROWDED BREAK ARENAS: Indoor & outdoor gaming seats fill up before class even ends!';

  typewriteYellowCRT(problemScript, 28, () => {
    // SCENE 2: THE AI & RETRO LOUNGE SOLUTION ON BLACK CRT
    if (!presentationActive) return;
    window.soundEngine.playSuccess();
    if (counter) counter.textContent = 'SCENE 02 / 02 // OUR AI-POWERED SOLUTION';
    if (badge) badge.textContent = '💡 THE SOLUTION: NEON PIXEL ACADEMY + GEMINI AI';

    const solutionScript =
      '> DEPLOYING NEON PIXEL ACADEMY (v2.6)...\n\n' +
      '★ RELAXING NAVY & CYAN RETRO LOUNGE: Every click sparks 8-bit chiptune sounds, neon bursts, and chill synthwave audio.\n' +
      '★ SECURE GEMINI AI TUTOR (/api/gemini): Answers ANY general or academic question & draws live visual solution diagrams!\n' +
      '★ 1-CLICK TEACHER SOS & BOOKING: Ping teachers in one click or book office hours.\n' +
      '★ PRE-BOOK GAMING SEATS: Lock in indoor/outdoor game seats before the class bell rings!';

    typewriteYellowCRT(solutionScript, 26, () => {
      if (!presentationActive) return;
      skipToLiveFeatureTour();
    });
  });
};

window.skipToLiveFeatureTour = function () {
  clearPresentationTimers();
  presentationActive = true;

  const overlay = document.getElementById('crt-intro-overlay');
  const tourBar = document.getElementById('tour-banner-bar');
  const tourText = document.getElementById('tour-banner-text');

  if (overlay) overlay.classList.remove('active');
  if (tourBar) tourBar.classList.add('active');
  window.soundEngine.playSuccess();

  const tourSteps = [
    {
      delay: 200,
      selector: '.hero-banner',
      caption: '🎬 [1/6] RETRO NAVY & CYAN HERO SANCTUARY: 16-Bit Pixel Art Problem -> AI -> Mastery Workflow & Lo-Fi Synthwave!',
      action: () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },
    {
      delay: 4200,
      selector: '#ai-workspace-section',
      caption: '🤖 [2/6] SECURE GEMINI AI (/api/gemini): Answering ANY general or study question + Live Visual Force Vector Diagram!',
      action: () => {
        document.getElementById('ai-workspace-section').scrollIntoView({ behavior: 'smooth' });
        fillPresetPrompt('Explain Newtons Second Law with a 5kg block and 20N force vector solution', 'Physics', 'solve');
      },
    },
    {
      delay: 9000,
      selector: '#teacher-section',
      caption: '🚨 [3/6] TEACHER COMMAND CENTER: 1-Click SOS Beacon for instant help & 1-on-1 Appointment Booking!',
      action: () => {
        document.getElementById('teacher-section').scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      delay: 13200,
      selector: '#library-section',
      caption: '📚 [4/6] ARCADE KNOWLEDGE VAULT: Subject Categories, Study Notes, Illustrated PDF Books & Web Portals!',
      action: () => {
        document.getElementById('library-section').scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      delay: 17200,
      selector: '#revision-section',
      caption: '🃏 [5/6] 3D PIXEL FLASHCARDS & BOSS QUIZ: Flip 3D solution cards and battle through revision questions!',
      action: () => {
        document.getElementById('revision-section').scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => flipFlashcard(), 1200);
      },
    },
    {
      delay: 21500,
      selector: '#arena-section',
      caption: '🏓 [6/6] GAME ARENA SEAT RADAR: Pre-book Indoor & Outdoor gaming seats BEFORE class ends!',
      action: () => {
        document.getElementById('arena-section').scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          clickSeatSlot('TT-B1', false);
          confirmSeatReservation();
        }, 1200);
      },
    },
    {
      delay: 26500,
      selector: '#events-section',
      caption: '🏆 PRESENTATION COMPLETE! Join Campus Quests in 1 Click — Ready for Judge Q&A!',
      action: () => {
        document.getElementById('events-section').scrollIntoView({ behavior: 'smooth' });
        window.soundEngine.playSuccess();
      },
    },
  ];

  tourSteps.forEach((step) => {
    presentationTimers.push(
      setTimeout(() => {
        if (!presentationActive) return;
        document.querySelectorAll('.tour-spotlight').forEach((el) => el.classList.remove('tour-spotlight'));
        const target = document.querySelector(step.selector);
        if (target) target.classList.add('tour-spotlight');
        if (tourText) tourText.textContent = step.caption;
        window.soundEngine.playTypeBlip(1);
        if (step.action) step.action();
      }, step.delay)
    );
  });
};

window.stopJudgePresentation = function () {
  presentationActive = false;
  clearPresentationTimers();
  const overlay = document.getElementById('crt-intro-overlay');
  const tourBar = document.getElementById('tour-banner-bar');
  if (overlay) overlay.classList.remove('active');
  if (tourBar) tourBar.classList.remove('active');
};
