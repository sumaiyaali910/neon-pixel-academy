#!/usr/bin/env python3
"""
Generates the Judge Presentation & Website Screen Recording MP4 Video with Cute 8-Bit Typewriter Audio!
Output:
- C:\\Users\\DELL\\.gemini\\antigravity\\scratch\\neon-pixel-academy\\assets\\neon_pixel_academy_judge_pitch.mp4
- C:\\Users\\DELL\\.gemini\\antigravity\\brain\\fff747fc-993a-4600-9e30-8e547ccb1847\\neon_pixel_academy_judge_pitch.mp4
"""

import os
import math
import wave
import struct
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
        "duration": 7.0,
        "mode": "crt",
        "header": "SCENE 01 / 06 // DIAGNOSTIC TERMINAL [CRT-9000]",
        "badge": "[!] THE PROBLEM: WHY STUDENTS STRUGGLE TODAY",
        "lines": [
            "> SCANNING TRADITIONAL EDUCATIONAL WEBSITES...",
            "",
            "1. BORING & STRESSFUL UI: Standard portals look lifeless and drain focus.",
            "2. STUCK ON PROBLEMS ALONE: No instant visual explanations when studying.",
            "3. SLOW TEACHER ACCESS: Days of waiting just to ask a question or book a slot.",
            "4. FULL GAMING ZONES: Campus indoor/outdoor game seats fill up before class ends!"
        ]
    },
    {
        "duration": 7.5,
        "mode": "crt",
        "header": "SCENE 02 / 06 // AI ARCHITECTURE & SOLUTION [CRT-9000]",
        "badge": "[*] THE SOLUTION: NEON PIXEL ACADEMY + SECURE GEMINI AI",
        "lines": [
            "> INITIALIZING NEON PIXEL ACADEMY (NAVY & CYAN RETRO LOUNGE)...",
            "",
            "* RELAXING 16-BIT VIBE: Every click sparks chiptune SFX, neon bursts & lo-fi synth!",
            "* SECURE GEMINI AI (/api/gemini): Reads process.env.GEMINI_API_KEY on the backend.",
            "* ANSWERS ANYTHING + VISUAL DIAGRAMS: Solves any general or academic problem!",
            "* 1-CLICK TEACHER SOS & SEAT RADAR: Reach teachers or book game seats before bell!"
        ]
    },
    {
        "duration": 5.5,
        "mode": "ui_hero_ai",
        "header": "SCENE 03 / 06 // LIVE SCREEN RECORDING: HERO & GEMINI AI TERMINAL",
        "subtitle": "Asking Gemini AI a Physics Force Problem -> Live Step-by-Step Solution & Force Diagram!"
    },
    {
        "duration": 5.5,
        "mode": "ui_teachers_library",
        "header": "SCENE 04 / 06 // LIVE SCREEN RECORDING: 1-CLICK TEACHER SOS & NOTES VAULT",
        "subtitle": "Pinging Prof. Aria Vance via 1-Click SOS Beacon + Opening Study Notes, PDFs & Web Portals!"
    },
    {
        "duration": 5.5,
        "mode": "ui_flashcards_arena",
        "header": "SCENE 05 / 06 // LIVE SCREEN RECORDING: 3D FLASHCARDS & GAME SEAT PRE-BOOKING",
        "subtitle": "Flipping 3D Neon Flashcards + Pre-Booking Indoor Table Tennis Seat Before Class Ends!"
    },
    {
        "duration": 4.5,
        "mode": "crt",
        "header": "SCENE 06 / 06 // JUDGE PRESENTATION COMPLETE",
        "badge": "[+] NEON PIXEL ACADEMY // READY FOR JUDGE Q&A!",
        "lines": [
            "> ALL MODULES VERIFIED & LIVE ON VERCEL!",
            "",
            "+ Retro Navy Blue (#0a1128) & Electric Cyan (#00f5d4) Pixel Theme",
            "+ Secure /api/gemini Route (process.env.GEMINI_API_KEY)",
            "+ General & Academic AI + Visual Solution Diagrams",
            "+ 1-Click Teacher SOS, Notes/PDFs, 3D Flashcards & Game Seat Pre-Booking!"
        ]
    }
]

TOTAL_DURATION = sum(s["duration"] for s in SCENES)


def load_fonts():
    try:
        f_title = ImageFont.truetype("consolab.ttf", 21)
        f_sub = ImageFont.truetype("consola.ttf", 18)
        f_small = ImageFont.truetype("consola.ttf", 15)
    except Exception:
        f_title = ImageFont.load_default()
        f_sub = ImageFont.load_default()
        f_small = ImageFont.load_default()
    return f_title, f_sub, f_small


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
            add_tone(acc_t + i * 0.065, f, 0.12, amp=0.15, wave_type="sine")

        if s["mode"] == "crt":
            full_text = "\n".join(s["lines"])
            type_dur = s["duration"] - 1.4
            step_dt = type_dur / max(1, len(full_text))
            for c_idx, ch in enumerate(full_text):
                if ch not in (" ", "\n") and c_idx % 2 == 0:
                    t_blip = acc_t + c_idx * step_dt
                    add_tone(t_blip, pitches[c_idx % len(pitches)], 0.032, amp=0.14, wave_type="square")
        else:
            # Typing/click blips during live UI scenes
            for b in range(22):
                add_tone(acc_t + 0.3 + b * 0.08, pitches[b % len(pitches)], 0.03, amp=0.12, wave_type="square")
            # Success powerup chime mid-scene
            for i, f in enumerate([587.33, 783.99, 987.77, 1174.66]):
                add_tone(acc_t + 2.2 + i * 0.06, f, 0.12, amp=0.16, wave_type="square")

        acc_t += s["duration"]

    audio = np.clip(audio, -0.95, 0.95)
    pcm = (audio * 32767).astype(np.int16)
    with wave.open(wav_path, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(SAMPLE_RATE)
        wf.writeframes(pcm.tobytes())


def render_frame(scene, local_t, fonts, hero_img):
    f_title, f_sub, f_small = fonts
    mode = scene["mode"]

    if mode == "crt":
        img = Image.new("RGB", (WIDTH, HEIGHT), (3, 5, 11))
        draw = ImageDraw.Draw(img)
        # Yellow CRT Bezel
        draw.rectangle([34, 30, 1246, 690], outline=(255, 209, 102), width=3)
        draw.text((64, 56), scene["header"], fill=(255, 209, 102), font=f_title)
        draw.line([(64, 88), (1216, 88)], fill=(255, 209, 102), width=2)

        # Badge
        draw.rectangle([64, 112, 1040, 156], fill=(35, 32, 14), outline=(255, 230, 109), width=2)
        draw.text((80, 123), scene["badge"], fill=(255, 230, 109), font=f_title)

        full_text = "\n".join(scene["lines"])
        type_dur = scene["duration"] - 1.4
        prog = min(1.0, max(0.0, local_t / type_dur))
        char_count = int(len(full_text) * prog)
        vis_lines = full_text[:char_count].split("\n")

        y = 195
        for idx, line in enumerate(vis_lines):
            draw.text((64, y), line, fill=(255, 230, 109), font=f_sub)
            if idx == len(vis_lines) - 1 and int(local_t * 4) % 2 == 0:
                cx = 64 + len(line) * 10 + 6
                draw.rectangle([cx, y, cx + 12, y + 20], fill=(255, 230, 109))
            y += 46

        # Scanlines
        for sy in range(0, HEIGHT, 4):
            draw.line([(0, sy), (WIDTH, sy)], fill=(0, 0, 0), width=1)
        return np.array(img)

    # Website UI Screen Recording Scenes
    img = Image.new("RGB", (WIDTH, HEIGHT), (10, 17, 40))
    draw = ImageDraw.Draw(img)

    # Slim Top HUD
    draw.rectangle([0, 0, WIDTH, 48], fill=(5, 10, 24))
    draw.line([(0, 48), (WIDTH, 48)], fill=(0, 245, 212), width=2)
    draw.text((34, 14), "NEON PIXEL ACADEMY // NAVY & CYAN AI LOUNGE", fill=(0, 245, 212), font=f_title)
    draw.text((850, 14), "XP: 1385   CLASS BELL: 13:42", fill=(255, 209, 102), font=f_sub)

    if mode == "ui_hero_ai":
        # Compact Hero Banner
        draw.rectangle([34, 66, 1246, 226], fill=(16, 27, 59), outline=(0, 245, 212), width=2)
        draw.text((54, 86), "LEVEL UP YOUR BRAIN IN OUR NAVY & CYAN PIXEL SANCTUARY", fill=(255, 255, 255), font=f_title)
        draw.text((54, 122), "8-Bit Chiptune Click SFX + Neon Bursts + General & Academic Gemini AI", fill=(147, 176, 216), font=f_sub)
        draw.rectangle([54, 162, 290, 202], fill=(23, 38, 79), outline=(0, 245, 212), width=2)
        draw.text((68, 172), "SOLVE WITH AI", fill=(0, 245, 212), font=f_small)
        draw.rectangle([308, 162, 535, 202], fill=(80, 18, 52), outline=(255, 42, 133), width=2)
        draw.text((322, 172), "1-CLICK TEACHER SOS", fill=(255, 255, 255), font=f_small)

        if hero_img is not None:
            img.paste(hero_img, (930, 76))

        # Left: Gemini AI Terminal
        draw.rectangle([34, 244, 730, 625], fill=(5, 10, 24), outline=(0, 245, 212), width=2)
        draw.rectangle([36, 246, 728, 282], fill=(23, 38, 79))
        draw.text((52, 254), "PIXEL-OWL 9000 // SECURE POST /api/gemini CLIENT", fill=(0, 245, 212), font=f_small)

        prompt_s = "Explain Newtons Second Law with a 5kg block and 20N force"
        typed_n = min(len(prompt_s), int((local_t / 1.5) * len(prompt_s)))
        draw.rectangle([52, 298, 710, 336], fill=(16, 27, 59), outline=(0, 245, 212), width=1)
        draw.text((62, 308), "> " + prompt_s[:typed_n], fill=(255, 230, 109), font=f_small)

        if local_t > 1.6:
            draw.rectangle([52, 352, 710, 605], fill=(16, 27, 59), outline=(255, 209, 102), width=2)
            draw.text((68, 368), "GEMINI AI SOLUTION (process.env.GEMINI_API_KEY):", fill=(0, 245, 212), font=f_sub)
            draw.text((68, 408), "1. Free-Body Diagram: Isolate 5 kg block & net force.", fill=(230, 244, 255), font=f_small)
            draw.text((68, 442), "2. Formula: F_net = m * a  ==>  20 N = 5 kg * a", fill=(230, 244, 255), font=f_small)
            draw.text((68, 476), "3. Verified Solution: a = 20 / 5 = 4 m/s^2 (+35 XP!)", fill=(6, 214, 160), font=f_sub)
            draw.text((68, 522), "* Answers ANY general question just like Google Gemini!", fill=(255, 230, 109), font=f_small)

        # Right: Visual Solution Hologram
        draw.rectangle([750, 244, 1246, 625], fill=(5, 10, 24), outline=(0, 245, 212), width=2)
        draw.text((772, 264), "INTERACTIVE SOLUTION DIAGRAM", fill=(255, 209, 102), font=f_sub)
        draw.rectangle([890, 390, 1020, 470], fill=(16, 27, 59), outline=(0, 245, 212), width=3)
        draw.text((912, 420), "m = 5 kg", fill=(0, 245, 212), font=f_sub)
        draw.line([(1020, 430), (1165, 430)], fill=(0, 245, 212), width=4)
        draw.text((1045, 398), "F = 20 N ->", fill=(0, 245, 212), font=f_sub)
        draw.text((885, 520), "RESULT: a = 4 m/s^2", fill=(6, 214, 160), font=f_title)

    elif mode == "ui_teachers_library":
        draw.text((34, 68), "02 // TEACHER COMMAND CENTER (1-CLICK SOS & APPOINTMENTS)", fill=(0, 245, 212), font=f_title)
        cards = [
            ("Prof. Aria Vance", "Physics - Lab 404", "ONLINE - SOS READY"),
            ("Dr. Kenji Takahashi", "Computer Science - Deck 202", "ONLINE - DEBUGGING"),
            ("Prof. Elena Rostova", "Mathematics - Suite 108", "ONLINE - SOS READY")
        ]
        for i, (name, sub, st) in enumerate(cards):
            x = 34 + i * 412
            border_c = (255, 42, 133) if (i == 0 and local_t > 1.2) else (0, 245, 212)
            draw.rectangle([x, 102, x + 388, 290], fill=(16, 27, 59), outline=border_c, width=2)
            draw.text((x + 18, 118), "* " + st, fill=(6, 214, 160), font=f_small)
            draw.text((x + 18, 150), name, fill=(255, 255, 255), font=f_title)
            draw.text((x + 18, 184), sub, fill=(0, 245, 212), font=f_sub)
            draw.rectangle([x + 18, 226, x + 188, 268], fill=(255, 42, 133))
            draw.text((x + 30, 238), "1-CLICK SOS", fill=(255, 255, 255), font=f_small)
            draw.rectangle([x + 202, 226, x + 368, 268], fill=(23, 38, 79), outline=(0, 245, 212), width=2)
            draw.text((x + 220, 238), "BOOK SLOT", fill=(0, 245, 212), font=f_small)

        draw.text((34, 322), "03 // ARCADE KNOWLEDGE VAULT (STUDY NOTES, PDF BOOKS & WEBSITES)", fill=(0, 245, 212), font=f_title)
        res_list = [
            ("STUDY NOTES", "Newtonian Mechanics & Vectors Cheat Sheet", (0, 245, 212)),
            ("PDF TEXTBOOK", "Retro Illustrated Guide to Quantum Physics", (255, 209, 102)),
            ("WEB PORTAL", "PhET & VisuAlgo Interactive Simulators", (6, 214, 160))
        ]
        for i, (tag, title, col) in enumerate(res_list):
            x = 34 + i * 412
            draw.rectangle([x, 356, x + 388, 615], fill=(16, 27, 59), outline=col, width=2)
            draw.text((x + 18, 378), "[" + tag + "]", fill=col, font=f_sub)
            draw.text((x + 18, 422), title[:34], fill=(255, 255, 255), font=f_sub)
            draw.text((x + 18, 462), "Category Filtered + AI Summary Ready", fill=(147, 176, 216), font=f_small)
            draw.rectangle([x + 18, 535, x + 220, 582], fill=(23, 38, 79), outline=col, width=2)
            draw.text((x + 32, 550), "OPEN RESOURCE", fill=col, font=f_small)

    elif mode == "ui_flashcards_arena":
        draw.text((34, 68), "04 // 3D FLASHCARDS & REVISION QUIZ", fill=(0, 245, 212), font=f_title)
        flipped = local_t > 2.0
        fc_col = (255, 209, 102) if flipped else (0, 245, 212)
        draw.rectangle([34, 102, 610, 330], fill=(16, 27, 59), outline=fc_col, width=3)
        draw.text((56, 128), "3D FLASHCARD FLIPPED // SOLUTION" if flipped else "3D FLASHCARD // CLICK TO FLIP", fill=fc_col, font=f_sub)
        q_txt = "A: O(log2 N) - Halves search space each step!" if flipped else "Q: Time complexity of Binary Search on N items?"
        draw.text((56, 195), q_txt, fill=(255, 255, 255), font=f_sub)

        draw.rectangle([34, 355, 610, 615], fill=(5, 10, 24), outline=(255, 42, 133), width=2)
        draw.text((56, 378), "CYBER-QUIZ DEFENDER // WAVE 1/5   SCORE: 200", fill=(255, 209, 102), font=f_sub)
        draw.text((56, 425), "4 kg drone with 24 N net thrust. Acceleration?", fill=(255, 255, 255), font=f_small)
        draw.rectangle([56, 475, 310, 530], fill=(6, 214, 160))
        draw.text((74, 492), "6 m/s^2 (+50 XP!)", fill=(5, 10, 24), font=f_sub)

        draw.text((646, 68), "05 // PRE-BOOK GAME SEAT BEFORE CLASS!", fill=(0, 245, 212), font=f_title)
        draw.rectangle([646, 102, 1246, 615], fill=(16, 27, 59), outline=(0, 245, 212), width=2)
        draw.text((670, 128), "INDOOR & OUTDOOR ARENA SEAT RADAR", fill=(255, 209, 102), font=f_sub)
        draw.text((670, 160), "Table Tennis | VR/PS5 Lounge | 5v5 Futsal | Basketball", fill=(147, 176, 216), font=f_small)

        slots = [
            ("TT-A1", "BUSY", (255, 42, 133)),
            ("TT-A2", "BUSY", (255, 42, 133)),
            ("TT-B1", "BOOKED!" if local_t > 2.4 else "OPEN", (6, 214, 160) if local_t > 2.4 else (0, 245, 212)),
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
            draw.text((sx + 22, sy + 22), sid, fill=scol, font=f_sub)
            draw.text((sx + 22, sy + 55), st, fill=scol, font=f_small)

        draw.rectangle([670, 475, 1220, 535], fill=(255, 209, 102))
        draw.text((692, 495), "SEAT TT-B1 RESERVED BEFORE CLASS BELL RINGS!", fill=(5, 10, 24), font=f_sub)

    # Bottom Yellow Pixel Caption Bar
    draw.rectangle([34, 645, 1246, 698], fill=(3, 5, 11), outline=(255, 230, 109), width=2)
    draw.text((54, 662), scene["subtitle"], fill=(255, 230, 109), font=f_sub)

    for sy in range(0, HEIGHT, 4):
        draw.line([(0, sy), (WIDTH, sy)], fill=(0, 0, 0), width=1)

    return np.array(img)


def main():
    fonts = load_fonts()
    hero_img = None
    if os.path.exists(HERO_IMG_PATH):
        hero_img = Image.open(HERO_IMG_PATH).convert("RGB").resize((295, 138))

    wav_path = os.path.join(PROJECT_DIR, "assets", "pitch_audio.wav")
    raw_mp4_path = os.path.join(PROJECT_DIR, "assets", "pitch_video_silent.mp4")
    final_mp4_path = os.path.join(PROJECT_DIR, "assets", "neon_pixel_academy_judge_pitch.mp4")

    print("1/3 Synthesizing cute 8-bit typewriter & arcade audio track...")
    generate_audio_wav(wav_path)

    print("2/3 Rendering video frames...")
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()

    import imageio
    writer = imageio.get_writer(raw_mp4_path, fps=FPS, codec="libx264", quality=7, pixelformat="yuv420p")

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

    # Copy to public/assets and artifact folder
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
