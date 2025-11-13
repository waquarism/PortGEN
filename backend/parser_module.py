# parser_module.py
import re
from typing import Dict, Any, List
import spacy
from pdfminer.high_level import extract_text as extract_text_pdf
from docx import Document

nlp = spacy.load("en_core_web_sm")

EMAIL_RE = re.compile(r"[\w\.-]+@[\w\.-]+")
PHONE_RE = re.compile(r"(\+?\d[\d\s\-\(\)]{6,}\d)")

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
    phones = PHONE_RE.findall(text)
    return phones

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
    # join
    return {k: "\n".join(v) for k,v in sections.items()}

def parse_resume(path: str) -> Dict[str, Any]:
    text = extract_text(path)
    doc = nlp(text)
    # Name candidate: first PERSON entity or first line
    name = None
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            name = ent.text
            break
    # fallback: first non-empty line
    if not name:
        name = text.strip().splitlines()[0].strip()

    emails = find_emails(text)
    phones = find_phones(text)

    sections = simple_section_split(text)

    # Extract skills by heuristics: look into skills section or nouns/PROPN of lines with commas
    skills = []
    if "skills" in sections:
        skills_text = sections["skills"]
        # split by comma / bullet
        skills = re.split(r"[•\-\n,;]+", skills_text)
        skills = [s.strip() for s in skills if s.strip()]
    else:
        # try find technical keywords via POS
        for token in doc.noun_chunks:
            if len(token.text.split()) <= 3 and token.root.pos_ in ("NOUN","PROPN"):
                pass

    # Experiences: take experience section, split by blank lines
    experiences = []
    if "experience" in sections:
        exp_text = sections["experience"]
        parts = re.split(r"\n{1,}", exp_text)
        experiences = [p.strip() for p in parts if p.strip()]

    education = []
    if "education" in sections:
        edu_text = sections["education"]
        parts = re.split(r"\n{1,}", edu_text)
        education = [p.strip() for p in parts if p.strip()]

    projects = []
    if "projects" in sections:
        proj_text = sections["projects"]
        parts = re.split(r"\n{1,}", proj_text)
        projects = [p.strip() for p in parts if p.strip()]

    summary = sections.get("summary") or sections.get("objective") or ""

    parsed = {
        "name": name,
        "emails": emails,
        "phones": phones,
        "summary": summary,
        "skills": skills,
        "education": education,
        "experience": experiences,
        "projects": projects,
        "raw_text": text[:10000]  # avoid huge returns
    }
    return parsed
