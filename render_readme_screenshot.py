#!/usr/bin/env python3
"""
Renders a high-resolution, crystal-clear visual screenshot of the complete README.md
so the user can view, share, or submit the README screenshot directly.
"""

import os
import textwrap
from PIL import Image, ImageDraw, ImageFont

PROJECT_DIR = r"C:\Users\DELL\.gemini\antigravity\scratch\neon-pixel-academy"
ARTIFACT_DIR = r"C:\Users\DELL\.gemini\antigravity\brain\fff747fc-993a-4600-9e30-8e547ccb1847"
README_PATH = os.path.join(PROJECT_DIR, "README.md")

def load_fonts():
    try:
        f_h1 = ImageFont.truetype("consolab.ttf", 28)
        f_h2 = ImageFont.truetype("consolab.ttf", 21)
        f_h3 = ImageFont.truetype("consolab.ttf", 17)
        f_body = ImageFont.truetype("consola.ttf", 15)
        f_code = ImageFont.truetype("consola.ttf", 14)
    except Exception:
        f_h1 = f_h2 = f_h3 = f_body = f_code = ImageFont.load_default()
    return f_h1, f_h2, f_h3, f_body, f_code

def render_readme_screenshot():
    with open(README_PATH, "r", encoding="utf-8") as f:
        raw_lines = f.read().splitlines()

    f_h1, f_h2, f_h3, f_body, f_code = load_fonts()

    # Pre-process lines with styling metadata
    styled_rows = []
    in_code = False

    for line in raw_lines:
        # Strip emojis that standard Windows console fonts don't have glyphs for so there are no boxes
        clean_line = "".join(ch for ch in line if ord(ch) < 0x1F000 and ch not in "⚠️💡🛠️🚀📚🎨👥🤖✨✔")
        clean_line = clean_line.strip("\r")

        if clean_line.strip().startswith("```"):
            in_code = not in_code
            continue

        if in_code:
            styled_rows.append(("code", "  " + clean_line))
        elif clean_line.startswith("# "):
            styled_rows.append(("h1", clean_line[2:].strip()))
        elif clean_line.startswith("## "):
            styled_rows.append(("h2", clean_line[3:].strip()))
        elif clean_line.startswith("### "):
            styled_rows.append(("h3", clean_line[4:].strip()))
        elif clean_line.startswith("---"):
            styled_rows.append(("hr", ""))
        elif clean_line.startswith("> "):
            styled_rows.append(("quote", clean_line[2:].strip()))
        else:
            if not clean_line.strip():
                styled_rows.append(("spacer", ""))
            else:
                wrapped = textwrap.wrap(clean_line, width=112, subsequent_indent="    ")
                for w in wrapped:
                    styled_rows.append(("body", w.replace("**", "")))

    # Calculate total image height
    y_cursor = 95
    for rtype, _ in styled_rows:
        if rtype == "h1":
            y_cursor += 44
        elif rtype == "h2":
            y_cursor += 38
        elif rtype == "h3":
            y_cursor += 30
        elif rtype == "hr":
            y_cursor += 20
        elif rtype == "spacer":
            y_cursor += 10
        elif rtype == "code":
            y_cursor += 21
        else:
            y_cursor += 22

    total_height = y_cursor + 60
    width = 1160

    img = Image.new("RGB", (width, total_height), (10, 17, 40))
    draw = ImageDraw.Draw(img)

    # Outer GitHub / Retro Frame
    draw.rectangle([18, 18, width - 18, total_height - 18], fill=(13, 20, 42), outline=(0, 245, 212), width=3)

    # Top Window Header Bar
    draw.rectangle([21, 21, width - 21, 68], fill=(23, 38, 79))
    draw.ellipse([38, 36, 54, 52], fill=(255, 42, 133))
    draw.ellipse([64, 36, 80, 52], fill=(255, 209, 102))
    draw.ellipse([90, 36, 106, 52], fill=(0, 245, 212))
    draw.text((128, 34), "README.md — sumaiyaali910/neon-pixel-academy (Team Dream Byte)", fill=(0, 245, 212), font=f_h3)

    y = 95
    for rtype, text in styled_rows:
        if rtype == "h1":
            draw.text((48, y), text, fill=(0, 245, 212), font=f_h1)
            y += 44
        elif rtype == "h2":
            draw.rectangle([48, y + 2, 54, y + 24], fill=(255, 209, 102))
            draw.text((66, y), text, fill=(255, 209, 102), font=f_h2)
            y += 38
        elif rtype == "h3":
            draw.text((54, y), text, fill=(56, 249, 255), font=f_h3)
            y += 30
        elif rtype == "hr":
            draw.line([(48, y + 8), (width - 48, y + 8)], fill=(35, 57, 117), width=2)
            y += 20
        elif rtype == "quote":
            draw.rectangle([48, y, 52, y + 20], fill=(0, 245, 212))
            draw.text((64, y), text.replace("**", ""), fill=(147, 176, 216), font=f_body)
            y += 23
        elif rtype == "code":
            draw.rectangle([54, y - 1, width - 54, y + 19], fill=(5, 10, 24))
            draw.text((64, y), text, fill=(6, 214, 160), font=f_code)
            y += 21
        elif rtype == "spacer":
            y += 10
        else:
            col = (230, 244, 255)
            if text.strip().startswith("-") or text.strip().startswith("1.") or text.strip().startswith("2.") or text.strip().startswith("3."):
                col = (240, 248, 255)
            draw.text((54, y), text, fill=col, font=f_body)
            y += 22

    out_art = os.path.join(ARTIFACT_DIR, "readme_full_screenshot.png")
    out_proj = os.path.join(PROJECT_DIR, "assets", "readme_full_screenshot.png")
    out_pub = os.path.join(PROJECT_DIR, "public", "assets", "readme_full_screenshot.png")

    for p in [out_art, out_proj, out_pub]:
        os.makedirs(os.path.dirname(p), exist_ok=True)
        img.save(p, "PNG")

    print("Saved README screenshot:", out_art, f"({width}x{total_height})")

if __name__ == "__main__":
    render_readme_screenshot()
