from PIL import Image, ImageDraw, ImageFont
import math
import os


W, H = 7680, 4320
OUT = r"C:\Indian Servers\Cryptography\generated\Maths\01_Number_Systems\01_01_Concept_Map_Part_01.png"


def font(path, size):
    return ImageFont.truetype(path, size)


FONT_UI = r"C:\Windows\Fonts\segoeui.ttf"
FONT_UI_BOLD = r"C:\Windows\Fonts\segoeuib.ttf"
FONT_MATH = r"C:\Windows\Fonts\cambria.ttc"
FONT_MATH_BOLD = r"C:\Windows\Fonts\cambriab.ttf"

title_f = font(FONT_UI_BOLD, 145)
subtitle_f = font(FONT_UI, 54)
label_f = font(FONT_UI_BOLD, 50)
body_f = font(FONT_UI, 42)
small_f = font(FONT_UI, 34)
tiny_f = font(FONT_UI, 28)
math_f = font(FONT_MATH, 50)
math_big_f = font(FONT_MATH, 70)
math_small_f = font(FONT_MATH, 36)


img = Image.new("RGB", (W, H), "#f7fbff")
draw = ImageDraw.Draw(img)


def hex_to_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


top = hex_to_rgb("#f7fbff")
bottom = hex_to_rgb("#eef6f3")
for y in range(H):
    draw.line([(0, y), (W, y)], fill=lerp(top, bottom, y / H))


def rounded_box(xy, fill, outline="#c7d4e8", width=4, radius=34):
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)


def pill(xy, text, fill, outline, fg="#172033", fnt=None):
    fnt = fnt or small_f
    draw.rounded_rectangle(xy, radius=(xy[3] - xy[1]) // 2, fill=fill, outline=outline, width=3)
    bx = draw.textbbox((0, 0), text, font=fnt)
    draw.text((xy[0] + (xy[2] - xy[0] - (bx[2] - bx[0])) / 2,
               xy[1] + (xy[3] - xy[1] - (bx[3] - bx[1])) / 2 - 2), text, fill=fg, font=fnt)


def wrap(text, fnt, max_width):
    words = text.split()
    lines, line = [], ""
    for word in words:
        test = (line + " " + word).strip()
        if draw.textbbox((0, 0), test, font=fnt)[2] <= max_width:
            line = test
        else:
            if line:
                lines.append(line)
            line = word
    if line:
        lines.append(line)
    return lines


def text_block(x, y, text, fnt, fill, max_width, line_gap=14):
    yy = y
    for line in wrap(text, fnt, max_width):
        draw.text((x, yy), line, font=fnt, fill=fill)
        yy += draw.textbbox((0, 0), line, font=fnt)[3] + line_gap
    return yy


def panel(x, y, w, h, title, accent="#2d7dd2", fill="#ffffff"):
    rounded_box((x, y, x + w, y + h), fill, "#cad7e8", 5, 32)
    draw.rounded_rectangle((x, y, x + w, y + 96), radius=32, fill=accent)
    draw.rectangle((x, y + 48, x + w, y + 96), fill=accent)
    draw.text((x + 44, y + 24), title, font=label_f, fill="white")


# Header
draw.rounded_rectangle((120, 90, W - 120, 425), radius=48, fill="#10233f")
draw.text((190, 130), "NUMBER SYSTEMS", font=title_f, fill="#ffffff")
draw.text((200, 292), "Concept Map and Foundations: natural, whole, integers, rational, irrational, real and complex numbers",
          font=subtitle_f, fill="#c7e7ff")
pill((6360, 155, 7460, 245), "Class 6-10 Bridge", "#f6c85f", "#f6c85f", "#10233f", label_f)
pill((6360, 270, 7460, 350), "PART 01 / 03", "#67c7b5", "#67c7b5", "#10233f", label_f)

# Main concept map panel
panel(2200, 520, 3280, 2220, "Central Concept Map: how the sets fit", "#255f85")
cx, cy = 3840, 1640
levels = [
    (1380, 840, "#dfeafe", "C", "Complex numbers"),
    (1150, 660, "#e6f5ef", "R", "Real numbers"),
    (910, 500, "#fff3cf", "Q plus irrationals", "Rational and irrational"),
    (650, 350, "#fbe2de", "Z", "Integers"),
    (405, 220, "#dff2ff", "W", "Whole numbers"),
    (230, 125, "#e8f8d8", "N", "Natural numbers"),
]
for rx, ry, fill, sym, desc in levels:
    draw.ellipse((cx - rx, cy - ry, cx + rx, cy + ry), fill=fill, outline="#334155", width=5)
draw.text((cx - 1220, cy - 740), "C: all a + bi", font=math_big_f, fill="#203047")
draw.text((cx - 980, cy - 550), "R: points on a number line", font=math_f, fill="#203047")
draw.text((cx - 745, cy - 390), "Q: p/q, q ≠ 0", font=math_f, fill="#203047")
draw.text((cx + 210, cy - 120), "Irrational: non-repeating decimals", font=math_small_f, fill="#203047")
draw.text((cx - 470, cy - 220), "Z: ..., -2, -1, 0, 1, 2, ...", font=math_f, fill="#203047")
draw.text((cx - 255, cy - 72), "W: 0, 1, 2, 3, ...", font=math_f, fill="#203047")
draw.text((cx - 126, cy + 28), "N: 1, 2, 3, ...", font=math_f, fill="#203047")
draw.text((cx - 925, cy + 560), "Convention used here: N excludes 0, so N ⊂ W ⊂ Z ⊂ Q ⊂ R ⊂ C",
          font=math_f, fill="#10233f")

# Number line
draw.line((2600, 2480, 5080, 2480), fill="#10233f", width=9)
for i, n in enumerate(range(-4, 5)):
    x = 2600 + i * (2480 // 8)
    draw.line((x, 2430, x, 2530), fill="#10233f", width=6)
    draw.text((x - 22, 2550), str(n), font=small_f, fill="#10233f")
def mark_num(value, label, color):
    x = 2600 + (value + 4) * (2480 / 8)
    draw.ellipse((x - 18, 2462, x + 18, 2498), fill=color, outline="#10233f", width=3)
    draw.text((x - 105, 2355), label, font=math_small_f, fill=color)
mark_num(-3, "-3 ∈ Z", "#d84f4f")
mark_num(0, "0 ∈ Z,Q", "#2d7dd2")
mark_num(0.875, "7/8 ∈ Q", "#8d60bf")
mark_num(math.sqrt(2), "√2 ∉ Q", "#008f7a")
mark_num(3, "√9 = 3 ∈ N", "#3b8f2b")

# Left definitions
panel(120, 520, 1900, 1320, "Definitions and Notation Key", "#2d7dd2")
defs = [
    ("N", "Natural numbers: counting numbers 1, 2, 3, ..."),
    ("W", "Whole numbers: 0 and all natural numbers."),
    ("Z", "Integers: negatives, zero and positives."),
    ("Q", "Rational numbers: x = p/q, p,q ∈ Z, q ≠ 0, gcd(p,q)=1 in lowest terms."),
    ("R", "Real numbers: rationals and irrationals on one continuous line."),
    ("C", "Complex numbers: z = a + bi, where i² = -1."),
]
yy = 650
for sym, desc in defs:
    draw.rounded_rectangle((190, yy, 330, yy + 90), radius=22, fill="#e9f4ff", outline="#2d7dd2", width=3)
    draw.text((230, yy + 13), sym, font=math_big_f, fill="#164a76")
    text_block(370, yy + 9, desc, body_f, "#1b2a3a", 1470, 8)
    yy += 168

panel(120, 1930, 1900, 810, "Formula Map: exact statements", "#006d77")
formulas = [
    "N ⊂ W ⊂ Z ⊂ Q ⊂ R ⊂ C",
    "x = p/q, p,q ∈ Z, q ≠ 0",
    "Terminating decimal iff q = 2^m·5^n after reduction",
    "|x| = x if x ≥ 0; |x| = -x if x < 0",
    "Distance: d(a,b) = |a - b|",
]
yy = 2050
for line in formulas:
    draw.text((205, yy), "• " + line, font=math_f, fill="#10233f")
    yy += 118

# Right classification and complex plane
panel(5660, 520, 1900, 1320, "Classify the Examples", "#7b5ea7")
rows = [
    ("-3", "integer, rational, real, complex"),
    ("0", "whole, integer, rational, real"),
    ("7/8", "rational because q = 8 ≠ 0"),
    ("√2", "irrational, real"),
    ("√9", "= 3, natural under this convention"),
    ("2 + 3i", "complex, not real because imag. part ≠ 0"),
]
table_x, table_y = 5740, 665
draw.rounded_rectangle((table_x, table_y, 7485, table_y + 930), radius=20, fill="#fbfaff", outline="#d6c9f2", width=3)
draw.rectangle((table_x, table_y, 7485, table_y + 78), fill="#e8ddff")
draw.text((table_x + 35, table_y + 18), "Number", font=small_f, fill="#2a1f3d")
draw.text((table_x + 420, table_y + 18), "Smallest useful classification", font=small_f, fill="#2a1f3d")
for i, (a, b) in enumerate(rows):
    y = table_y + 82 + i * 138
    if i % 2 == 0:
        draw.rectangle((table_x, y, 7485, y + 135), fill="#ffffff")
    draw.text((table_x + 40, y + 36), a, font=math_f, fill="#10233f")
    text_block(table_x + 420, y + 22, b, small_f, "#10233f", 980, 4)

panel(5660, 1930, 1900, 810, "Complex Plane Snapshot", "#c4563d")
ox, oy = 6610, 2390
draw.line((5840, oy, 7380, oy), fill="#25364d", width=6)
draw.line((ox, 2035, ox, 2670), fill="#25364d", width=6)
draw.polygon([(7380, oy), (7335, oy - 22), (7335, oy + 22)], fill="#25364d")
draw.polygon([(ox, 2035), (ox - 22, 2080), (ox + 22, 2080)], fill="#25364d")
draw.text((7395, oy + 18), "real axis", font=tiny_f, fill="#25364d")
draw.text((ox + 30, 2035), "imaginary axis", font=tiny_f, fill="#25364d")
zx, zy = ox + 360, oy - 270
draw.line((ox, oy, zx, zy), fill="#c4563d", width=8)
draw.ellipse((zx - 20, zy - 20, zx + 20, zy + 20), fill="#c4563d")
draw.text((zx + 35, zy - 35), "z = 2 + 3i", font=math_f, fill="#8f2f22")
draw.text((5850, 2630), "conjugate z̄ = a - bi; |z| = √(a² + b²)", font=math_small_f, fill="#10233f")

# Bottom panels
panel(120, 2920, 2300, 1060, "Why It Works: decimal test", "#008f7a")
draw.text((195, 3050), "Reduced rational p/q", font=math_f, fill="#10233f")
draw.text((195, 3130), "Terminating ⇔ denominator has only factors 2 and 5", font=math_f, fill="#10233f")
draw.line((430, 3260, 2130, 3260), fill="#008f7a", width=7)
for i, txt in enumerate(["q=8=2³", "q=40=2³·5", "q=12=2²·3"]):
    x = 430 + i * 650
    draw.rounded_rectangle((x - 130, 3330, x + 390, 3510), radius=28,
                           fill="#e6f6f1" if i < 2 else "#ffece8", outline="#008f7a" if i < 2 else "#d84f4f", width=4)
    draw.text((x - 90, 3380), txt, font=math_small_f, fill="#10233f")
draw.text((195, 3610), "7/12: factor 3 remains, so the decimal repeats: 7/12 = 0.58333...", font=math_f, fill="#10233f")
draw.text((195, 3715), "Use 7/12 ≈ 0.583 only when rounded; the infinite repeating decimal is exact.", font=small_f, fill="#34465c")

panel(2640, 2920, 2300, 1060, "Misconception Clinic: wrong vs right", "#d84f4f")
draw.rounded_rectangle((2730, 3065, 3740, 3630), radius=28, fill="#fff1f0", outline="#d84f4f", width=5)
draw.text((2785, 3110), "WRONG", font=label_f, fill="#b92323")
draw.text((2785, 3215), "√9 is irrational", font=math_big_f, fill="#10233f")
draw.text((2785, 3330), "because it has a radical sign.", font=body_f, fill="#10233f")
draw.rounded_rectangle((3850, 3065, 4850, 3630), radius=28, fill="#eef9ee", outline="#3b8f2b", width=5)
draw.text((3905, 3110), "RIGHT", font=label_f, fill="#27752f")
draw.text((3905, 3215), "√9 = 3", font=math_big_f, fill="#10233f")
draw.text((3905, 3330), "so it is natural, integer, rational and real.", font=body_f, fill="#10233f")
draw.text((2730, 3735), "Memory hook: radical sign alone does not decide rational vs irrational; simplify first.", font=math_small_f, fill="#10233f")

panel(5160, 2920, 2400, 1060, "Important / Do Not Miss", "#f59e0b")
important = [
    "0 is an integer and rational: 0 = 0/1.",
    "Division by zero is undefined: q ≠ 0.",
    "Irrational decimals are non-terminating and non-repeating.",
    "Natural numbers are not closed under subtraction or division.",
    "Quick practice: place -2, 0, 3/4, √5 and 4 + i in the smallest suitable set."
]
yy = 3055
for item in important:
    draw.text((5235, yy), "• " + item, font=body_f, fill="#10233f")
    yy += 145

# Prime factor tree asset
draw.rounded_rectangle((2240, 2060, 3440, 2625), radius=30, fill="#ffffff", outline="#b7c9dd", width=4)
draw.text((2300, 2110), "Prime factor tree", font=label_f, fill="#10233f")
nodes = [("84", 2840, 2230), ("2", 2580, 2365), ("42", 3100, 2365), ("2", 2940, 2500), ("21", 3260, 2500), ("3", 3180, 2605), ("7", 3350, 2605)]
for _, x, y in nodes[1:]:
    pass
for a, b in [(0,1),(0,2),(2,3),(2,4),(4,5),(4,6)]:
    draw.line((nodes[a][1], nodes[a][2]+42, nodes[b][1], nodes[b][2]-10), fill="#63758a", width=5)
for txt, x, y in nodes:
    draw.ellipse((x-58,y-58,x+58,y+58), fill="#f0f7ff", outline="#2d7dd2", width=4)
    bb = draw.textbbox((0,0), txt, font=math_f)
    draw.text((x-(bb[2]-bb[0])/2, y-(bb[3]-bb[1])/2-5), txt, font=math_f, fill="#10233f")
draw.text((2380, 2585), "84 = 2²·3·7", font=math_f, fill="#10233f")

os.makedirs(os.path.dirname(OUT), exist_ok=True)
img.save(OUT, "PNG", optimize=True)
print(OUT)
