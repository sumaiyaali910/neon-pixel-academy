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

## ⚠️ The Problems We Identified

As highlighted in our Black CRT Judge Presentation Video, students today face major roadblocks with traditional educational platforms and campus life:

1. **Boring, Stressful Educational Portals & Getting Stuck Alone**:
   - Traditional learning websites feel lifeless, cold, and exhausting to use, draining student motivation. When students get stuck on a tough concept or homework problem alone at night, they have no instant, interactive, or visual way to understand the solution.
2. **Delayed Teacher Access & Crowded Campus Break Arenas**:
   - Reaching out to teachers for urgent help or booking 1-on-1 office hours usually takes days of back-and-forth emails. Meanwhile, on campus, indoor and outdoor gaming areas fill up completely before class even ends, leaving students with no way to reserve a seat to unwind during their break.

---

## 💡 Our Solution: Neon Pixel Academy + Built-In Website AI

**Team Dream Byte** built **Neon Pixel Academy** to transform studying and campus coordination into a relaxing, gamified 16-bit arcade experience (**Navy Blue `#0a1128`** with **Electric Cyan `#00f5d4`** and neon accents):

1. **🦉 Built-In Website Gemini AI Tutor (`/api/gemini`) + Visual Solution Holograms**:
   - Our website provides a secure, built-in **Gemini AI Assistant (`PIXEL-OWL 9000`)** connected via a backend serverless route (`/api/gemini`) that safely reads `process.env.GEMINI_API_KEY` on the server (with zero exposed keys on the frontend).
   - It answers **any general question on any topic** (just like Google Gemini—science, coding, trivia, daily life, jokes, or calculations) as well as **step-by-step academic problems**, while automatically generating **interactive Visual Solution Diagrams** (Force Vector Free-Body Diagrams, Parabolic Root Graphs, and Binary Search Trees) plus a custom 16-bit pixel art Problem-to-Solution workflow banner.
2. **🎮 All-in-One Retro Campus & Revision Hub**:
   - **🔊 8-Bit Chiptune Click SFX, Neon Bursts & Lo-Fi Synthwave Audio**: Every button click triggers Web Audio API 8-bit chiptune sounds and glowing neon particle sparks, paired with a toggleable relaxing Lo-Fi Synthwave ambient player so studying feels calm and fun.
   - **🚨 1-Click Teacher SOS & Appointment Booking**: Students can ping teachers in **one click** for urgent problem help or schedule 1-on-1 office hour appointments by subject category.
   - **📚 Subject Categories, Study Notes, PDF Books & Curated Web Portals**: Filter across *Physics, Mathematics, Computer Science, Chemistry, Biology, and History* to read structured study notes, open illustrated PDF books, or launch interactive web simulators.
   - **🃏 3D Pixel Flashcards & Cyber-Quiz Defender Game**: Revise topics using interactive 3D-flipping neon flashcards and a wave-based arcade quiz game that rewards XP.
   - **🏓 Pre-Book Indoor & Outdoor Game Seats Before Class Ends**: Features a live class-bell countdown and an interactive seat radar for **Indoor** (*Table Tennis, VR/PS5 Arcade Lounge*) and **Outdoor** (*5v5 Futsal Turf, 3v3 Basketball & Badminton*) zones so students can lock in an open seat before the bell rings.
   - **🚀 1-Click Campus Quests**: Participate in hackathons, study circles, and tournaments with a single click.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: HTML5, Custom Retro Pixel CSS3 (`Press Start 2P`, `VT323`, `Space Grotesk`), Vanilla JavaScript ES6+, Web Audio API Synthesizer, Interactive SVG Holograms, HTML5 Canvas Video Recorder.
- **Backend / API**:
  - **Vercel Serverless Function**: [`api/gemini.js`](./api/gemini.js) (`POST /api/gemini`)
  - **Next.js App Router Route**: [`app/api/gemini/route.js`](./app/api/gemini/route.js)
  - **Node.js & Python Local Servers**: [`server.js`](./server.js) and [`server.py`](./server.py)
- **Security**: Fetches the Gemini API key exclusively from `process.env.GEMINI_API_KEY` on the server side.

---

## 🚀 Getting Started Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sumaiyaali910/neon-pixel-academy.git
   cd neon-pixel-academy
   ```
2. **Configure your Environment Variable (Optional for Local Demo, Required for Live Gemini 2.5 Flash)**:
   Create a `.env.local` (or `.env`) file in the project root:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
3. **Run the Server**:
   - **Using Python**:
     ```bash
     python server.py
     ```
     Open `http://localhost:8090`
   - **Or using Node.js**:
     ```bash
     node server.js
     ```
     Open `http://localhost:3000`

---

*Crafted with ⚡ by **Team Dream Byte** (**Sumaiya Ali**, **Ramsha**, and **Bhoomika**).*
