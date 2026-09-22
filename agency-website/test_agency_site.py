import os
import re
from bs4 import BeautifulSoup

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PAGES = ['index.html', 'services.html', 'contact.html']

KEYWORDS = [
    "business website development", "custom website design", "e-commerce website development",
    "online store creation", "landing page design", "portfolio website development",
    "website redesign services", "custom software development", "CRM system development",
    "ERP system solutions", "business application development", "digital marketing services",
    "social media management", "SEO services", "Google Business Profile optimization",
    "AI-powered business solutions", "business process automation", "branding and design services",
    "graphic design for businesses", "promotional video creation", "professional website creation",
    "online store development", "customized business software", "digital presence building",
    "automate business processes", "grow your business online", "bespoke digital solutions",
    "business goals digital strategy", "web development for business", "SEO and digital marketing",
    "digital marketing automation", "AI in SEO", "ecommerce SEO", "geo-targeted marketing",
    "website sales optimization", "custom ERP solutions", "CRM software", "SEO automation tools",
    "AEO strategies", "AI-driven marketing solutions", "digital marketing software",
    "website development services", "digital marketing agency", "ecommerce site optimization",
    "localized SEO services", "custom CRM software solutions", "AI in digital marketing",
    "search engine optimization tools", "geo-based advertising", "ERP for digital marketing",
    "CRM for marketing automation", "website SEO enhancement", "smart marketing automation",
    "ERP software solutions", "AI-powered marketing automation", "advanced SEO strategies",
    "custom ERP development", "local SEO experts"
]

print("=== STARTING AGENCY WEBSITE VERIFICATION ===")
errors = []
warnings = []

all_text_combined = ""

for page in PAGES:
    page_path = os.path.join(BASE_DIR, page)
    if not os.path.exists(page_path):
        errors.append(f"Missing page: {page}")
        continue
    
    with open(page_path, 'r', encoding='utf-8') as f:
        html = f.read()
    
    all_text_combined += " " + html.lower()

    soup = BeautifulSoup(html, 'html.parser')

    # 1. Check title
    title = soup.find('title')
    if not title or not title.text.strip():
        errors.append(f"{page}: Missing or empty title tag")
    
    # 2. Check meta description
    meta_desc = soup.find('meta', attrs={'name': 'description'})
    if not meta_desc or not meta_desc.get('content', '').strip():
        errors.append(f"{page}: Missing meta description")

    # 3. Check CSS & JS references
    for link in soup.find_all('link', rel='stylesheet'):
        href = link.get('href')
        if href and not href.startswith('http'):
            clean_href = href.split('?')[0].split('#')[0]
            if not os.path.exists(os.path.join(BASE_DIR, clean_href)):
                errors.append(f"{page}: Broken CSS stylesheet '{href}'")

    for script in soup.find_all('script'):
        src = script.get('src')
        if src and not src.startswith('http'):
            clean_src = src.split('?')[0].split('#')[0]
            if not os.path.exists(os.path.join(BASE_DIR, clean_src)):
                errors.append(f"{page}: Broken JS script '{src}'")

    # 4. Check internal links
    for a in soup.find_all('a'):
        href = a.get('href')
        if not href or href.startswith('http') or href.startswith('mailto:') or href.startswith('tel:'):
            continue
        parts = href.split('#')
        target_file = parts[0]
        anchor = parts[1] if len(parts) > 1 else None

        if target_file:
            if not os.path.exists(os.path.join(BASE_DIR, target_file)):
                errors.append(f"{page}: Broken relative link to '{href}'")
        elif anchor:
            if anchor not in ['top', 'contactFormCard'] and not soup.find(id=anchor):
                warnings.append(f"{page}: Anchor '#{anchor}' not found on page")

print(f"\nTotal Pages Verified: {len(PAGES)}")
print(f"Total Errors Found: {len(errors)}")
print(f"Total Warnings Found: {len(warnings)}")

if errors:
    for e in errors:
        print(f"  [X] {e}")

# Verify Keywords Coverage
missing_keywords = []
for kw in KEYWORDS:
    if kw.lower() not in all_text_combined:
        missing_keywords.append(kw)

print(f"\nKeyword Coverage: {len(KEYWORDS) - len(missing_keywords)} / {len(KEYWORDS)} keywords present")
if missing_keywords:
    print(f"Missing Keywords: {missing_keywords}")
else:
    print("ALL 58 KEYWORDS VERIFIED PRESENT AND EMBEDDED!")

if not errors:
    print("\nSUCCESS: All agency pages, styles, scripts, and keyword integrations verified successfully!")
