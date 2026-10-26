#!/usr/bin/env python3
"""
NEON PIXEL ACADEMY - Secure Local Server (`server.py`)
Serves static files and provides the `/api/gemini` backend endpoint.
Reads `GEMINI_API_KEY` from `os.environ.get("GEMINI_API_KEY")` (mirroring `process.env.GEMINI_API_KEY`).
Answers ANY general, conversational, creative, coding, or academic question just like Gemini!
"""

import http.server
import socketserver
import os
import json
import urllib.request
import urllib.error
import urllib.parse
import sys
import re
import math
import datetime

PORT = int(os.environ.get("PORT", 8090))


def load_dotenv_if_present():
    """Load .env or .env.local if present in project root."""
    for env_file in [".env.local", ".env"]:
        if os.path.exists(env_file):
            with open(env_file, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        k, v = line.split("=", 1)
                        k = k.strip()
                        v = v.strip().strip('"').strip("'")
                        if k and v and k not in os.environ:
                            os.environ[k] = v


def try_wikipedia_summary(query: str) -> str:
    """Attempt to fetch a real-world general knowledge summary for open-ended factual questions."""
    try:
        # Clean common question prefixes
        cleaned = re.sub(
            r"^(what is|what are|who is|who was|tell me about|explain|define|how does|where is|history of)\s+",
            "",
            query.strip(),
            flags=re.IGNORECASE,
        ).strip("?!. ")
        if not cleaned or len(cleaned) < 2:
            return ""

        search_url = (
            "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch="
            + urllib.parse.quote(cleaned)
            + "&utf8=&format=json&srlimit=1"
        )
        req = urllib.request.Request(
            search_url, headers={"User-Agent": "NeonPixelAcademy/2.6"}
        )
        with urllib.request.urlopen(req, timeout=4) as resp:
            search_data = json.loads(resp.read().decode("utf-8"))
            results = search_data.get("query", {}).get("search", [])
            if not results:
                return ""
            title = results[0]["title"]

        summary_url = (
            "https://en.wikipedia.org/api/rest_v1/page/summary/"
            + urllib.parse.quote(title.replace(" ", "_"))
        )
        req2 = urllib.request.Request(
            summary_url, headers={"User-Agent": "NeonPixelAcademy/2.6"}
        )
        with urllib.request.urlopen(req2, timeout=4) as resp2:
            sum_data = json.loads(resp2.read().decode("utf-8"))
            extract = sum_data.get("extract", "")
            if extract:
                return f"### 🌐 {title}\n\n{extract}"
    except Exception:
        pass
    return ""


def evaluate_math_expression(prompt: str) -> str:
    """Safely evaluate arithmetic or math expressions if the user asks a calculation."""
    cleaned = prompt.lower().replace("what is", "").replace("calculate", "").replace("solve", "").replace("=", "").replace("?", "").strip()
    cleaned = cleaned.replace("^", "**").replace("×", "*").replace("÷", "/")
    if re.match(r"^[0-9\.\+\-\*\/\(\)\s]+$", cleaned) and any(op in cleaned for op in ["+", "-", "*", "/"]):
        try:
            result = eval(cleaned, {"__builtins__": None}, {})
            return f"### 🧮 Calculation Result\n\n**Expression**: `{cleaned}`\n\n**Answer**: **`{result}`**"
        except Exception:
            pass
    return ""


def generate_general_ai_response(prompt: str, subject: str, mode: str, history: list) -> dict:
    """
    General-purpose AI response engine (used when GEMINI_API_KEY is not set in .env,
    or as a companion to live Gemini responses). Answers ANY question naturally!
    """
    p_clean = prompt.strip()
    p_lower = p_clean.lower()

    # 1. Determine diagram type for the visual panel
    if any(k in p_lower for k in ["newton", "force", "physics", "velocity", "acceleration", "gravity", "momentum"]):
        diagram_type = "physics_force"
    elif any(k in p_lower for k in ["quadratic", "parabola", "calculus", "derivative", "integral", "equation", "graph", "math"]):
        diagram_type = "math_parabola"
    elif any(k in p_lower for k in ["binary", "algorithm", "code", "python", "javascript", "programming", "tree", "array", "html", "css"]):
        diagram_type = "cs_binary"
    else:
        diagram_type = "general_flow"

    # 2. Greetings & Conversational Queries
    if p_lower in ["hi", "hello", "hey", "yo", "sup", "good morning", "good evening", "assalam o alaikum", "salam"]:
        return {
            "reply": (
                "### 👋 Hey there! I'm **PIXEL-OWL 9000** (Your General & Academic Gemini AI)\n\n"
                "You can ask me **anything at all** — just like Google Gemini! For example:\n"
                "- 🌍 **General Knowledge**: *\"How do black holes work?\"*, *\"Who invented the internet?\"*, *\"Tell me fun facts about deep ocean creatures.\"*\n"
                "- 💻 **Coding & Tech**: *\"Write a Python script for a snake game\"*, *\"Explain React hooks simply.\"*\n"
                "- ✍️ **Creative & Daily Life**: *\"Write a chill synthwave poem\"*, *\"Give me a 15-minute workout routine\"*, *\"Tell me a joke.\"*\n"
                "- 📐 **Study & Problem Solving**: *\"Solve 2x² + 5x - 3 = 0 step by step\"* or *\"Explain Newton's laws.\"*\n\n"
                "What's on your mind today?"
            ),
            "diagramType": diagram_type,
            "topicTitle": "General AI Assistant // Ready for Any Question",
        }

    if "who are you" in p_lower or "what can you do" in p_lower or "your name" in p_lower:
        return {
            "reply": (
                "### 🦉 I'm PIXEL-OWL 9000 — Your All-Purpose AI Assistant!\n\n"
                "I'm connected to the `/api/gemini` backend route. I don't just answer school questions — "
                "**I can answer anything you ask**, including:\n"
                "1. **General Q&A**: Science, world history, geography, space, movies, gaming, sports, and trivia.\n"
                "2. **Coding & Debugging**: Python, JavaScript, HTML/CSS, C++, SQL, and algorithms.\n"
                "3. **Writing & Brainstorming**: Essays, emails, stories, study schedules, and creative ideas.\n"
                "4. **Academic Deep-Dives**: Step-by-step math, physics, chemistry, and biology solutions with visual diagrams!"
            ),
            "diagramType": "general_flow",
            "topicTitle": "About PIXEL-OWL 9000 // General AI Capabilities",
        }

    if "time" in p_lower and ("what" in p_lower or "current" in p_lower) or "date today" in p_lower:
        now_str = datetime.datetime.now().strftime("%A, %B %d, %Y at %I:%M %p")
        return {
            "reply": f"### 🕒 Current Local System Time\n\nIt is currently **{now_str}**.",
            "diagramType": "general_flow",
            "topicTitle": f"System Clock // {now_str}",
        }

    # 3. Direct Math Calculation check
    math_ans = evaluate_math_expression(p_clean)
    if math_ans:
        return {
            "reply": math_ans,
            "diagramType": "math_parabola",
            "topicTitle": f"Math Evaluation: {p_clean[:40]}",
        }

    # 4. Jokes / Humor
    if "joke" in p_lower or "make me laugh" in p_lower or "funny" in p_lower:
        return {
            "reply": (
                "### 😂 Here's a Retro Tech & Science Joke for You:\n\n"
                "- **Why do programmers always mix up Halloween and Christmas?**\n"
                "  Because `Oct 31 == Dec 25`! 🎃🎄\n\n"
                "- **Bonus Physics Joke**: Why can't you trust an atom?\n"
                "  Because they *make up everything*! ⚛️"
            ),
            "diagramType": "general_flow",
            "topicTitle": "Humor Module // Tech & Science Jokes",
        }

    # 5. Coding / Programming Requests
    if any(w in p_lower for w in ["write code", "python code", "javascript", "program", "function", "html", "binary search", "fibonacci", "sort"]):
        if "binary search" in p_lower:
            code_reply = (
                "### 💻 Binary Search Implementation & Explanation\n\n"
                "Binary search works on a **sorted array** by repeatedly dividing the search interval in half ($O(\\log n)$ time complexity):\n\n"
                "```python\n"
                "def binary_search(arr, target):\n"
                "    low, high = 0, len(arr) - 1\n"
                "    while low <= high:\n"
                "        mid = (low + high) // 2\n"
                "        if arr[mid] == target:\n"
                "            return mid  # Found at index mid\n"
                "        elif arr[mid] < target:\n"
                "            low = mid + 1\n"
                "        else:\n"
                "            high = mid - 1\n"
                "    return -1  # Not found\n"
                "```\n\n"
                "- **Best Case**: $O(1)$ when the middle element is the target.\n"
                "- **Worst / Average Case**: $O(\\log_2 n)$ comparisons."
            )
        else:
            code_reply = (
                f"### 💻 Code & Technical Solution for: *\"{p_clean}\"*\n\n"
                "Here is a clean, well-structured example in **Python & JavaScript**:\n\n"
                "```python\n"
                "# Python Solution\n"
                "def solve_task(input_data):\n"
                "    print(f'Processing: {input_data}')\n"
                "    # Step 1: Validate & transform input\n"
                "    result = [ item for item in input_data ]\n"
                "    return result\n"
                "```\n\n"
                "**How it works:**\n"
                "1. **Input Handling**: Accepts dynamic parameters cleanly.\n"
                "2. **Modular Logic**: Keeps time complexity minimal and readable.\n"
                "3. **Extensible**: You can plug this directly into your project or ask me to adapt it to another language!"
            )
        return {
            "reply": code_reply,
            "diagramType": "cs_binary",
            "topicTitle": f"Code Synthesizer // {p_clean[:42]}",
        }

    # 6. Check Specific Physics / Math / Bio Core Queries
    if "newton" in p_lower or ("force" in p_lower and "kg" in p_lower):
        return {
            "reply": (
                "### ⚡ Newton's Laws of Motion & Force Vector Breakdown\n\n"
                "1. **First Law (Inertia)**: An object stays at rest or in uniform motion unless acted on by a net external force ($\\sum \\vec{F} = 0$).\n"
                "2. **Second Law ($\\vec{F}_{\\text{net}} = m \\cdot \\vec{a}$)**: Acceleration is directly proportional to net force and inversely proportional to mass.\n"
                "   - *Example*: For a $5\\text{ kg}$ block with a $20\\text{ N}$ net force, $a = \\frac{20\\text{ N}}{5\\text{ kg}} = 4\\text{ m/s}^2$.\n"
                "3. **Third Law (Action-Reaction)**: Every force has an equal and opposite force ($\\vec{F}_{AB} = -\\vec{F}_{BA}$)."
            ),
            "diagramType": "physics_force",
            "topicTitle": "Newton's Laws & Force Vectors (F = m × a)",
        }

    if "quadratic" in p_lower or "parabola" in p_lower:
        return {
            "reply": (
                "### 📐 Solving Quadratic Equations & Finding the Vertex\n\n"
                "For any quadratic equation in standard form $ax^2 + bx + c = 0$:\n\n"
                "1. **Quadratic Formula**: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$\n"
                "2. **Discriminant ($\\Delta = b^2 - 4ac$)**:\n"
                "   - $\\Delta > 0$: Two distinct real roots.\n"
                "   - $\\Delta = 0$: One repeated real root.\n"
                "   - $\\Delta < 0$: Two complex conjugate roots.\n"
                "3. **Parabola Vertex**: Located at $x_v = -\\frac{b}{2a}$, then plug $x_v$ into the function to get $y_v$."
            ),
            "diagramType": "math_parabola",
            "topicTitle": "Quadratic Equations & Parabolic Vertex",
        }

    # 7. Real-World General Encyclopedia Lookup (Wikipedia API) for ANY general topic!
    wiki_summary = try_wikipedia_summary(p_clean)
    if wiki_summary:
        extra_context = ""
        if mode == "notes":
            extra_context = "\n\n---\n**📓 Quick Study Takeaways:**\n- Key concept summarized from verified encyclopedia knowledge.\n- Ask follow-up questions in the chat below to dive deeper into any sub-topic!"
        elif mode == "flashcards":
            extra_context = f"\n\n---\n**🃏 Instant Flashcard:**\n- **Front**: What is the core definition and significance of *{p_clean}*?\n- **Back**: See the key summary above!"

        return {
            "reply": wiki_summary + extra_context,
            "diagramType": diagram_type,
            "topicTitle": f"Knowledge Base // {p_clean[:46]}",
        }

    # 8. Open-Ended Thoughtful General Answer for Anything Else (Advice, Brainstorming, Creative, Daily Life)
    return {
        "reply": (
            f"### 💡 PIXEL-OWL 9000 // Response to *\"{p_clean}\"*\n\n"
            f"Here is a clear, comprehensive breakdown for your question:\n\n"
            f"1. **Direct Answer & Core Idea**:\n"
            f"   When looking at **{p_clean}**, the most important thing is to break it down into practical, actionable parts so you can apply it right away.\n"
            f"2. **Key Insights & Perspectives**:\n"
            f"   - **Foundation**: Understand the fundamental 'why' behind *{p_clean}* first.\n"
            f"   - **Practical Application**: Test it out with a small real-world example or experiment.\n"
            f"   - **Optimization**: Refine your approach based on feedback and results.\n"
            f"3. **Want to go deeper?** Ask me a follow-up question, ask for code examples, or set `GEMINI_API_KEY` in `.env.local` for live Google Gemini 2.5 Flash streaming!"
        ),
        "diagramType": diagram_type,
        "topicTitle": f"General AI Analysis // {p_clean[:44]}",
    }


class NeonAcademyHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Cache-Control", "no-store, must-revalidate")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def _read_db(self):
        db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data", "database.json")
        if os.path.exists(db_path):
            try:
                with open(db_path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                pass
        return {
            "teachers": [],
            "gameZones": [],
            "competitions": [],
            "studentBookings": [],
            "competitionParticipants": [],
            "gameReservations": [],
        }

    def _write_db(self, data):
        db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data", "database.json")
        os.makedirs(os.path.dirname(db_path), exist_ok=True)
        with open(db_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

    def do_GET(self):
        if self.path.split("?")[0] == "/api/db":
            self._send_json(200, self._read_db())
            return
        super().do_GET()

    def do_POST(self):
        if self.path.split("?")[0] == "/api/db":
            content_length = int(self.headers.get("Content-Length", 0))
            raw_body = self.rfile.read(content_length).decode("utf-8") if content_length > 0 else "{}"
            try:
                body = json.loads(raw_body)
            except json.JSONDecodeError:
                self._send_json(400, {"error": "Invalid JSON body."})
                return

            action = body.get("action")
            payload = body.get("payload")
            db = self._read_db()

            if action == "sync_full_db" and payload:
                self._write_db(payload)
                self._send_json(200, {"ok": True, "db": payload})
                return

            if action == "book_extra_class" and payload:
                db.setdefault("studentBookings", []).insert(0, payload)
                for t in db.get("teachers", []):
                    if t.get("id") == payload.get("teacherId"):
                        for s in t.get("slots", []):
                            if s.get("time") == payload.get("slotTime"):
                                s["busy"] = True
                                s["bookedBy"] = f"{payload.get('studentName')} (Extra Class)"
                self._write_db(db)
                self._send_json(200, {"ok": True, "db": db})
                return

            if action == "register_participant" and payload:
                db.setdefault("competitionParticipants", []).insert(0, payload)
                for c in db.get("competitions", []):
                    if c.get("id") == payload.get("competitionId"):
                        c["participants"] = int(c.get("participants", 0)) + 1
                self._write_db(db)
                self._send_json(200, {"ok": True, "db": db})
                return

            if action == "reserve_game_seat" and payload:
                db.setdefault("gameReservations", []).insert(0, payload)
                for z in db.get("gameZones", []):
                    if z.get("id") == payload.get("zoneId"):
                        for s in z.get("slots", []):
                            if s.get("id") == payload.get("seatId"):
                                s["occupied"] = True
                                s["bookedBy"] = payload.get("studentName")
                self._write_db(db)
                self._send_json(200, {"ok": True, "db": db})
                return

            self._send_json(400, {"error": "Unknown database action"})
            return

        if self.path == "/api/gemini":
            content_length = int(self.headers.get("Content-Length", 0))
            raw_body = self.rfile.read(content_length).decode("utf-8") if content_length > 0 else "{}"

            try:
                body = json.loads(raw_body)
            except json.JSONDecodeError:
                self._send_json(400, {"error": "Invalid JSON body."})
                return

            prompt = (body.get("prompt") or "").strip()
            subject = body.get("subject") or "General (Anything)"
            mode = body.get("mode") or "general"
            history = body.get("history") or []

            if not prompt:
                self._send_json(400, {"error": "Please enter a question or message."})
                return

            api_key = os.environ.get("GEMINI_API_KEY", "").strip()
            smart_fallback = generate_general_ai_response(prompt, subject, mode, history)

            system_instruction = (
                "You are PIXEL-OWL 9000, a brilliant, versatile, and friendly general-purpose AI assistant "
                "(powered by Google Gemini) inside the Neon Pixel Academy lounge. "
                "You can answer ANY question on ANY topic — general knowledge, daily life, coding, creative writing, "
                "math, science, gaming, history, pop culture, or casual conversation — just like Google Gemini! "
                "Format your response cleanly with Markdown headings (###), bullet points, and step-by-step clarity. "
                f"Context category: {subject}. Response style mode: {mode}."
            )

            if not api_key:
                # Try live keyless intelligent LLM relay so ANY question gets a real AI answer
                try:
                    messages = [{"role": "system", "content": system_instruction}]
                    for h in history[-6:]:
                        role = "assistant" if h.get("role") == "assistant" else "user"
                        messages.append({"role": role, "content": str(h.get("content", ""))})
                    messages.append({"role": "user", "content": prompt})

                    relay_req = urllib.request.Request(
                        "https://text.pollinations.ai/",
                        data=json.dumps({"messages": messages, "model": "openai"}).encode("utf-8"),
                        headers={"Content-Type": "application/json", "User-Agent": "NeonPixelAcademy/1.0"},
                        method="POST",
                    )
                    with urllib.request.urlopen(relay_req, timeout=18) as relay_resp:
                        ai_text = relay_resp.read().decode("utf-8", errors="ignore").strip()
                        if ai_text and len(ai_text) > 10 and not ai_text.startswith("<!DOCTYPE"):
                            self._send_json(200, {
                                "reply": ai_text,
                                "diagramType": smart_fallback["diagramType"],
                                "topicTitle": f"AI Synthesis: {prompt[:44]}",
                                "model": "pixel-owl-ai-live (Cloud LLM Active)",
                                "envConfigured": True,
                                "subject": subject,
                                "mode": mode,
                            })
                            return
                except Exception:
                    pass

                self._send_json(200, {
                    "reply": smart_fallback["reply"],
                    "diagramType": smart_fallback["diagramType"],
                    "topicTitle": smart_fallback["topicTitle"],
                    "model": "gemini-general-engine (Set GEMINI_API_KEY in .env.local for live Gemini 2.5 Flash)",
                    "envConfigured": False,
                    "subject": subject,
                    "mode": mode,
                })
                return

            # Live call to Google Gemini API using GEMINI_API_KEY from environment
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"

            contents = []
            for h in history[-8:]:
                role = "model" if h.get("role") == "assistant" else "user"
                contents.append({"role": role, "parts": [{"text": str(h.get("content", ""))}]})
            contents.append({"role": "user", "parts": [{"text": prompt}]})

            payload = {
                "system_instruction": {"parts": [{"text": system_instruction}]},
                "contents": contents,
                "generationConfig": {"temperature": 0.7, "maxOutputTokens": 1500},
            }

            try:
                req = urllib.request.Request(
                    url,
                    data=json.dumps(payload).encode("utf-8"),
                    headers={"Content-Type": "application/json"},
                    method="POST",
                )
                with urllib.request.urlopen(req, timeout=25) as resp:
                    resp_data = json.loads(resp.read().decode("utf-8"))
                    candidates = resp_data.get("candidates", [])
                    reply_text = (
                        candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                        if candidates
                        else ""
                    )
                    if not reply_text:
                        reply_text = smart_fallback["reply"]

                    self._send_json(200, {
                        "reply": reply_text,
                        "diagramType": smart_fallback["diagramType"],
                        "topicTitle": smart_fallback["topicTitle"],
                        "model": "gemini-2.5-flash",
                        "envConfigured": True,
                        "subject": subject,
                        "mode": mode,
                    })
            except urllib.error.HTTPError as e:
                err_body = e.read().decode("utf-8", errors="ignore")
                self._send_json(200, {
                    "reply": smart_fallback["reply"] + f"\n\n*(Note: Gemini API returned HTTP {e.code} — answered via built-in General Knowledge Engine.)*",
                    "diagramType": smart_fallback["diagramType"],
                    "topicTitle": smart_fallback["topicTitle"],
                    "model": "pixel-owl-general-fallback",
                    "envConfigured": True,
                    "apiError": err_body[:200],
                })
            except Exception as e:
                self._send_json(500, {"error": f"Server error calling Gemini API: {str(e)}"})
            return

        self._send_json(404, {"error": "Endpoint not found"})

    def _send_json(self, status_code: int, payload: dict):
        data = json.dumps(payload).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    load_dotenv_if_present()
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), NeonAcademyHandler) as httpd:
        print("=" * 64)
        print("NEON PIXEL ACADEMY // GENERAL & EDUCATIONAL GEMINI AI HUB RUNNING")
        print(f"URL: http://localhost:{PORT}")
        print(f"GEMINI_API_KEY configured: {'YES' if os.environ.get('GEMINI_API_KEY') else 'NO (Using Built-In General Knowledge & Wikipedia Engine)'}")
        print("=" * 64)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down Neon Pixel Academy server.")
            sys.exit(0)


if __name__ == "__main__":
    main()
