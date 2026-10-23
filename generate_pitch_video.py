#!/usr/bin/env python3
"""
Generates the Slow, Clear, Easy-to-Read Judge Presentation & Website Screen Recording MP4 Video
with Cute 8-Bit Typewriter Audio!
Output:
- C:\\Users\\DELL\\.gemini\\antigravity\\scratch\\neon-pixel-academy\\assets\\neon_pixel_academy_judge_pitch.mp4
- C:\\Users\\DELL\\.gemini\\antigravity\\brain\\fff747fc-993a-4600-9e30-8e547ccb1847\\neon_pixel_academy_judge_pitch.mp4
"""

import os
import wave
import subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import imageio_ffmpeg

WIDTH, HEIGHT = 1280, 720
FPS = 15
SAMPLE_RATE = 22050

PROJECT_DIR = r"C:\Users\DELL\.gemini\antigravity\scratch\neon-pixel-academy"
ARTIFACT_DIR = r"C:\Users\DELL\.gemini\antigravity\brain\fff747fc-993a-4600-9e30-8e547ccb1847"
HERO_IMG_PATH = os.path.join(PROJECT_DIR, "assets", "retro_solution_hero.jpg")

SCENES = [
    {
        "duration": 12.0,
        "mode": "crt",
        "header": "SCENE 01 / 06 // THE PROBLEM [CRT-9000]",
        "badge": "[!] THE PROBLEM: WHY STUDENTS STRUGGLE",
        "lines": [
            "* Learning websites are boring & stressful, and students",
            "  get stuck on questions alone with no instant visual help.",
            "",
            "* Reaching teachers takes too long, and campus game",
            "  seats fill up before class even ends!"
        ]
    },
    {
        "duration": 13.0,
        "mode": "crt",
        "header": "SCENE 02 / 06 // OUR AI SOLUTION [CRT-9000]",
        "badge": "[*] OUR SOLUTION: NEON PIXEL ACADEMY + WEBSITE AI",
        "lines": [
            "* Built-In Website Gemini AI Tutor: Answers ANY general or",
            "  study question instantly with visual solution diagrams!",
            "",
            "* All-in-One Retro Hub: 1-Click Teacher SOS, Notes & PDFs,",
            "  3D Flashcards, and Pre-Booking Game Seats before class!"
        ]
    },
    {
        "duration": 8.5,
        "mode": "ui_hero_ai",
        "header": "SCENE 03 / 06 // LIVE SCREEN RECORDING: WEBSITE AI & VISUAL SOLUTION",
        "subtitle": "Built-In Website Gemini AI solves a Physics Force problem + draws the Force Diagram!"
    },
    {
        "duration": 8.0,
        "mode": "ui_teachers_library",
        "header": "SCENE 04 / 06 // LIVE SCREEN RECORDING: 1-CLICK TEACHER SOS & NOTES VAULT",
        "subtitle": "Pinging Prof. Aria Vance via 1-Click SOS + Opening Study Notes, PDF Books & Web Portals!"
    },
    {
        "duration": 8.0,
        "mode": "ui_flashcards_arena",
        "header": "SCENE 05 / 06 // LIVE SCREEN RECORDING: 3D FLASHCARDS & GAME SEAT PRE-BOOKING",
        "subtitle": "Flipping 3D Neon Flashcards + Pre-Booking Indoor Table Tennis Seat Before Class Ends!"
    },
    {
        "duration": 7.5,
        "mode": "crt",
        "header": "SCENE 06 / 06 // JUDGE PRESENTATION COMPLETE",
        "badge": "[+] NEON PIXEL ACADEMY // READY FOR JUDGE Q&A!",
        "lines": [
            "+ Built-In Website Gemini AI (General & Study Q&A + Diagrams)",
            "",
            "+ 1-Click Teacher SOS, Notes/PDFs, Flashcards & Seat Booking!"
        ]
    }
]

TOTAL_DURATION = sum(s["duration"] for s in SCENES)


def load_fonts():
    try:
        f_title = ImageFont.truetype("consolab.ttf", 26)
        f_sub = ImageFont.truetype("consolab.ttf", 23)
        f_body = ImageFont.truetype("consolab.ttf", 20)
        f_small = ImageFont.truetype("consola.ttf", 17)
    except Exception:
        f_title = ImageFont.load_default()
        f_sub = ImageFont.load_default()
        f_body = ImageFont.load_default()
        f_small = ImageFont.load_default()
    return f_title, f_sub, f_body, f_small


def generate_audio_wav(wav_path: str):
    num_samples = int(TOTAL_DURATION * SAMPLE_RATE)
    audio = np.zeros(num_samples, dtype=np.float32)

    def add_tone(start_t, freq, dur, amp=0.18, wave_type="square"):
        s_idx = int(start_t * SAMPLE_RATE)
        e_idx = min(num_samples, int((start_t + dur) * SAMPLE_RATE))
        if s_idx >= num_samples or e_idx <= s_idx:
            return
        t_arr = np.arange(e_idx - s_idx) / SAMPLE_RATE
        env = np.exp(-t_arr * (18.0 / max(dur, 0.02)))
        if wave_type == "square":
            sig = np.sign(np.sin(2 * np.pi * freq * t_arr))
        else:
            sig = np.sin(2 * np.pi * freq * t_arr)
        audio[s_idx:e_idx] += amp * env * sig

    pitches = [720, 790, 860, 760, 910, 820]
    acc_t = 0.0
    for s in SCENES:
        # Scene transition chime
        for i, f in enumerate([523.25, 659.25, 783.99, 1046.5]):
            add_tone(acc_t + i * 0.07, f, 0.14, amp=0.15, wave_type="sine")

        if s["mode"] == "crt":
            full_text = "\n".join(s["lines"])
            # Leave 4.5 full seconds after typing finishes so the viewer can read easily!
            type_dur = max(2.5, s["duration"] - 4.5)
            step_dt = type_dur / max(1, len(full_text))
            for c_idx, ch in enumerate(full_text):
                if ch not in (" ", "\n") and c_idx % 2 == 0:
                    t_blip = acc_t + c_idx * step_dt
                    add_tone(t_blip, pitches[c_idx % len(pitches)], 0.034, amp=0.14, wave_type="square")
        else:
            for b in range(25):
                add_tone(acc_t + 0.4 + b * 0.10, pitches[b % len(pitches)], 0.032, amp=0.12, wave_type="square")
            for i, f in enumerate([587.33, 783.99, 987.77, 1174.66]):
                add_tone(acc_t + 3.2 + i * 0.07, f, 0.14, amp=0.16, wave_type="square")

        acc_t += s["duration"]

    audio = np.clip(audio, -0.95, 0.95)
    pcm = (audio * 32767).astype(np.int16)
    with wave.open(wav_path, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(SAMPLE_RATE)
        wf.writeframes(pcm.tobytes())


def render_frame(scene, local_t, fonts, hero_img):
    f_title, f_sub, f_body, f_small = fonts
    mode = scene["mode"]

    if mode == "crt":
        # Clean, Crystal-Clear Black CRT Screen (No heavy dark stripes hiding the text!)
        img = Image.new("RGB", (WIDTH, HEIGHT), (4, 6, 12))
        draw = ImageDraw.Draw(img)

        # Very faint, non-intrusive background monitor lines Drawn BEFORE text so text stays 100% sharp
        for sy in range(0, HEIGHT, 12):
            draw.line([(44, sy), (1236, sy)], fill=(10, 14, 24), width=1)

        # Yellow CRT Outer Frame
        draw.rectangle([40, 34, 1240, 686], outline=(255, 209, 102), width=4)
        draw.text((76, 62), scene["header"], fill=(255, 209, 102), font=f_title)
        draw.line([(76, 100), (1204, 100)], fill=(255, 209, 102), width=2)

        # Stage Badge
        draw.rectangle([76, 128, 1080, 182], fill=(38, 34, 12), outline=(255, 230, 109), width=2)
        draw.text((96, 142), scene["badge"], fill=(255, 230, 109), font=f_title)

        # Relaxed Typewriter with 4.5s reading hold
        full_text = "\n".join(scene["lines"])
        type_dur = max(2.5, scene["duration"] - 4.5)
        prog = min(1.0, max(0.0, local_t / type_dur))
        char_count = int(len(full_text) * prog)
        vis_lines = full_text[:char_count].split("\n")

        y = 240
        for idx, line in enumerate(vis_lines):
            # Subtle black drop shadow + bright crisp yellow text
            draw.text((78, y + 2), line, fill=(0, 0, 0), font=f_sub)
            draw.text((76, y), line, fill=(255, 235, 115), font=f_sub)
            if idx == len(vis_lines) - 1 and int(local_t * 3) % 2 == 0:
                cx = 76 + len(line) * 13 + 8
                draw.rectangle([cx, y + 2, cx + 15, y + 26], fill=(255, 235, 115))
            y += 62

        return np.array(img)

    # Website UI Screen Recording Scenes (Crystal-Clear Text)
    img = Image.new("RGB", (WIDTH, HEIGHT), (10, 17, 40))
    draw = ImageDraw.Draw(img)

    # Slim Top HUD
    draw.rectangle([0, 0, WIDTH, 48], fill=(5, 10, 24))
    draw.line([(0, 48), (WIDTH, 48)], fill=(0, 245, 212), width=2)
    draw.text((34, 12), "NEON PIXEL ACADEMY // NAVY & CYAN AI LOUNGE", fill=(0, 245, 212), font=f_body)
    draw.text((840, 12), "XP: 1385   CLASS BELL: 13:42", fill=(255, 209, 102), font=f_body)

    if mode == "ui_hero_ai":
        draw.rectangle([34, 64, 1246, 224], fill=(16, 27, 59), outline=(0, 245, 212), width=2)
        draw.text((54, 82), "LEVEL UP YOUR BRAIN IN OUR NAVY & CYAN PIXEL SANCTUARY", fill=(255, 255, 255), font=f_body)
        draw.text((54, 118), "8-Bit Chiptune Click SFX + Neon Bursts + Built-In Website Gemini AI", fill=(147, 176, 216), font=f_small)
        draw.rectangle([54, 158, 290, 200], fill=(23, 38, 79), outline=(0, 245, 212), width=2)
        draw.text((68, 170), "SOLVE WITH AI", fill=(0, 245, 212), font=f_small)
        draw.rectangle([308, 158, 545, 200], fill=(80, 18, 52), outline=(255, 42, 133), width=2)
        draw.text((322, 170), "1-CLICK TEACHER SOS", fill=(255, 255, 255), font=f_small)

        if hero_img is not None:
            img.paste(hero_img, (930, 74))

        # Left: Website Gemini AI Terminal
        draw.rectangle([34, 242, 730, 625], fill=(5, 10, 24), outline=(0, 245, 212), width=2)
        draw.rectangle([36, 244, 728, 282], fill=(23, 38, 79))
        draw.text((52, 253), "PIXEL-OWL 9000 // BUILT-IN WEBSITE GEMINI AI", fill=(0, 245, 212), font=f_small)

        prompt_s = "Explain Newtons Second Law with a 5kg block and 20N force"
        typed_n = min(len(prompt_s), int((local_t / 2.2) * len(prompt_s)))
        draw.rectangle([52, 296, 710, 336], fill=(16, 27, 59), outline=(0, 245, 212), width=1)
        draw.text((62, 306), "> " + prompt_s[:typed_n], fill=(255, 230, 109), font=f_small)

        if local_t > 2.3:
            draw.rectangle([52, 350, 710, 608], fill=(16, 27, 59), outline=(255, 209, 102), width=2)
            draw.text((68, 366), "WEBSITE GEMINI AI SOLUTION (/api/gemini):", fill=(0, 245, 212), font=f_body)
            draw.text((68, 408), "1. Free-Body Diagram: Isolate 5 kg block & net force.", fill=(230, 244, 255), font=f_small)
            draw.text((68, 444), "2. Formula: F_net = m * a  ==>  20 N = 5 kg * a", fill=(230, 244, 255), font=f_small)
            draw.text((68, 480), "3. Verified Solution: a = 20 / 5 = 4 m/s^2 (+35 XP!)", fill=(6, 214, 160), font=f_body)
            draw.text((68, 528), "* Answers ANY general or study question instantly!", fill=(255, 230, 109), font=f_small)

        # Right: Visual Solution Hologram
        draw.rectangle([750, 242, 1246, 625], fill=(5, 10, 24), outline=(0, 245, 212), width=2)
        draw.text((772, 264), "AI VISUAL SOLUTION DIAGRAM", fill=(255, 209, 102), font=f_body)
        draw.rectangle([890, 390, 1020, 470], fill=(16, 27, 59), outline=(0, 245, 212), width=3)
        draw.text((908, 420), "m = 5 kg", fill=(0, 245, 212), font=f_body)
        draw.line([(1020, 430), (1165, 430)], fill=(0, 245, 212), width=4)
        draw.text((1040, 395), "F = 20 N ->", fill=(0, 245, 212), font=f_body)
        draw.text((875, 520), "RESULT: a = 4 m/s^2", fill=(6, 214, 160), font=f_sub)

    elif mode == "ui_teachers_library":
        draw.text((34, 68), "02 // TEACHER COMMAND CENTER (1-CLICK SOS & APPOINTMENTS)", fill=(0, 245, 212), font=f_sub)
        cards = [
            ("Prof. Aria Vance", "Physics - Lab 404", "ONLINE - SOS READY"),
            ("Dr. Kenji Takahashi", "Computer Science - Deck 202", "ONLINE - DEBUGGING"),
            ("Prof. Elena Rostova", "Mathematics - Suite 108", "ONLINE - SOS READY")
        ]
        for i, (name, sub, st) in enumerate(cards):
            x = 34 + i * 412
            border_c = (255, 42, 133) if (i == 0 and local_t > 1.5) else (0, 245, 212)
            draw.rectangle([x, 104, x + 388, 292], fill=(16, 27, 59), outline=border_c, width=2)
            draw.text((x + 18, 120), "* " + st, fill=(6, 214, 160), font=f_small)
            draw.text((x + 18, 152), name, fill=(255, 255, 255), font=f_body)
            draw.text((x + 18, 186), sub, fill=(0, 245, 212), font=f_small)
            draw.rectangle([x + 18, 228, x + 188, 270], fill=(255, 42, 133))
            draw.text((x + 30, 240), "1-CLICK SOS", fill=(255, 255, 255), font=f_small)
            draw.rectangle([x + 202, 228, x + 368, 270], fill=(23, 38, 79), outline=(0, 245, 212), width=2)
            draw.text((x + 220, 240), "BOOK SLOT", fill=(0, 245, 212), font=f_small)

        draw.text((34, 324), "03 // ARCADE KNOWLEDGE VAULT (STUDY NOTES, PDF BOOKS & WEBSITES)", fill=(0, 245, 212), font=f_sub)
        res_list = [
            ("STUDY NOTES", "Newtonian Mechanics & Vectors Cheat Sheet", (0, 245, 212)),
            ("PDF TEXTBOOK", "Retro Illustrated Guide to Quantum Physics", (255, 209, 102)),
            ("WEB PORTAL", "PhET & VisuAlgo Interactive Simulators", (6, 214, 160))
        ]
        for i, (tag, title, col) in enumerate(res_list):
            x = 34 + i * 412
            draw.rectangle([x, 360, x + 388, 615], fill=(16, 27, 59), outline=col, width=2)
            draw.text((x + 18, 382), "[" + tag + "]", fill=col, font=f_body)
            draw.text((x + 18, 426), title[:34], fill=(255, 255, 255), font=f_small)
            draw.text((x + 18, 466), "Category Filtered + AI Summary Ready", fill=(147, 176, 216), font=f_small)
            draw.rectangle([x + 18, 535, x + 220, 582], fill=(23, 38, 79), outline=col, width=2)
            draw.text((x + 32, 550), "OPEN RESOURCE", fill=col, font=f_small)

    elif mode == "ui_flashcards_arena":
        draw.text((34, 68), "04 // 3D FLASHCARDS & REVISION QUIZ", fill=(0, 245, 212), font=f_sub)
        flipped = local_t > 2.8
        fc_col = (255, 209, 102) if flipped else (0, 245, 212)
        draw.rectangle([34, 104, 610, 330], fill=(16, 27, 59), outline=fc_col, width=3)
        draw.text((56, 130), "3D FLASHCARD FLIPPED // SOLUTION" if flipped else "3D FLASHCARD // CLICK TO FLIP", fill=fc_col, font=f_body)
        q_txt = "A: O(log2 N) - Halves search space each step!" if flipped else "Q: Time complexity of Binary Search on N items?"
        draw.text((56, 195), q_txt, fill=(255, 255, 255), font=f_small)

        draw.rectangle([34, 355, 610, 615], fill=(5, 10, 24), outline=(255, 42, 133), width=2)
        draw.text((56, 378), "CYBER-QUIZ DEFENDER // WAVE 1/5   SCORE: 200", fill=(255, 209, 102), font=f_body)
        draw.text((56, 425), "4 kg drone with 24 N net thrust. Acceleration?", fill=(255, 255, 255), font=f_small)
        draw.rectangle([56, 475, 310, 530], fill=(6, 214, 160))
        draw.text((74, 492), "6 m/s^2 (+50 XP!)", fill=(5, 10, 24), font=f_body)

        draw.text((646, 68), "05 // PRE-BOOK GAME SEAT BEFORE CLASS!", fill=(0, 245, 212), font=f_sub)
        draw.rectangle([646, 104, 1246, 615], fill=(16, 27, 59), outline=(0, 245, 212), width=2)
        draw.text((670, 128), "INDOOR & OUTDOOR ARENA SEAT RADAR", fill=(255, 209, 102), font=f_body)
        draw.text((670, 162), "Table Tennis | VR/PS5 Lounge | 5v5 Futsal | Basketball", fill=(147, 176, 216), font=f_small)

        slots = [
            ("TT-A1", "BUSY", (255, 42, 133)),
            ("TT-A2", "BUSY", (255, 42, 133)),
            ("TT-B1", "BOOKED!" if local_t > 3.2 else "OPEN", (6, 214, 160) if local_t > 3.2 else (0, 245, 212)),
            ("TT-B2", "OPEN", (0, 245, 212)),
            ("VR-01", "BUSY", (255, 42, 133)),
            ("VR-02", "OPEN", (0, 245, 212)),
            ("FT-01", "OPEN", (0, 245, 212)),
            ("BB-01", "BOOKED!", (6, 214, 160)),
        ]
        for idx, (sid, st, scol) in enumerate(slots):
            c = idx % 4
            r = idx // 4
            sx = 670 + c * 138
            sy = 205 + r * 115
            draw.rectangle([sx, sy, sx + 125, sy + 95], fill=(5, 10, 24), outline=scol, width=2)
            draw.text((sx + 22, sy + 22), sid, fill=scol, font=f_body)
            draw.text((sx + 22, sy + 55), st, fill=scol, font=f_small)

        draw.rectangle([670, 475, 1220, 535], fill=(255, 209, 102))
        draw.text((692, 495), "SEAT TT-B1 RESERVED BEFORE CLASS BELL RINGS!", fill=(5, 10, 24), font=f_body)

    # Bottom Yellow Pixel Caption Bar
    draw.rectangle([34, 645, 1246, 698], fill=(3, 5, 11), outline=(255, 230, 109), width=2)
    draw.text((54, 661), scene["subtitle"], fill=(255, 230, 109), font=f_body)

    return np.array(img)


def main():
    fonts = load_fonts()
    hero_img = None
    if os.path.exists(HERO_IMG_PATH):
        hero_img = Image.open(HERO_IMG_PATH).convert("RGB").resize((295, 138))

    wav_path = os.path.join(PROJECT_DIR, "assets", "pitch_audio.wav")
    raw_mp4_path = os.path.join(PROJECT_DIR, "assets", "pitch_video_silent.mp4")
    final_mp4_path = os.path.join(PROJECT_DIR, "assets", "neon_pixel_academy_judge_pitch.mp4")

    print("1/3 Synthesizing relaxed 8-bit typewriter & arcade audio track...")
    generate_audio_wav(wav_path)

    print("2/3 Rendering crisp, slow-paced video frames...")
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()

    import imageio
    writer = imageio.get_writer(raw_mp4_path, fps=FPS, codec="libx264", quality=8, pixelformat="yuv420p")

    for s in SCENES:
        n_frames = int(s["duration"] * FPS)
        for f_idx in range(n_frames):
            local_t = f_idx / FPS
            frame = render_frame(s, local_t, fonts, hero_img)
            writer.append_data(frame)
    writer.close()

    print("3/3 Multiplexing video and 8-bit audio into final MP4...")
    cmd = [
        ffmpeg_exe,
        "-y",
        "-i", raw_mp4_path,
        "-i", wav_path,
        "-c:v", "copy",
        "-c:a", "aac",
        "-b:a", "128k",
        "-shortest",
        final_mp4_path,
    ]
    subprocess.run(cmd, check=True)

    pub_mp4 = os.path.join(PROJECT_DIR, "public", "assets", "neon_pixel_academy_judge_pitch.mp4")
    art_mp4 = os.path.join(ARTIFACT_DIR, "neon_pixel_academy_judge_pitch.mp4")
    for dst in [pub_mp4, art_mp4]:
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        with open(final_mp4_path, "rb") as fsrc, open(dst, "wb") as fdst:
            fdst.write(fsrc.read())

    if os.path.exists(raw_mp4_path):
        os.remove(raw_mp4_path)
    if os.path.exists(wav_path):
        os.remove(wav_path)

    print("DONE! Saved MP4 to:", final_mp4_path)


if __name__ == "__main__":
    main()
