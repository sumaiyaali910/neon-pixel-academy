# 🕹️ Neon Pixel Academy

> **A Retro 16-Bit Navy Blue & Cyan AI Educational Sanctuary & Campus Hub**  
> 🌐 **Live Deployment**: [https://neon-pixel-academy.vercel.app](https://neon-pixel-academy.vercel.app)  
> 🎬 **Judge Presentation Video Studio**: [https://neon-pixel-academy.vercel.app/pitch-video.html](https://neon-pixel-academy.vercel.app/pitch-video.html)

---

## 👥 Team Information

- **Project Name**: **Neon Pixel Academy**
- **Team Name**: **Dream Byte**
- **Team Members**:
  - **Sumaiya Ali**
  - **Ramsha**
  - **Bhoomika**

---

## 🎨 Theme Chosen for the Website

- **Visual Theme**: **Retro 16-Bit Pixelated Arcade & Synthwave Sanctuary**
- **Color Palette**:
  - **Primary Background**: Deep Space Navy Blue (`#0a1128`, `#050a18`, and `#101b3b`)
  - **Secondary Accent**: Electric Neon Cyan (`#00f5d4` and `#38f9ff`)
  - **Highlight Accents**: Arcade Gold (`#ffd166`), Cyber Magenta (`#ff2a85`), and Victory Lime (`#06d6a0`)
- **Sensory & Interactive Design**:
  - Pixelated typography (`Press Start 2P` and `VT323`) paired with clean body text (`Space Grotesk`) and a toggleable **CRT Scanline Filter**.
  - **Interactive Neon Particle Bursts** on every button click.
  - **8-Bit Chiptune Click SFX & Relaxing Lo-Fi Synthwave Ambient Audio** synthesized in real time via the browser's Web Audio API so studying feels calm, engaging, and stress-free.

---

## ⚠️ The Problems We Identified

1. **Boring, Stressful Educational Portals & Getting Stuck Alone**:
   - Traditional learning websites feel lifeless, cold, and exhausting to use, draining student motivation. When students get stuck on a tough concept or homework problem alone at night, they have no instant, interactive, or visual way to understand the solution.
2. **Delayed Teacher Access & Crowded Campus Break Arenas**:
   - Reaching out to teachers for urgent help or booking 1-on-1 office hours usually takes days of back-and-forth emails. Meanwhile, on campus, indoor and outdoor gaming areas fill up completely before class even ends, leaving students with no way to reserve a seat to unwind during their break.

---

## 💡 Our Solution: Neon Pixel Academy + Built-In Website AI

1. **🦉 Built-In Website Gemini AI Tutor (`PIXEL-OWL 9000`) + Visual Solution Holograms**:
   - Answers **any general question on any topic** (just like Google Gemini) as well as **step-by-step academic problems**, while automatically generating **interactive Visual Solution Diagrams** (Force Vector Free-Body Diagrams, Parabolic Root Graphs, and Binary Search Trees) and displaying our custom 16-bit pixel art Problem-to-Solution workflow banner.
2. **🎮 All-in-One Retro Campus & Revision Hub**:
   - **🚨 1-Click Teacher SOS & Appointment Booking**: Ping teachers in one click for instant help or book 1-on-1 office hours.
   - **📚 Subject Categories, Study Notes, PDF Books & Curated Web Portals**: Filter across *Physics, Mathematics, Computer Science, Chemistry, Biology, and History*.
   - **🃏 3D Pixel Flashcards & Cyber-Quiz Defender Game**: Revise topics using 3D-flipping neon flashcards and a wave-based boss quiz game.
   - **🏓 Pre-Book Indoor & Outdoor Game Seats Before Class Ends**: Live class-bell countdown and interactive seat radar for **Indoor** (*Table Tennis, VR/PS5 Lounge*) and **Outdoor** (*5v5 Futsal, 3v3 Basketball & Badminton*) zones.
   - **🚀 1-Click Campus Quests**: Register for hackathons, study circles, and tournaments in a single click.

---

## 🤖 How the AI Is Used (Model, API, Inputs & Outputs)

### 1. Model & API Name
- **Pre-Trained Model**: **Google Gemini 2.5 Flash** (`gemini-2.5-flash`)
- **Upstream REST API**: Google Generative Language API (`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`)
- **Secure Backend Endpoint**: `POST /api/gemini` (implemented in [`api/gemini.js`](./api/gemini.js), [`app/api/gemini/route.js`](./app/api/gemini/route.js), [`server.js`](./server.js), and [`server.py`](./server.py)).
- **API Key Security**: Fetched exclusively on the server side via `process.env.GEMINI_API_KEY` (zero hardcoded or exposed keys in the frontend).

### 2. What It Takes as Input (`POST /api/gemini` JSON Request Body)
```json
{
  "prompt": "Explain Newton's Second Law with a 5kg block and 20N force vector solution",
  "subject": "Physics",
  "mode": "solve",
  "history": [
    { "role": "user", "content": "Hello!" },
    { "role": "assistant", "content": "Hey there! Ask me anything!" }
  ]
}
```
- `prompt` *(string)*: Any general question, coding task, trivia query, or academic problem entered by the user.
- `subject` *(string)*: Selected category (`General (Anything)`, `Physics`, `Mathematics`, `Computer Science`, `Chemistry`, `Biology`, or `History`).
- `mode` *(string)*: Output mode (`general` for open-ended Gemini chat, `solve` for step-by-step problem breakdown, `notes` for structured study notes, or `flashcards` for 3 Q&A pairs).
- `history` *(array)*: Multi-turn conversation history for contextual follow-up answers.

### 3. What It Returns (`200 OK` JSON Response Body)
```json
{
  "reply": "### ⚡ Newton's Second Law & Force Vector Breakdown\n1. Free-Body Diagram...\n2. Formula: F = m × a...",
  "diagramType": "physics_force",
  "topicTitle": "Newton's Laws & Force Vectors (F = m × a)",
  "model": "gemini-2.5-flash",
  "envConfigured": true,
  "subject": "Physics",
  "mode": "solve"
}
```
- `reply` *(string)*: Markdown-formatted AI explanation, code block, study notes, or general answer rendered in the chat terminal.
- `diagramType` *(string)*: Identifier (`physics_force`, `math_parabola`, `cs_binary`, or `general_flow`) that triggers the **Interactive SVG Solution Hologram** panel to draw the matching visual diagram.
- `topicTitle` *(string)*: Dynamic title displayed above the Visual Solution Hologram.
- `model` *(string)*: Active AI model identifier.

---

## 🛠️ Tech Stack

- **Frontend**:
  - **HTML5 & CSS3**: Custom Retro Pixel UI, CSS Grid/Flexbox, 3D CSS Card Transforms (`preserve-3d`), CRT Scanline Shaders, and Neon Particle Animations.
  - **JavaScript (ES6+)**: Modular client state management ([`js/app.js`](./js/app.js)), dynamic SVG Solution Hologram renderer, and automated Black CRT Judge Presentation tour.
  - **React / Next.js Component**: Reusable [`components/GeminiTutorTerminal.jsx`](./components/GeminiTutorTerminal.jsx) client component.
  - **Audio & Video Synthesis**: Browser **Web Audio API** ([`js/audio.js`](./js/audio.js)) for real-time 8-bit chiptune SFX and synthwave ambient music + HTML5 Canvas `MediaRecorder` studio ([`pitch-video.html`](./pitch-video.html)).
- **Backend & Deployment**:
  - **Vercel Serverless Functions**: Node.js serverless handler ([`api/gemini.js`](./api/gemini.js)) and [`vercel.json`](./vercel.json) routing.
  - **Next.js App Router API Route**: [`app/api/gemini/route.js`](./app/api/gemini/route.js).
  - **Local Development Servers**: Node.js HTTP server ([`server.js`](./server.js)) and Python 3 server ([`server.py`](./server.py)).
  - **Video Rendering Pipeline**: Python (`Pillow`, `NumPy`, `imageio`, `imageio-ffmpeg` / `FFmpeg`) in [`generate_pitch_video.py`](./generate_pitch_video.py).

---

## 🚀 Steps to Run the Project Locally

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/sumaiyaali910/neon-pixel-academy.git
   cd neon-pixel-academy
   ```

2. **Set Up Your Environment Variable (`GEMINI_API_KEY`)**:
   - Copy `.env.example` to `.env.local` (or `.env`) in the root folder:
     ```env
     GEMINI_API_KEY=your_actual_google_gemini_api_key_here
     ```
   - *(Note: Even if `GEMINI_API_KEY` is left blank during offline testing, the backend automatically activates its built-in General Knowledge & Wikipedia Fallback Engine so all features remain testable!)*

3. **Start the Local Server (Choose Python or Node.js)**:
   - **Option A — Using Python 3**:
     ```bash
     python server.py
     ```
     Then open **[http://localhost:8090](http://localhost:8090)** in your browser.
   - **Option B — Using Node.js**:
     ```bash
     node server.js
     ```
     Then open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 📚 Datasets, Pre-Trained Models & Resources Used (With Credits)

- **Project Authors & Credits**: **Sumaiya Ali, Ramsha, and Bhoomika** (*Team Dream Byte*)

1. **Pre-Trained AI Models & Knowledge APIs**:
   - **Google Gemini 2.5 Flash (`gemini-2.5-flash`)** — Integrated & configured by **Sumaiya Ali, Ramsha, and Bhoomika** (Used for general Q&A, step-by-step academic problem solving, study notes, and flashcard generation).
   - **Knowledge & Encyclopedia Fallback Engine** — Designed & implemented by **Sumaiya Ali, Ramsha, and Bhoomika** (Used to retrieve real-time summaries for general factual queries when running without an API key).
2. **Curated Educational Datasets & Interactive Simulators Linked in the Vault**:
   - **Multi-Subject Study Notes, PDF Textbooks & Web Portals Vault** — Curated & authored by **Sumaiya Ali, Ramsha, and Bhoomika**.
   - **Custom In-App Datasets**: Multi-subject 3D Flashcard Decks, Cyber-Quiz Boss Questions, Teacher Command Center Profiles, and Indoor/Outdoor Campus Arena Seat Maps — Authored by **Sumaiya Ali, Ramsha, and Bhoomika**.
3. **Typography, Audio & Media Tools**:
   - **Retro 16-Bit Pixel Theme, CRT Scanlines, Rain Mode & Vinyl Mode UI** — Designed & developed by **Sumaiya Ali, Ramsha, and Bhoomika**.
   - **Web Audio API Synthesizer (`js/audio.js`)** — Custom procedural 8-bit chiptune, Lo-Fi synthwave, cozy rain patter, and warm vinyl crackle audio engine by **Sumaiya Ali, Ramsha, and Bhoomika**.
   - **Judge Presentation Video & CRT Typewriter Studio** — Created by **Sumaiya Ali, Ramsha, and Bhoomika**.

---

*Crafted with ⚡ by **Team Dream Byte** (**Sumaiya Ali**, **Ramsha**, and **Bhoomika**).*
