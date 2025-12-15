# parser_module.py
import re
from typing import Dict, Any, List
from pdfminer.high_level import extract_text as extract_text_pdf
from docx import Document
from transformers import pipeline, AutoTokenizer, AutoModelForTokenClassification

# Use a purely regex/heuristic approach for simple fields + BERT for complex entities
EMAIL_RE = re.compile(r"[\w\.-]+@[\w\.-]+")
PHONE_RE = re.compile(r"(\+?\d[\d\s\-\(\)]{6,}\d)")

# Load BERT Model (Lazy loading or global)
# Using yashpwr/resume-ner-bert-v2 as requested
MODEL_NAME = "yashpwr/resume-ner-bert-v2"
nlp_pipeline = None

def get_pipeline():
    global nlp_pipeline
    if nlp_pipeline is None:
        print("Loading BERT model...")
        tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
        model = AutoModelForTokenClassification.from_pretrained(MODEL_NAME)
        nlp_pipeline = pipeline("ner", model=model, tokenizer=tokenizer, aggregation_strategy="simple")
        print("BERT model loaded.")
    return nlp_pipeline

def extract_text_from_docx(path: str) -> str:
    doc = Document(path)
    return "\n".join([p.text for p in doc.paragraphs])

def extract_text(path: str) -> str:
    if path.lower().endswith(".pdf"):
        return extract_text_pdf(path)
    elif path.lower().endswith(".docx"):
        return extract_text_from_docx(path)
    else:
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()

def find_emails(text: str) -> List[str]:
    return EMAIL_RE.findall(text)

def find_phones(text: str) -> List[str]:
    return PHONE_RE.findall(text)

def simple_section_split(text: str) -> Dict[str,str]:
    # Break into lines and detect headings using common section names
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    headings = ["experience", "work experience", "education", "skills", "projects", "summary", "objective", "certifications", "achievements"]
    sections = {}
    current = "header"
    sections[current] = []
    for line in lines:
        low = line.lower()
        matched = None
        for h in headings:
            if low.startswith(h):
                matched = h
                break
        if matched:
            current = matched
            sections[current] = []
        else:
            sections.setdefault(current, []).append(line)
    return {k: "\n".join(v) for k,v in sections.items()}


def find_social_links(text: str) -> Dict[str, str]:
    links = {}
    # Simple regex for LinkedIn and GitHub
    linkedin_re = re.compile(r"(https?://(?:www\.)?linkedin\.com/in/[\w\-]+)")
    github_re = re.compile(r"(https?://(?:www\.)?github\.com/[\w\-]+)")
    portfolio_re = re.compile(r"(https?://[\w\-\.]+\.(?:com|dev|io|net|org)(?:/[\w\-]+)?)")

    li = linkedin_re.search(text)
    if li:
        links["linkedin"] = li.group(1)
    
    gh = github_re.search(text)
    if gh:
        links["github"] = gh.group(1)

    # Allow other portfolio links if not the same as above
    # This is a bit loose, but works for the demo
    for m in portfolio_re.finditer(text):
        url = m.group(1)
        if "linkedin.com" not in url and "github.com" not in url:
            links["portfolio"] = url
            break # Just take the first likely portfolio link
            
    return links

def parse_resume(path: str) -> Dict[str, Any]:
    text = extract_text(path)
    
    # Heuristic extractions
    emails = find_emails(text)
    phones = find_phones(text)
    sections = simple_section_split(text)
    summary = sections.get("summary") or sections.get("objective") or ""
    social_links = find_social_links(text)

    # BERT Extraction
    ner = get_pipeline()
    # Truncate to avoid excessive processing time/memory for now
    truncated_text = text[:5000] 
    entities = ner(truncated_text)

    # Aggregate Entities
    parsed_entities = {
        "Name": [],
        "Designation": [],
        "Companies worked at": [],
        "Skills": [],
        "Degree": [],
        "College Name": [],
        "Graduation Year": []
    }
    
    for ent in entities:
        label = ent.get('entity_group')
        word = ent.get('word')
        if label and word:
            word = word.strip()
            if label in parsed_entities:
                parsed_entities[label].append(word)

    # Post-processing
    
    # 1. Personal Info
    name = parsed_entities["Name"][0] if parsed_entities["Name"] else ""
    if not name:
        name = text.strip().splitlines()[0].strip()
        
    job_title = parsed_entities["Designation"][0] if parsed_entities["Designation"] else "Candidate"
    
    personal_info = {
        "fullName": name,
        "jobTitle": job_title,
        "email": emails[0] if emails else "",
        "phone": phones[0] if phones else "",
        "location": "", # hard to assume without specific NER
        "summary": summary,
        "socialLinks": social_links
    }

    # 2. Education
    education_entries = []
    degrees = parsed_entities["Degree"]
    colleges = parsed_entities["College Name"]
    years = parsed_entities["Graduation Year"]
    
    # Try to zip if counts match or are close
    # For simplicity, we iterate max length and fill what we can
    max_len = max(len(degrees), len(colleges))
    if max_len > 0:
        for i in range(max_len):
            edu_item = {
                "institution": colleges[i] if i < len(colleges) else (colleges[0] if colleges else "Unknown University"),
                "degree": degrees[i] if i < len(degrees) else (degrees[0] if degrees else "Degree"),
                "startDate": "",
                "endDate": years[i] if i < len(years) else "",
                "grade": ""
            }
            education_entries.append(edu_item)
    
    # Fallback if BERT found nothing but we have a section
    if not education_entries and "education" in sections:
        edu_text = sections["education"]
        # Treat lines as entries roughly
        parts = [l.strip() for l in edu_text.splitlines() if l.strip()]
        if parts:
             education_entries.append({
                 "institution": parts[0],
                 "degree": parts[1] if len(parts)>1 else "",
                 "startDate": "",
                 "endDate": "",
                 "grade": ""
             })

    # 3. Experience
    experience_entries = []
    designations = parsed_entities["Designation"]
    companies = parsed_entities["Companies worked at"]
    
    # Heuristic: zip them if count matches perfectly, else creates separate or best guess
    # Usually NER finds Company then Designation or vice versa.
    max_exp = max(len(designations), len(companies))
    if max_exp > 0:
         for i in range(max_exp):
            role = designations[i] if i < len(designations) else "Employee"
            comp = companies[i] if i < len(companies) else "Unknown Company"
            experience_entries.append({
                "company": comp,
                "role": role,
                "startDate": "",
                "endDate": "",
                "description": []
            })
            
    # Fallback to section
    if not experience_entries and "experience" in sections:
        exp_text = sections["experience"]
        # Split by empty lines or similar
        parts = [p.strip() for p in re.split(r"\n\s*\n", exp_text) if p.strip()]
        for p in parts:
            lines = p.splitlines()
            title = lines[0] if lines else "Experience"
            desc = lines[1:] if len(lines) > 1 else []
            experience_entries.append({
                "company": "", 
                "role": title,
                "startDate": "", 
                "endDate": "",
                "description": desc
            })

    # 4. Projects
    projects = []
    if "projects" in sections:
        proj_text = sections["projects"]
        # Heuristic split
        parts = [p.strip() for p in re.split(r"\n\s*\n", proj_text) if p.strip()]
        for p in parts:
            lines = p.splitlines()
            title = lines[0]
            desc = "\n".join(lines[1:])
            projects.append({
                "title": title,
                "description": desc,
                "technologies": [],
                "link": ""
            })

    # 5. Skills
    # Deduplicate skills
    tech_skills = list(set(parsed_entities["Skills"]))
    
    skills_obj = {
        "technical": tech_skills,
        "soft": [] # BERT doesn't tag soft skills separately usually
    }
    
    # 6. Certifications
    certifications = []
    if "certifications" in sections:
        cert_text = sections["certifications"]
        lines = [l.strip() for l in cert_text.splitlines() if l.strip()]
        for l in lines:
            certifications.append({
                "title": l,
                "issuer": "",
                "date": ""
            })

    final_parsed = {
        "personalInfo": personal_info,
        "education": education_entries,
        "experience": experience_entries,
        "projects": projects,
        "skills": skills_obj,
        "certifications": certifications
    }
    return final_parsed
