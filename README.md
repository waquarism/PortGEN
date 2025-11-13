# PortGEN — AI-Powered Portfolio Generator from Resume

**PortGEN** is a full-stack AI-powered web application that automatically generates a professional **portfolio website from a resume** using advanced Natural Language Processing (NLP) and responsive web design.

> Built with **FastAPI (Python)** for backend intelligence and **React + Tailwind CSS + Framer Motion** for a sleek, dynamic frontend.

---

## Preview

![App Screenshot](assets/preview.png)

*(Add your app screenshot here — e.g., upload screen or generated portfolio preview)*

---

## Features

- Upload your resume (`PDF`, `DOCX`, or `TXT`)
- AI-based resume parsing using **spaCy NLP**
- Auto-generated responsive portfolio website
- **Light / Dark Mode** toggle
- **Download** or host portfolio instantly
- Modern design inspired by Flowblox UI
- **Framer Motion animations** for smooth transitions
- Fully **responsive layout** for mobile and desktop

---

## Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React.js, Tailwind CSS, Framer Motion |
| **Backend** | FastAPI (Python), spaCy, Jinja2 |
| **Parsing** | PDFMiner, python-docx |
| **Language Processing** | spaCy NLP Model (`en_core_web_sm`) |
| **Templating** | Jinja2 HTML Templates |
| **Deployment** | (Optional) Render, Netlify, Docker |

---

## Setup Instructions

### Backend (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # (Windows: venv\Scripts\activate)
pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn main:app --reload --port 8000
```

---

## **— How It Works**

```markdown
## How It Works

1. Upload your resume (`PDF`, `DOCX`, or `TXT`)
2. AI parses key details — Name, Skills, Education, Projects, Experience
3. The system organizes data into a **structured JSON**
4. A **dynamic portfolio template** is generated using Jinja2
5. Download your **ready-to-host portfolio site**
```
---

## Author

**Waquar Hassan**  
Full Stack Developer | React & Flutter | AI & NLP Enthusiast  
- [inbox@waquar.com](mailto:inbox@waquar.com)  
- [GitHub](https://github.com/waquarism) 
- [LinkedIn](https://linkedin.com/in/waquarism)

---

## Summary

**PortGEN** transforms a traditional resume into a professional online portfolio using AI —  
making portfolio creation **faster, smarter, and accessible** for everyone.

---

> *If you like this project, give it a star on GitHub and share it with others!*




