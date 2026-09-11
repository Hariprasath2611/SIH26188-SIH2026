import os
from PIL import Image, ImageDraw, ImageFont

OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))
os.makedirs(OUTPUT_DIR, exist_ok=True)

def create_face_avatar(color_bg, text_label, filename):
    img = Image.new("RGB", (300, 360), color=color_bg)
    draw = ImageDraw.Draw(img)
    
    # Head contour
    draw.ellipse((80, 70, 220, 230), fill=(240, 220, 200), outline=(200, 170, 140), width=3)
    # Eyes
    draw.ellipse((110, 130, 135, 145), fill=(40, 40, 40))
    draw.ellipse((165, 130, 190, 145), fill=(40, 40, 40))
    # Mouth
    draw.arc((120, 170, 180, 200), start=0, end=180, fill=(180, 60, 60), width=4)
    # Shoulders
    draw.rectangle((50, 240, 250, 360), fill=(30, 50, 80))
    
    # Label badge
    draw.rectangle((10, 10, 290, 40), fill=(15, 23, 42))
    draw.text((20, 15), text_label, fill=(0, 242, 254))
    
    path = os.path.join(OUTPUT_DIR, filename)
    img.save(path)
    print(f"Created face: {path}")

def create_synthetic_passport():
    img = Image.new("RGB", (800, 500), color=(15, 23, 42))
    draw = ImageDraw.Draw(img)
    
    # Header security band
    draw.rectangle((0, 0, 800, 70), fill=(30, 58, 138))
    draw.text((30, 20), "REPUBLIC OF INDIA — PASSPORT", fill=(255, 255, 255))
    draw.text((650, 20), "TYPE: P", fill=(0, 242, 254))
    
    # Photo frame
    draw.rectangle((40, 100, 240, 340), fill=(240, 220, 200), outline=(0, 242, 254), width=3)
    draw.ellipse((90, 140, 190, 250), fill=(210, 180, 150))
    draw.text((60, 310), "PHOTO STAMP", fill=(100, 116, 139))
    
    # Fields
    fields = [
        ("FULL NAME:", "JOHNATHAN DOE"),
        ("DOCUMENT NO:", "P-98421057"),
        ("NATIONALITY:", "IND"),
        ("DATE OF BIRTH:", "1988-04-14"),
        ("GENDER:", "M"),
        ("ISSUE DATE:", "2021-06-10"),
        ("EXPIRY DATE:", "2031-06-09"),
        ("AUTHORITY:", "PASSPORT OFFICE DELHI")
    ]
    
    y = 100
    for label, val in fields:
        draw.text((280, y), label, fill=(148, 163, 184))
        draw.text((440, y), val, fill=(255, 255, 255))
        y += 30

    # Machine Readable Zone (MRZ)
    draw.rectangle((0, 390, 800, 500), fill=(2, 6, 23))
    mrz1 = "P<INDDOE<<JOHNATHAN<<<<<<<<<<<<<<<<<<<<<<<<<"
    mrz2 = "P984210574IND8804148M3106094<<<<<<<<<<<<<<04"
    draw.text((30, 410), mrz1, fill=(16, 185, 129))
    draw.text((30, 445), mrz2, fill=(16, 185, 129))

    path = os.path.join(OUTPUT_DIR, "preset_passport.png")
    img.save(path)
    print(f"Created passport: {path}")

def create_synthetic_license():
    img = Image.new("RGB", (800, 500), color=(15, 23, 42))
    draw = ImageDraw.Draw(img)
    
    # Header security band
    draw.rectangle((0, 0, 800, 70), fill=(6, 78, 59))
    draw.text((30, 20), "UNION OF INDIA — DRIVING LICENCE", fill=(255, 255, 255))
    draw.text((620, 20), "DL NO: DL-773419082", fill=(16, 185, 129))
    
    # Photo frame (aged document watermark)
    draw.rectangle((40, 100, 240, 340), fill=(230, 210, 190), outline=(245, 158, 11), width=3)
    draw.ellipse((90, 140, 190, 250), fill=(200, 170, 140))
    draw.text((50, 310), "[ISSUED 2012]", fill=(245, 158, 11))
    
    # Fields
    fields = [
        ("FULL NAME:", "ELENA ROSTOVA"),
        ("LICENCE NO:", "DL-773419082"),
        ("NATIONALITY:", "IND"),
        ("DATE OF BIRTH:", "1976-11-22"),
        ("GENDER:", "F"),
        ("ISSUE DATE:", "2012-03-15"),
        ("EXPIRY DATE:", "2032-03-14"),
        ("AUTHORITY:", "TRANSPORT DEPT DELHI")
    ]
    
    y = 100
    for label, val in fields:
        draw.text((280, y), label, fill=(148, 163, 184))
        draw.text((440, y), val, fill=(255, 255, 255))
        y += 30

    draw.rectangle((0, 420, 800, 500), fill=(245, 158, 11))
    draw.text((30, 450), "STATUS: VALID | AGE-AWARE ASSESSMENT REQUIRED (14 YRS GAP)", fill=(15, 23, 42))

    path = os.path.join(OUTPUT_DIR, "preset_license.png")
    img.save(path)
    print(f"Created license: {path}")

def create_synthetic_id():
    img = Image.new("RGB", (800, 500), color=(15, 23, 42))
    draw = ImageDraw.Draw(img)
    
    # Header security band (High risk red flag)
    draw.rectangle((0, 0, 800, 70), fill=(153, 27, 27))
    draw.text((30, 20), "NATIONAL IDENTITY CARD (SUSPECT TAMPERED)", fill=(255, 255, 255))
    draw.text((600, 20), "ID: NID-44019283", fill=(239, 68, 68))
    
    # Photo frame (with suspicious alteration line)
    draw.rectangle((40, 100, 240, 340), fill=(210, 190, 170), outline=(239, 68, 68), width=4)
    draw.ellipse((90, 140, 190, 250), fill=(180, 150, 120))
    draw.line((35, 95, 245, 345), fill=(239, 68, 68), width=3) # Anomaly boundary
    draw.text((50, 310), "[ALTERATION ANOMALY]", fill=(239, 68, 68))
    
    # Fields
    fields = [
        ("FULL NAME:", "MARCUS VANCE"),
        ("CARD NO:", "NID-44019283"),
        ("NATIONALITY:", "IND"),
        ("DATE OF BIRTH:", "1994-08-05"),
        ("GENDER:", "M"),
        ("ISSUE DATE:", "2020-01-10"),
        ("EXPIRY DATE:", "2024-01-09 [EXPIRED]"),
        ("AUTHORITY:", "MINISTRY OF HOME AFFAIRS")
    ]
    
    y = 100
    for label, val in fields:
        draw.text((280, y), label, fill=(148, 163, 184))
        draw.text((440, y), val, fill=(239, 68, 68) if "EXPIRED" in val else (255, 255, 255))
        y += 30

    draw.rectangle((0, 420, 800, 500), fill=(127, 29, 29))
    draw.text((30, 450), "ALERT: PHOTO REPLACEMENT ANOMALY + EXPIRED DOCUMENT", fill=(255, 255, 255))

    path = os.path.join(OUTPUT_DIR, "preset_id.png")
    img.save(path)
    print(f"Created ID card: {path}")

if __name__ == "__main__":
    create_synthetic_passport()
    create_synthetic_license()
    create_synthetic_id()
    create_face_avatar((15, 23, 42), "LIVE CAPTURE: MATCHING", "person_matching.png")
    create_face_avatar((30, 41, 59), "LIVE CAPTURE: AGED (+14YRS)", "person_aged.png")
    create_face_avatar((69, 10, 10), "LIVE CAPTURE: MISMATCH", "person_mismatch.png")
    print("All synthetic sample data generated successfully!")
