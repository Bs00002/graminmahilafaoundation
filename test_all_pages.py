import os
import re
from bs4 import BeautifulSoup

PAGES = [
    'index.html',
    'about.html',
    'work.html',
    'programs.html',
    'gallery.html',
    'videos.html',
    'events.html',
    'donors.html',
    'news.html',
    'donate.html',
    'volunteer.html',
    'contact.html',
    'transparency.html'
]

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
gujarati_pattern = re.compile(r'[\u0A80-\u0AFF]')
hindi_pattern = re.compile(r'[\u0900-\u097F]')

errors = []
warnings = []

print("=== STARTING COMPREHENSIVE PROJECT VERIFICATION ===")

for page in PAGES:
    page_path = os.path.join(BASE_DIR, page)
    if not os.path.exists(page_path):
        errors.append(f"MISSING PAGE: {page}")
        continue
    
    with open(page_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check for Gujarati characters
    gu_matches = gujarati_pattern.findall(content)
    if gu_matches:
        errors.append(f"{page}: Found {len(gu_matches)} Gujarati characters! ({gu_matches[:10]})")

    # Check for Hindi/Devanagari characters
    hi_matches = hindi_pattern.findall(content)
    if hi_matches:
        errors.append(f"{page}: Found {len(hi_matches)} Hindi characters! ({hi_matches[:10]})")

    # Check for old SSV Foundation mentions
    ssv_matches = re.findall(r'\bSSV\b|ssvfoundation', content, re.IGNORECASE)
    # Check if there are unwanted mentions
    if ssv_matches:
        # Ignore if it's only in an old comment or non-visible
        errors.append(f"{page}: Found {len(ssv_matches)} occurrences of SSV / ssvfoundation: {ssv_matches[:5]}")

    # Parse HTML
    soup = BeautifulSoup(content, 'html.parser')

    # Check title
    title = soup.find('title')
    if not title or not title.text.strip():
        errors.append(f"{page}: Missing or empty <title> tag")
    
    # Check description
    meta_desc = soup.find('meta', attrs={'name': 'description'})
    if not meta_desc or not meta_desc.get('content', '').strip():
        errors.append(f"{page}: Missing meta description")

    # Check all images
    for img in soup.find_all('img'):
        src = img.get('src')
        if src and not src.startswith('http') and not src.startswith('data:'):
            # Resolve path relative to BASE_DIR
            clean_src = src.split('?')[0].split('#')[0]
            full_img_path = os.path.normpath(os.path.join(BASE_DIR, clean_src))
            if not os.path.exists(full_img_path):
                errors.append(f"{page}: Broken image src '{src}' -> not found at '{full_img_path}'")
        alt = img.get('alt')
        if not alt or not alt.strip():
            warnings.append(f"{page}: Image '{src}' missing alt text")

    # Check all videos
    for video in soup.find_all('video'):
        # Check src on video or source
        src = video.get('src')
        sources = [s.get('src') for s in video.find_all('source')]
        if src:
            sources.append(src)
        for s in sources:
            if s and not s.startswith('http'):
                clean_s = s.split('?')[0].split('#')[0]
                full_v_path = os.path.normpath(os.path.join(BASE_DIR, clean_s))
                if not os.path.exists(full_v_path):
                    errors.append(f"{page}: Broken video source '{s}' -> not found at '{full_v_path}'")

    # Check internal links
    for a in soup.find_all('a'):
        href = a.get('href')
        if not href:
            continue
        if href.startswith('#'):
            # Anchor on the same page
            anchor_id = href[1:]
            if anchor_id and anchor_id not in ['top', 'content'] and not soup.find(id=anchor_id):
                warnings.append(f"{page}: Anchor '#{anchor_id}' not found on this page")
        elif not href.startswith('http') and not href.startswith('mailto:') and not href.startswith('tel:'):
            # Relative link
            parts = href.split('#')
            target_file = parts[0]
            if target_file:
                target_path = os.path.normpath(os.path.join(BASE_DIR, target_file))
                if not os.path.exists(target_path):
                    errors.append(f"{page}: Broken internal link to '{href}'")

print(f"\nVERIFICATION RESULTS:")
print(f"Total Pages Checked: {len(PAGES)}")
print(f"Total Errors Found: {len(errors)}")
print(f"Total Warnings Found: {len(warnings)}")

if errors:
    print("\n--- ERRORS ---")
    for err in errors:
        print(f"  [X] {err}")

if warnings:
    print("\n--- WARNINGS ---")
    for w in warnings[:15]:
        print(f"  [!] {w}")

if not errors:
    print("\nSUCCESS! All 13 pages are 100% verified, zero Gujarati/Hindi, zero broken links, zero missing media!")
