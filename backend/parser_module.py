# parser_module.py — FINAL UPGRADED VERSION FOR OLLAMA LLaMA + NER + TIMELINES + SEMANTIC SKILLS

import re
import requests
import json
from typing import Dict, Any, List
from pdfminer.high_level import extract_text as extract_text_pdf
from docx import Document

from transformers import AutoTokenizer, AutoModelForTokenClassification, pipeline
from sentence_transformers import SentenceTransformer, util

# -------------------------------------------------------------------
# 1️⃣ Load Resume NER Model
# -------------------------------------------------------------------
NER_MODEL = "dslim/bert-base-NER"
tokenizer = AutoTokenizer.from_pretrained(NER_MODEL)
model = AutoModelForTokenClassification.from_pretrained(NER_MODEL)

ner = pipeline(
    "token-classification",
    model=model,
    tokenizer=tokenizer,
    aggregation_strategy="simple"
)

# -------------------------------------------------------------------
# 2️⃣ Load Embedding Model
# -------------------------------------------------------------------
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")   # Fast + accurate


# -------------------------------------------------------------------
# 3️⃣ LLaMA Rewriter using OLLAMA (LOCAL)
# -------------------------------------------------------------------
def llama_rewrite(text: str) -> str:
    if not text.strip():
        return ""

    payload = {
        "model": "llama3.1",
        "prompt": f"Rewrite this professionally and clearly for a resume:\n\n{text}\n\nRewritten:",
        "stream": False
    }

    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json=payload
        ).json()

        return response.get("response", "").strip()

    except Exception:
        return text   # fail-safe fallback


# -------------------------------------------------------------------
# 4️⃣ Regex Extractors
# -------------------------------------------------------------------
EMAIL_RE = re.compile(r"[\w\.-]+@[\w\.-]+")
PHONE_RE = re.compile(r"(\+?\d[\d\s\-\(\)]{6,}\d)")

DATE_RE = re.compile(
    r"(?i)(\b\d{4}\b|\bJan(?:uary)?|\bFeb(?:ruary)?|\bMar(?:ch)?|\bApr(?:il)?|\bMay\b|\bJun(?:e)?|"
    r"\bJul(?:y)?|\bAug(?:ust)?|\bSep(?:tember)?|\bOct(?:ober)?|\bNov(?:ember)?|\bDec(?:ember)?)"
    r"[^\n]{0,15}?(\b\d{4}\b|Present)"
)


# -------------------------------------------------------------------
# 5️⃣ File Text Extractors
# -------------------------------------------------------------------
def extract_text_from_docx(path: str) -> str:
    try:
        doc = Document(path)
        return "\n".join([p.text for p in doc.paragraphs])
    except:
        return ""

def extract_text(path: str) -> str:
    if path.lower().endswith(".pdf"):
        return extract_text_pdf(path)
    elif path.lower().endswith(".docx"):
        return extract_text_from_docx(path)
    else:
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()


# -------------------------------------------------------------------
# 6️⃣ Semantic Skills — Recommend Skills Not Explicitly Listed
# -------------------------------------------------------------------
SKILL_BANK = [
    "Python", "JavaScript", "React", "Node.js", "Django", "Machine Learning", "Deep Learning",
    "SQL", "MongoDB", "AWS", "GCP", "Azure", "Docker", "Kubernetes", "TensorFlow",
    "PyTorch", "Data Analysis", "NLP", "Computer Vision", "HTML", "CSS", "Git"
]

skill_embeddings = embedding_model.encode(SKILL_BANK, convert_to_tensor=True)


def semantic_skill_match(text: str) -> List[str]:
    sentences = text.split("\n")
    sent_emb = embedding_model.encode(sentences, convert_to_tensor=True)

    hits = util.semantic_search(sent_emb, skill_embeddings, top_k=1)

    detected = []
    for i in range(len(sentences)):
        score_obj = hits[i][0]
        if score_obj["score"] > 0.45:
            detected.append(SKILL_BANK[score_obj["corpus_id"]])

    return list(set(detected))


# -------------------------------------------------------------------
# 7️⃣ Job Timeline Detection
# -------------------------------------------------------------------
def extract_timelines(text: str):
    matches = DATE_RE.findall(text)
    timelines = []

    for m in matches:
        # m returns tuple, join cleaned
        raw = " ".join(m).strip()
        if len(raw) > 3:
            timelines.append(raw)

    return list(set(timelines))


# -------------------------------------------------------------------
# 8️⃣ Project Extraction — Detect Paragraphs with "built", "developed", etc
# -------------------------------------------------------------------
PROJECT_KEYWORDS = ["built", "developed", "created", "designed", "implemented", "project", "system"]

def extract_projects(text: str):
    paras = [p.strip() for p in text.split("\n") if len(p.strip()) > 25]
    found = []

    for p in paras:
        if any(k in p.lower() for k in PROJECT_KEYWORDS):
            found.append(p)

    return found


# -------------------------------------------------------------------
# 9️⃣ NER Post-processing
# -------------------------------------------------------------------
def clean_ner_entities(entities):
    data = {
        "name": None,
        "skills": [],
        "orgs": [],
        "roles": [],
        "projects": [],
        "education_tags": [],
    }

    for e in entities:
        label = e["entity_group"]
        text = e["word"]

        if label == "NAME" and not data["name"]:
            data["name"] = text
        elif label == "SKILL":
            data["skills"].append(text)
        elif label == "ORG":
            data["orgs"].append(text)
        elif label == "JOB_TITLE":
            data["roles"].append(text)
        elif label == "PROJECT":
            data["projects"].append(text)
        elif label == "EDUCATION":
            data["education_tags"].append(text)

    # Deduplicate
    for k in data:
        if isinstance(data[k], list):
            data[k] = list(set(data[k]))
    return data


# -------------------------------------------------------------------
# 🔟 FINAL PARSE FUNCTION
# -------------------------------------------------------------------
def parse_resume(path: str) -> Dict[str, Any]:
    text = extract_text(path)

    # Run NER
    entities = ner(text)
    ner_data = clean_ner_entities(entities)

    # Contact info
    emails = EMAIL_RE.findall(text)
    phones = PHONE_RE.findall(text)

    # Skill enhancement
    semantic_skills = semantic_skill_match(text)

    # Projects
    detailed_projects = extract_projects(text)

    # Timelines
    timelines = extract_timelines(text)

    # Rewrite summary via LLaMA (Optional)
    summary = llama_rewrite("\n".join(text.split("\n")[:5]))

    # ---------------------------------------------------------------
    # Final structured output
    # ---------------------------------------------------------------
    output = {
        "name": ner_data["name"],
        "emails": emails,
        "phones": phones,
        "summary": summary,
        "skills": list(set(ner_data["skills"] + semantic_skills)),
        "roles": ner_data["roles"],
        "experience_orgs": ner_data["orgs"],
        "timelines": timelines,
        "projects": list(set(ner_data["projects"] + detailed_projects)),
        "education": ner_data["education_tags"],
        "raw_text": text[:10000]
    }

    print("~~~~~Parsed Resume Data:", json.dumps(output, indent=2))

    return output
