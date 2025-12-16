# parser_module.py
import re
from typing import Dict, Any, List
from pdfminer.high_level import extract_text as extract_text_pdf
from docx import Document
from transformers import pipeline, AutoTokenizer, AutoModelForTokenClassification

# Use a purely regex/heuristic approach for simple fields + BERT for complex entities
EMAIL_RE = re.compile(r"[\w\.-]+@[\w\.-]+")
PHONE_RE = re.compile(r"(\+?\d[\d\s\-\(\)]{6,}\d)")

# New Model: aggret/roberta-base-resume-parser -> Revert to working BERT but with better logic
MODEL_NAME = "yashpwr/resume-ner-bert-v2"
nlp_pipeline = None

def get_pipeline():
    global nlp_pipeline
    if nlp_pipeline is None:
        print(f"Loading model {MODEL_NAME}...")
        tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
        model = AutoModelForTokenClassification.from_pretrained(MODEL_NAME)
        nlp_pipeline = pipeline("ner", model=model, tokenizer=tokenizer, aggregation_strategy="simple")
        print("Model loaded.")
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

def find_social_links(text: str) -> Dict[str, str]:
    links = {}
    # Simple regex for LinkedIn and GitHub
    linkedin_re = re.compile(r"(https?://(?:www\.)?linkedin\.com/in/[\w\-]+)")
    github_re = re.compile(r"(https?://(?:www\.)?github\.com/[\w\-]+)")
    
    li = linkedin_re.search(text)
    if li:
        links["linkedin"] = li.group(1)
    
    gh = github_re.search(text)
    if gh:
        links["github"] = gh.group(1)
            
    return links

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

def group_entities_by_proximity(entities, primary_label, secondary_label, threshold=100):
    """
    Groups entities that are close to each other in the text.
    For example, groups 'Designation' (primary) with the nearest 'Company' (secondary).
    """
    primaries = [e for e in entities if e['entity_group'] == primary_label]
    secondaries = [e for e in entities if e['entity_group'] == secondary_label]
    
    grouped = []
    
    # Simple greedy matching: for each primary, find closest secondary
    # Ideally we sort by start position
    primaries.sort(key=lambda x: x['start'])
    secondaries.sort(key=lambda x: x['start'])
    
    used_secondaries = set()
    
    for p in primaries:
        best_match = None
        min_dist = float('inf')
        
        p_center = (p['start'] + p['end']) / 2
        
        for i, s in enumerate(secondaries):
            if i in used_secondaries:
                continue
            
            s_center = (s['start'] + s['end']) / 2
            dist = abs(p_center - s_center)
            
            if dist < min_dist and dist < threshold:
                min_dist = dist
                best_match = i
        
        item = {primary_label: p['word']}
        if best_match is not None:
            item[secondary_label] = secondaries[best_match]['word']
            used_secondaries.add(best_match)
        else:
            item[secondary_label] = ""
            
        grouped.append(item)
        
    return grouped

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
    # Truncate to avoid excessive processing time/memory
    truncated_text = text[:5000] 
    entities = ner(truncated_text)
    
    # Clean up entities (remove punctuation artifacts if any)
    # Aggregate Entities
    parsed_entities = {
        "Name": [],
        "Designation": [],
        "Companies worked at": [],
        "Skills": [],
        "Degree": [],
        "College Name": [],
        "Graduation Year": [],
        "Location": [],
        "Email Address": []
    }
    
    for ent in entities:
        label = ent.get('entity_group')
        word = ent.get('word')
        if label and word:
            word = word.strip()
            # Normalize label lookup if needed, but 'yashpwr/resume-ner-bert-v2' usually uses these exact keys
            if label in parsed_entities:
                parsed_entities[label].append(word)

    # Post-processing
    
    # 1. Personal Info
    name = parsed_entities["Name"][0] if parsed_entities["Name"] else ""
    if not name:
        name = text.strip().splitlines()[0].strip()
        
    job_title = parsed_entities["Designation"][0] if parsed_entities["Designation"] else "Candidate"
    
    # Merge BERT emails with Regex emails
    bert_emails = parsed_entities.get("Email Address", [])
    merged_emails = list(set(emails + bert_emails))
    
    location = parsed_entities["Location"][0] if parsed_entities["Location"] else ""
    
    personal_info = {
        "fullName": name,
        "jobTitle": job_title,
        "email": merged_emails[0] if merged_emails else "",
        "phone": phones[0] if phones else "",
        "location": location,
        "summary": summary,
        "socialLinks": social_links
    }

    # --- 2. Experience ---
    # Group Designation and Company
    # The model labels are usually 'Designation' and 'Company' (or 'Organization')
    # Let's check model outputs. aggret model outputs: Name, College Name, Degree, Graduation Year, Years of Experience, Companies worked at, Designation, Skills, Location, Email Address
    # Note: Label names might differ slightly. 'Companies worked at' vs 'Company'.
    # We will assume 'Companies worked at' and 'Designation'
    
    exp_groups = group_entities_by_proximity(entities, 'Designation', 'Companies worked at', threshold=200)
    
    experience_entries = []
    if exp_groups:
        for g in exp_groups:
            experience_entries.append({
                "company": g.get('Companies worked at', 'Unknown Company'),
                "role": g.get('Designation', 'Employee'),
                "startDate": "",
                "endDate": "",
                "description": []
            })
    else:
        # Fallback
        if "experience" in sections:
            exp_text = sections["experience"]
            parts = re.split(r"\n\s*\n", exp_text)
            for p in parts:
                lines = p.splitlines()
                if lines:
                    experience_entries.append({
                        "company": "",
                        "role": lines[0],
                        "startDate": "",
                        "endDate": "",
                        "description": lines[1:] if len(lines)>1 else []
                    })

    # --- 3. Education ---
    # Group Degree and College Name
    edu_groups = group_entities_by_proximity(entities, 'Degree', 'College Name', threshold=200)
    
    education_entries = []
    if edu_groups:
        for g in edu_groups:
            education_entries.append({
                "institution": g.get('College Name', 'Unknown University'),
                "degree": g.get('Degree', 'Degree'),
                "startDate": "",
                "endDate": "", # We could look for 'Graduation Year' here too
                "grade": ""
            })
    else:
        # Fallback
        if "education" in sections:
            edu_text = sections["education"]
            parts = [l for l in edu_text.splitlines() if l.strip()]
            if parts:
                 education_entries.append({
                     "institution": parts[0],
                     "degree": parts[1] if len(parts)>1 else "",
                     "startDate": "",
                     "endDate": "",
                     "grade": ""
                 })

    # --- 4. Skills ---
    # Extract all skills and split them
    skill_ents = [e['word'] for e in entities if e['entity_group'] == 'Skills']
    all_skills = []
    for s in skill_ents:
        # Split by comma or bullet points
        parts = re.split(r"[,•\n]", s)
        for p in parts:
            p = p.strip()
            if p and len(p) > 1:
                all_skills.append(p)
                
    tech_skills = list(set(all_skills))
    
    skills_obj = {
        "technical": tech_skills,
        "soft": []
    }
    
    # --- 5. Projects ---
    projects = []
    if "projects" in sections:
        proj_text = sections["projects"]
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
            
    # --- 6. Certifications ---
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
