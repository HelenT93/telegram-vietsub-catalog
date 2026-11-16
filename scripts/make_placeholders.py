"""Generate placeholder posters (800x1200 webp) for real films without poster art yet.
Design: dark navy gradient + gold frame + VI title + CN title + brand line.
Replace each file with the real poster when Helen sends it.
"""
import glob
import textwrap
from PIL import Image, ImageDraw, ImageFont

OUT = "/home/hatch/workspace/projects/telegram-vietsub-catalog/public/posters"

FILMS = [
    ("truong-trung-huong", "Trướng Trung Hương", "《帐中香》"),
    ("vi-lien-ton-bi-ta-de-mat-toi", "Vị Liên Tôn Bị Ta Để Mắt Tới", "《那位莲尊被我盯上了》"),
    ("gia-chet-tron-thoat-vuong-gia-co-chap-theo-duoi", "Giả Chết Trốn Thoát, Vương Gia Cố Chấp Theo Đuổi", "《死遁后偏执王爷追来了》"),
    ("kieu-kieu-o-re", "Kiều Kiều Ở Rể", "《赘夫娇娇》"),
    ("thu-phuc-thai-tu-dien", "Thu Phục Thái Tử Điên", "《拿捏疯太子》"),
    ("do-quan-tam", "Độ Quân Tâm", "《渡君心》"),
    ("hoa-dan-xuan-quy", "Họa Dẫn Xuân Quy", "《画引春归》"),
    ("nhat-van-khuynh-tam", "Nhất Vẫn Khuynh Tâm", "《一吻入局》"),
    ("cam-y-thien-sung", "Cẩm Y Thiên Sủng", "《锦衣偏宠》"),
    ("quan-tam-nhu-co", "Quân Tâm Như Cố", "《君心如故》"),
    ("son-ha-va-nang-ta-deu-muon", "Sơn Hà Và Nàng, Ta Đều Muốn", "《山河与你，我都要》"),
    ("vong-nha-xuan-tham", "Vọng Nhạ Xuân Thâm", "《妄惹春深》"),
    ("phu-quan-cau-nguoi-dung-dien-nua", "Phu Quân Cầu Ngươi Đừng Diễn Nữa", "《夫君求你别演了》"),
    ("co-lang-quan-thinh-tu-trong", "Cố Lang Quân, Thỉnh Tự Trọng", "《顾郎君，请自重》"),
    ("thien-vi-mat-kiem-soat", "Thiên Vị Mất Kiểm Soát", "《偏爱失控》"),
    ("phu-quan-ta-la-thai-pho", "Phu Quân Ta Là Thái Phó", "《夫君是太傅》"),
    ("tien-kiep-tuc-dich", "Tiền Kiếp Túc Địch", ""),
    ("huan-khuyen-dinh-cap", "Huấn Khuyển Đỉnh Cấp", "《顶级训犬大师》"),
    ("hy-lam-dong-cung", "Hỷ Lâm Đông Cung", "《喜临东宫》"),
]


def find_font(patterns):
    for p in patterns:
        hits = sorted(glob.glob(p))
        if hits:
            return hits[0]
    raise FileNotFoundError(patterns)


DEJAVU_B = find_font(["/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"])
DEJAVU = find_font(["/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"])
CJK = find_font([
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.otf",
    "/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc",
])

W, H = 800, 1200
NAVY_TOP = (13, 18, 38)
NAVY_BOT = (30, 27, 75)
GOLD = (201, 162, 39)
WHITE = (245, 245, 240)
MUTED = (160, 165, 190)


def wrap(draw, text, font, max_w):
    lines = []
    for chunk in text.split(", "):
        words = chunk.split(" ")
        cur = ""
        for w in words:
            trial = (cur + " " + w).strip()
            if draw.textlength(trial, font=font) <= max_w:
                cur = trial
            else:
                if cur:
                    lines.append(cur)
                cur = w
        if cur:
            lines.append(cur + ("," if chunk != text.split(", ")[-1] else ""))
    return lines


def make_poster(slug, title_vi, title_cn):
    img = Image.new("RGB", (W, H), NAVY_TOP)
    px = img.load()
    for y in range(H):
        t = y / H
        r = int(NAVY_TOP[0] + (NAVY_BOT[0] - NAVY_TOP[0]) * t)
        g = int(NAVY_TOP[1] + (NAVY_BOT[1] - NAVY_TOP[1]) * t)
        b = int(NAVY_TOP[2] + (NAVY_BOT[2] - NAVY_TOP[2]) * t)
        for x in range(W):
            px[x, y] = (r, g, b)
    d = ImageDraw.Draw(img)
    d.rectangle([28, 28, W - 28, H - 28], outline=GOLD, width=3)
    d.rectangle([40, 40, W - 40, H - 40], outline=(201, 162, 39, 90), width=1)

    f_brand = ImageFont.truetype(DEJAVU_B, 26)
    f_title = ImageFont.truetype(DEJAVU_B, 64)
    f_cn = ImageFont.truetype(CJK, 44)
    f_note = ImageFont.truetype(DEJAVU, 26)

    brand = "NIÊN KHAI TỐ CẨM"
    d.text(((W - d.textlength(brand, font=f_brand)) / 2, 90), brand, font=f_brand, fill=GOLD)

    lines = wrap(d, title_vi, f_title, W - 160)
    lh = 78
    total = len(lines) * lh
    y = (H - total) // 2 - 40
    for ln in lines:
        d.text(((W - d.textlength(ln, font=f_title)) / 2, y), ln, font=f_title, fill=WHITE)
        y += lh
    y += 30
    d.text(((W - d.textlength(title_cn, font=f_cn)) / 2, y), title_cn, font=f_cn, fill=GOLD)
    note = "Ảnh bìa đang cập nhật"
    d.text(((W - d.textlength(note, font=f_note)) / 2, H - 110), note, font=f_note, fill=MUTED)
    img.save(f"{OUT}/poster-{slug}.webp", "WEBP", quality=82)
    print("wrote", slug)


# Real poster for Nhiên Xuân (official art, already on disk)
nx = Image.open("/home/hatch/workspace/projects/nhien_xuan/work/poster.jpg").convert("RGB")
nx.thumbnail((800, 1200), Image.LANCZOS)
nx.save(f"{OUT}/poster-nhien-xuan-tuc-tru.webp", "WEBP", quality=82)
print("wrote nhien-xuan-tuc-tru (real poster)", nx.size)

for slug, vi, cn in FILMS:
    make_poster(slug, vi, cn)
print("done")
