#!/usr/bin/env python3
"""Generate Multitrade Building Hire product catalogue PDF with images."""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether, Image as RLImage
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.lib.utils import ImageReader
from PIL import Image as PILImage
import os

# Brand colours
NAVY = HexColor("#0f1b3d")
GOLD = HexColor("#D4A843")
GOLD_LIGHT = HexColor("#F5EDD6")
GRAY_200 = HexColor("#e5e7eb")
GRAY_500 = HexColor("#6b7280")
GRAY_700 = HexColor("#374151")

PAGE_W, PAGE_H = A4
MARGIN = 18 * mm
CONTENT_W = PAGE_W - 2 * MARGIN

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_DIR = os.path.join(BASE, "public", "images")

# ── Styles ──
sProductName = ParagraphStyle("ProdName", fontName="Helvetica-Bold", fontSize=12, textColor=NAVY, leading=15)
sProductDesc = ParagraphStyle("ProdDesc", fontName="Helvetica", fontSize=8.5, textColor=GRAY_700, leading=12)
sFeature = ParagraphStyle("Feature", fontName="Helvetica", fontSize=7.5, textColor=GRAY_700, leading=10)
sCatTitle = ParagraphStyle("CatTitle", fontName="Helvetica-Bold", fontSize=20, textColor=NAVY, leading=26, spaceAfter=4)
sCatDesc = ParagraphStyle("CatDesc", fontName="Helvetica", fontSize=9, textColor=GRAY_500, leading=13)
sInclusion = ParagraphStyle("Incl", fontName="Helvetica", fontSize=7, textColor=GRAY_500, leading=9)


def get_image(rel_path, width, height):
    """Return an RLImage if the file exists, else None."""
    full = os.path.join(IMG_DIR, rel_path)
    if os.path.exists(full):
        try:
            img = PILImage.open(full)
            img.verify()
            return RLImage(full, width=width, height=height, kind='proportional')
        except Exception:
            pass
    return None


# ── Product Data (dimensions in cm) ──
CATEGORIES = [
    {
        "name": "Crib Rooms & Lunch Rooms",
        "desc": "Comfortable, fully equipped break facilities for crews of 5 to 2,000. Standard, self-contained, and mobile options.",
        "products": [
            {
                "name": "12x3m Crib Room", "size": "1200 x 300cm", "capacity": "Up to 20 persons",
                "badge": "POPULAR", "img": "products/12x3-crib-room/1.jpg",
                "desc": "Spacious break facility with dual AC, full kitchenette, and commercial fit-out. Seating for 20 workers.",
                "features": ["2 x 3.9kW TECO reverse cycle AC", "Full kitchenette with stainless steel sink", "LED lighting throughout", "75mm steel frame, Colorbond cladding", "Commercial-grade vinyl flooring", "Lockable switchboard with RCD"],
                "inclusions": ["2 x 240L Fridge", "Microwave", "Pie Warmer (50 Pie)", "5 x Crib Tables", "24 x Crib Chairs", "Instant Boiling Water Unit", "First Aid Kit", "Fire Extinguisher", "Smoke Detectors"],
            },
            {
                "name": "6x3m Crib Room", "size": "600 x 300cm", "capacity": "Up to 10 persons",
                "img": "products/6x3-crib/1.jpg",
                "desc": "Versatile portable break space with TECO AC, kitchenette, and insulated walls.",
                "features": ["1 x 3.9kW TECO reverse cycle AC", "1200mm kitchenette with sink", "Commercial vinyl flooring", "Insulated walls & ceiling", "Seating for 10"],
                "inclusions": ["240L Fridge", "Microwave", "Pie Warmer", "3 x Crib Tables", "12 x Chairs", "Instant Boiling Water Unit", "First Aid Kit"],
            },
            {
                "name": "12x3m Mobile Crib Room", "size": "1250 x 300cm", "capacity": "Up to 20 persons",
                "badge": "SELF-CONTAINED", "img": "products/12x3-mobile-crib-room/1.jpg",
                "desc": "Fully transportable, self-sufficient facility on heavy-duty trailer with onboard generator and water.",
                "features": ["11.2kVA Kubota mine-spec generator", "2 x 1000L fresh water tanks", "Grey water tank system", "2 x 3.5kW reverse cycle AC", "Full kitchenette with dual sinks", "Air brakes & dual axles"],
                "inclusions": ["2 x 240L Fridges", "Microwave", "Pie Warmer", "5 x Tables", "20 x Chairs", "Pressure Pump System", "First Aid Kit"],
            },
            {
                "name": "6.6x3m Self-Contained Crib", "size": "660 x 300cm", "capacity": "Up to 8 persons",
                "badge": "SELF-CONTAINED", "img": "products/66x3m-self-contained-crib/1.jpg",
                "desc": "Compact self-contained break facility. Ready to work straight off the truck with onboard power and water.",
                "features": ["Onboard generator", "230L fresh water + 230L grey water", "Pressure pump system", "Reverse cycle AC", "Kitchen with sink", "Storage area"],
                "inclusions": ["240L Fridge", "Microwave", "Pie Warmer", "2 x Tables", "8 x Chairs", "Boiling Water Unit"],
            },
            {
                "name": "7.2x3m Self-Contained Crib", "size": "720 x 300cm", "capacity": "Up to 10 persons",
                "badge": "SELF-CONTAINED", "img": "products/72x3m-self-contained-crib/1.jpg",
                "desc": "Standalone crib with integrated bathroom. No external connections required.",
                "features": ["6kVA Kubota mine-spec generator", "Integrated shower, toilet & basin", "230L water + grey water system", "Reverse cycle AC", "Full kitchen facilities"],
                "inclusions": ["240L Fridge", "Microwave", "Pie Warmer", "2 x Tables", "8 x Chairs", "Shower & Toilet"],
            },
            {
                "name": "9.6x3m Living Quarters", "size": "960 x 300cm", "capacity": "1-2 persons",
                "badge": "ACCOMMODATION", "img": "products/96x3m-living-quarters/1.jpg",
                "desc": "Self-contained remote accommodation with private bedroom, ensuite, and kitchen/living area.",
                "features": ["Private bedroom with wardrobe", "Ensuite bathroom", "Full kitchen/living area", "Split system AC", "Fully insulated"],
                "inclusions": ["Bed Frame & Mattress", "Wardrobe", "240L Fridge", "Microwave", "Table & Chairs", "Vanity Basin"],
            },
        ]
    },
    {
        "name": "Site Offices",
        "desc": "Professional portable offices from compact 3x3m to large 12x3m open-plan workspaces, gatehouses, and container offices.",
        "products": [
            {
                "name": "12x3m Office", "size": "1200 x 300cm", "capacity": "5-6 desks",
                "badge": "POPULAR", "img": "products/12x3-office/1.jpg",
                "desc": "Large open-plan or partitioned office with full electrical, data, and climate control.",
                "features": ["2 x reverse cycle AC units", "Cat6 data cabling provisions", "GPOs at each workstation", "36sqm flexible office space", "Lockable switchboard with RCD"],
                "inclusions": ["5-6 Desks", "5-6 Chairs", "2 x Filing Cabinets", "Noticeboard & Whiteboard", "First Aid Kit"],
            },
            {
                "name": "6x3m Office", "size": "600 x 300cm", "capacity": "2-3 desks",
                "img": "products/6x3-office/1.jpg",
                "desc": "Mid-size office ideal for site supervisors and project coordinators. 18sqm usable space.",
                "features": ["1 x reverse cycle AC", "18sqm usable office space", "Lockable switchboard with RCD", "Room for filing & storage"],
                "inclusions": ["2-3 Desks", "2-3 Chairs", "Filing Cabinet", "Noticeboard", "First Aid Kit"],
            },
            {
                "name": "6x3m Supervisor Office", "size": "600 x 300cm", "capacity": "1-2 desks",
                "img": "products/6x3m-supervisor-office/1.jpg",
                "desc": "Dedicated supervisor workspace with ergonomic furniture, storage, and professional fit-out.",
                "features": ["Private supervisor workspace", "Ergonomic desk & chair", "Built-in storage & filing", "Reverse cycle AC"],
                "inclusions": ["Executive Desk", "Ergonomic Chair", "Filing Cabinet", "Bookshelf", "Whiteboard"],
            },
            {
                "name": "3x3m Office", "size": "300 x 300cm", "capacity": "1-2 desks",
                "img": "products/3x3-office/1.jpg",
                "desc": "Compact single-person office for gatekeepers and security. 9sqm footprint, quick to deploy.",
                "features": ["9sqm compact footprint", "Full electrical + AC", "Crane-liftable for fast deploy", "Reverse cycle AC"],
                "inclusions": ["Desk", "Chair", "LED Lighting", "First Aid Kit"],
            },
            {
                "name": "20ft Container Office", "size": "606 x 244cm", "capacity": "2-3 desks",
                "img": "products/20ft-container-office/1.jpg",
                "desc": "Converted Corten steel shipping container with full office fit-out. Superior security.",
                "features": ["Heavy-gauge Corten steel", "Weather resistant construction", "Full office fit-out", "Easy transport on standard gear"],
                "inclusions": ["2-3 Desks", "2-3 Chairs", "LED Lighting", "AC", "First Aid Kit"],
            },
            {
                "name": "Gatehouse", "size": "1050 x 340cm", "capacity": "1-2 staff",
                "img": "products/gatehouse/1.jpg",
                "desc": "Purpose-built security and access control building. Large windows, service counter, boom gate ready.",
                "features": ["Large windows for visibility", "Service counter for sign-in", "Pre-wired for boom gate/CCTV", "Kitchenette included"],
                "inclusions": ["Security Workstation", "Chair", "Service Counter", "Kitchenette", "Data Provisions"],
            },
        ]
    },
    {
        "name": "Ablutions & Toilets",
        "desc": "Portable toilet and shower blocks for worksites. Standard, solar-powered, and accessible units.",
        "products": [
            {"name": "6x3m Toilet Block", "size": "600 x 300cm", "capacity": "High traffic", "img": "products/6x3-toilet/1.jpg",
             "desc": "Multiple cubicles, urinals, and hand basins. Male/female configurations available.",
             "features": ["Multiple cubicles & urinals", "Hand basins throughout", "Male/female configs", "Commercial construction"]},
            {"name": "3.6x2.4m Toilet", "size": "360 x 240cm", "capacity": "Medium traffic", "img": "products/36x24-toilet/1.jpg",
             "desc": "Compact toilet unit ideal for smaller sites and construction projects.",
             "features": ["Compact footprint", "Complete sanitary facilities", "Quick deploy"]},
            {"name": "Solar Toilet", "size": "545 x 240cm", "capacity": "Medium traffic", "badge": "SOLAR", "img": "products/solar-toilet/1.jpg",
             "desc": "Completely solar-powered. 2 pans, 2 hand basins. No utility connections required.",
             "features": ["100% solar powered", "2 pans + 2 hand basins", "No utility connections", "Off-grid operation"]},
            {"name": "4.2x3m Shower Block", "size": "420 x 300cm", "capacity": "Crew showers", "img": "products/42x3m-ablution/1.jpg",
             "desc": "Dedicated shower facility with hot water system for end-of-shift amenity.",
             "features": ["Hot water system", "Multiple showers", "End-of-shift amenity"]},
        ]
    },
    {
        "name": "Building Complexes",
        "desc": "Multi-unit modular complexes combining offices, crib rooms, and ablutions into integrated site facilities.",
        "products": [
            {"name": "12x6m Complex", "size": "1200 x 600cm (72sqm)", "capacity": "Up to 24 persons", "badge": "POPULAR", "img": "products/12x6m-complex/1.jpg",
             "desc": "Two 12x3m modules combined. Open plan, partitioned, or mixed use.",
             "features": ["72sqm total area", "Flexible layout options", "Open-plan or partitioned", "Mixed use capable"]},
            {"name": "12x9m Complex", "size": "1200 x 900cm (108sqm)", "capacity": "Up to 36 persons",
             "desc": "Three-module facility for major projects. Training rooms, offices, and break areas.",
             "features": ["108sqm total area", "Training rooms + offices", "Break areas included", "Major project ready"]},
            {"name": "Custom Complex", "size": "Custom", "capacity": "Unlimited", "badge": "CUSTOM",
             "desc": "Bespoke configurations designed and built to exact specifications. Any size, any layout.",
             "features": ["Custom sizing", "Designed to spec", "Unlimited scalability", "Full project support"]},
        ]
    },
    {
        "name": "Shipping Containers",
        "desc": "General purpose, dangerous goods, and specialist containers in 10ft, 20ft, and 40ft sizes.",
        "products": [
            {"name": "20ft Container", "size": "600 x 240cm", "capacity": "33 cubic m", "img": "products/20ft-container/1.jpg",
             "desc": "Standard 20ft shipping container for secure on-site storage.",
             "features": ["33 cubic metre capacity", "Secure lockable storage", "Weather resistant"]},
            {"name": "10ft Container", "size": "300 x 240cm", "capacity": "16 cubic m", "img": "products/10ft-container/1.jpg",
             "desc": "Compact container for smaller sites with limited space.",
             "features": ["16 cubic metre capacity", "Compact footprint", "Space-saving option"]},
            {"name": "10ft DG Container", "size": "300 x 240cm", "capacity": "DG rated", "badge": "DG RATED", "img": "products/10ft-dg-container/1.jpg",
             "desc": "Compact dangerous goods storage meeting hazmat requirements.",
             "features": ["DG compliant", "Bunded floor", "Hazmat certified"]},
            {"name": "20ft Shelved Container", "size": "600 x 240cm", "capacity": "Organised", "img": "products/20ft-shelved-container/1.jpg",
             "desc": "Container fitted with adjustable heavy-duty shelving for organised parts storage.",
             "features": ["Adjustable shelving", "Organised storage", "Easy inventory access"]},
        ]
    },
    {
        "name": "Ancillary Equipment",
        "desc": "Stairs, landings, covered decks, water tanks, waste tanks, and wash facilities.",
        "products": [
            {"name": "5000L Tank & Pump", "size": "Skid mounted", "capacity": "5,000L", "img": "products/5000l-tank-pump/1.jpg",
             "desc": "Potable water tank with pump system on skid-mounted frame.",
             "features": ["5000L capacity", "Pump system included", "Skid-mounted"]},
            {"name": "4000L Waste Tank", "size": "Skid mounted", "capacity": "4,000L", "img": "products/4000l-waste-tank/1.jpg",
             "desc": "Waste tank for ablution and crib room waste collection.",
             "features": ["4000L capacity", "Flexible deploy", "Easy pump-out"]},
            {"name": "12x3m Covered Deck", "size": "1200 x 300cm", "capacity": "Walkway", "img": "products/12x3m-covered-deck/1.jpg",
             "desc": "Weatherproof covered walkway and deck connecting building modules.",
             "features": ["Weatherproof cover", "Module connector", "Protected transit"]},
            {"name": "Stair & Landing", "size": "Various", "capacity": "Access", "img": "products/stair-landing/1.jpg",
             "desc": "Portable stair and landing systems for building access and egress.",
             "features": ["Multiple configs", "Safe access/egress", "Galvanised steel"]},
        ]
    },
]


def draw_cover_page(c, width, height):
    """Draw the cover page."""
    c.setFillColor(NAVY)
    c.rect(0, 0, width, height, fill=1, stroke=0)

    # Grid
    c.setStrokeColor(HexColor("#ffffff0d"))
    c.setLineWidth(0.3)
    for x in range(0, int(width), 40):
        c.line(x, 0, x, height)
    for y in range(0, int(height), 40):
        c.line(0, y, width, y)

    # Hero image behind
    hero = os.path.join(IMG_DIR, "products/12x3-office/1.jpg")
    if os.path.exists(hero):
        try:
            c.saveState()
            c.setFillAlpha(0.15)
            c.drawImage(ImageReader(hero), 0, height * 0.35, width, height * 0.4,
                       preserveAspectRatio=True, anchor="c")
            c.restoreState()
        except Exception:
            pass

    c.setFillColor(GOLD)
    c.rect(0, height - 8, width, 8, fill=1, stroke=0)

    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 36)
    c.drawString(MARGIN, height - 80 * mm, "MULTITRADE")
    c.setFont("Helvetica", 14)
    c.setFillColor(HexColor("#ffffff99"))
    c.drawString(MARGIN, height - 88 * mm, "BUILDING HIRE PTY LTD")

    c.setStrokeColor(GOLD)
    c.setLineWidth(2)
    c.line(MARGIN, height - 95 * mm, MARGIN + 60 * mm, height - 95 * mm)

    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 28)
    c.drawString(MARGIN, height - 115 * mm, "Product Catalogue")
    c.setFont("Helvetica", 16)
    c.setFillColor(GOLD)
    c.drawString(MARGIN, height - 125 * mm, "2025/2026")

    c.setFont("Helvetica", 11)
    c.setFillColor(HexColor("#ffffff80"))
    c.drawString(MARGIN, height - 145 * mm, "Portable buildings for mining, construction & civil projects")
    c.drawString(MARGIN, height - 155 * mm, "Manufactured in Gladstone, delivered Australia-wide")

    # Stats
    y_stats = height - 190 * mm
    stats = [("45+", "Years Experience"), ("35+", "Products"), ("0", "Lost Time Injuries"), ("200+", "Custom Designs")]
    x = MARGIN
    for val, label in stats:
        c.setFont("Helvetica-Bold", 22)
        c.setFillColor(GOLD)
        c.drawString(x, y_stats, val)
        c.setFont("Helvetica", 8)
        c.setFillColor(HexColor("#ffffff60"))
        c.drawString(x, y_stats - 14, label)
        x += 40 * mm

    c.setFillColor(HexColor("#ffffff40"))
    c.setFont("Helvetica", 9)
    c.drawString(MARGIN, 35 * mm, "6 South Trees Drive, Gladstone QLD 4680")
    c.drawString(MARGIN, 23 * mm, "(07) 4979 2333  |  multitrade@multitrade.com.au")
    c.setFont("Helvetica-Bold", 7)
    c.setFillColor(HexColor("#ffffff30"))
    c.drawString(MARGIN, 14 * mm, "ISO 9001:2015  |  ISO 14001:2015  |  ISO 45001:2018  |  C-RES BMA Certified")


def draw_page_header(canvas_obj, doc):
    canvas_obj.saveState()
    canvas_obj.setFillColor(NAVY)
    canvas_obj.rect(0, PAGE_H - 14 * mm, PAGE_W, 14 * mm, fill=1, stroke=0)
    canvas_obj.setFillColor(GOLD)
    canvas_obj.rect(0, PAGE_H - 14 * mm, PAGE_W, 0.5, fill=1, stroke=0)
    canvas_obj.setFont("Helvetica-Bold", 9)
    canvas_obj.setFillColor(white)
    canvas_obj.drawString(MARGIN, PAGE_H - 10 * mm, "MULTITRADE BUILDING HIRE")
    canvas_obj.setFont("Helvetica", 7)
    canvas_obj.setFillColor(HexColor("#ffffff80"))
    canvas_obj.drawRightString(PAGE_W - MARGIN, PAGE_H - 10 * mm, "Product Catalogue 2025/2026")
    # Footer
    canvas_obj.setFont("Helvetica", 6.5)
    canvas_obj.setFillColor(GRAY_500)
    canvas_obj.drawString(MARGIN, 10 * mm, "(07) 4979 2333  |  multitrade@multitrade.com.au  |  6 South Trees Drive, Gladstone QLD 4680")
    canvas_obj.drawRightString(PAGE_W - MARGIN, 10 * mm, f"Page {doc.page}")
    canvas_obj.restoreState()


def build_product_block(p):
    """Build a product entry with image."""
    elements = []

    img_path = p.get("img", "")
    img_obj = get_image(img_path, 120, 80) if img_path else None

    # Product header
    name_text = f"<b>{p['name']}</b>"
    if p.get('badge'):
        name_text += f"  <font color='#D4A843' size='7'>[{p['badge']}]</font>"

    # Build text column
    text_parts = []
    text_parts.append(Paragraph(name_text, sProductName))
    size_cap = f"<font color='#6b7280'>{p['size']}  |  {p['capacity']}</font>"
    text_parts.append(Paragraph(size_cap, ParagraphStyle("sc", fontName="Helvetica", fontSize=8, textColor=GRAY_500, leading=11)))
    text_parts.append(Spacer(1, 3))
    text_parts.append(Paragraph(p['desc'], sProductDesc))
    text_parts.append(Spacer(1, 3))

    features = p.get('features', [])
    if features:
        feat_text = ""
        for f in features:
            feat_text += f"<font color='#D4A843'>\u2713</font>  {f}    "
        text_parts.append(Paragraph(feat_text, sFeature))

    inclusions = p.get('inclusions', [])
    if inclusions:
        text_parts.append(Spacer(1, 2))
        incl_text = "<b>Standard Inclusions:</b> " + ", ".join(inclusions)
        text_parts.append(Paragraph(incl_text, sInclusion))

    if img_obj:
        # Two-column layout: image left, text right
        text_table = Table([[t] for t in text_parts], colWidths=[CONTENT_W - 130])
        text_table.setStyle(TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ("TOPPADDING", (0, 0), (-1, -1), 0),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
        ]))

        layout = Table([[img_obj, text_table]], colWidths=[125, CONTENT_W - 130])
        layout.setStyle(TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ("TOPPADDING", (0, 0), (-1, -1), 0),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
        ]))
        elements.append(layout)
    else:
        elements.extend(text_parts)

    elements.append(Spacer(1, 5))
    sep = Table([[""]], colWidths=[CONTENT_W], rowHeights=[0.5])
    sep.setStyle(TableStyle([("LINEBELOW", (0, 0), (-1, -1), 0.3, GRAY_200)]))
    elements.append(sep)
    elements.append(Spacer(1, 8))

    return elements


def main():
    out_path = os.path.join(BASE, "public", "Multitrade-Product-Catalogue.pdf")

    doc = SimpleDocTemplate(
        out_path, pagesize=A4,
        topMargin=20 * mm, bottomMargin=18 * mm,
        leftMargin=MARGIN, rightMargin=MARGIN,
    )

    story = []

    # TOC
    story.append(Spacer(1, 8 * mm))
    story.append(Paragraph("Contents", ParagraphStyle("TOC", fontName="Helvetica-Bold", fontSize=22, textColor=NAVY, leading=28)))
    story.append(Spacer(1, 6))
    accent = Table([[""]], colWidths=[60 * mm], rowHeights=[1.5])
    accent.setStyle(TableStyle([("LINEBELOW", (0, 0), (-1, -1), 1.5, GOLD)]))
    story.append(accent)
    story.append(Spacer(1, 10))

    for cat in CATEGORIES:
        count = len(cat['products'])
        toc_text = f"<b>{cat['name']}</b> <font color='#6b7280'>-- {count} products</font>"
        story.append(Paragraph(toc_text, ParagraphStyle("tocitem", fontName="Helvetica", fontSize=10, textColor=NAVY, leading=22, leftIndent=4)))

    story.append(Spacer(1, 15 * mm))
    contact_data = [
        [Paragraph("<b>Get a Quote</b>", ParagraphStyle("ch", fontName="Helvetica-Bold", fontSize=11, textColor=NAVY)), "", ""],
        [Paragraph("(07) 4979 2333", ParagraphStyle("cv", fontName="Helvetica", fontSize=9, textColor=GRAY_700)),
         Paragraph("multitrade@multitrade.com.au", ParagraphStyle("cv2", fontName="Helvetica", fontSize=9, textColor=GRAY_700)),
         Paragraph("multitrade.com.au", ParagraphStyle("cv3", fontName="Helvetica", fontSize=9, textColor=GOLD))],
    ]
    ct = Table(contact_data, colWidths=[55 * mm, 65 * mm, 45 * mm])
    ct.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), GOLD_LIGHT),
        ("BOX", (0, 0), (-1, -1), 0.5, GOLD),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ("SPAN", (0, 0), (-1, 0)),
    ]))
    story.append(ct)
    story.append(PageBreak())

    # Category pages
    for cat in CATEGORIES:
        story.append(Spacer(1, 4 * mm))
        acc = Table([[""]], colWidths=[40 * mm], rowHeights=[2])
        acc.setStyle(TableStyle([("LINEBELOW", (0, 0), (-1, -1), 2, GOLD)]))
        story.append(acc)
        story.append(Spacer(1, 4))
        story.append(Paragraph(cat['name'], sCatTitle))
        story.append(Paragraph(cat['desc'], sCatDesc))
        story.append(Spacer(1, 6 * mm))

        for p in cat['products']:
            block = build_product_block(p)
            story.append(KeepTogether(block))

        story.append(PageBreak())

    # Back page
    story.append(Spacer(1, 40 * mm))
    story.append(Paragraph("Ready to Get Started?", ParagraphStyle("back", fontName="Helvetica-Bold", fontSize=24, textColor=NAVY, alignment=TA_CENTER)))
    story.append(Spacer(1, 6))
    story.append(Paragraph("Queensland's largest privately owned portable building fleet.", ParagraphStyle("backsub", fontName="Helvetica", fontSize=11, textColor=GRAY_500, alignment=TA_CENTER)))
    story.append(Spacer(1, 15 * mm))

    for label, value in [("Call Us", "(07) 4979 2333"), ("Email", "multitrade@multitrade.com.au"), ("Visit", "multitrade.com.au"), ("Address", "6 South Trees Drive, Gladstone QLD 4680")]:
        story.append(Paragraph(f"<b>{label}:</b>  {value}", ParagraphStyle("bi", fontName="Helvetica", fontSize=11, textColor=GRAY_700, alignment=TA_CENTER, leading=20)))

    story.append(Spacer(1, 20 * mm))
    story.append(Paragraph("Design  |  Manufacture  |  Hire  |  Install", ParagraphStyle("tag", fontName="Helvetica-Bold", fontSize=10, textColor=GOLD, alignment=TA_CENTER)))
    story.append(Spacer(1, 8))
    story.append(Paragraph("ABN 36 010 136 600  |  Est. 1980  |  Gladstone, QLD", ParagraphStyle("abn", fontName="Helvetica", fontSize=8, textColor=GRAY_500, alignment=TA_CENTER)))
    story.append(Spacer(1, 6))
    story.append(Paragraph("ISO 9001:2015  |  ISO 14001:2015  |  ISO 45001:2018  |  C-RES BMA Certified", ParagraphStyle("iso", fontName="Helvetica", fontSize=7, textColor=GRAY_500, alignment=TA_CENTER)))

    cover_story = [Spacer(1, 1), PageBreak()] + story

    doc.build(cover_story,
              onFirstPage=lambda c, d: draw_cover_page(c, PAGE_W, PAGE_H),
              onLaterPages=draw_page_header)

    size_kb = os.path.getsize(out_path) / 1024
    print(f"Catalogue generated: {out_path}")
    print(f"Size: {size_kb:.0f} KB ({size_kb/1024:.1f} MB)")


if __name__ == "__main__":
    main()
