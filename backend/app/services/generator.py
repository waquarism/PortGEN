# generator.py
import os, shutil, zipfile
from jinja2 import Environment, FileSystemLoader, select_autoescape
from slugify import slugify

TEMPLATE_DIR = os.path.join(os.path.dirname(__file__), "../templates")
env = Environment(
    loader=FileSystemLoader(TEMPLATE_DIR),
    autoescape=select_autoescape(['html','xml'])
)

def create_site(parsed: dict, out_dir: str):
    # Use a simple template to render index.html
    os.makedirs(out_dir, exist_ok=True)
    template = env.get_template("index.html.j2")
    html = template.render(data=parsed)
    with open(os.path.join(out_dir, "index.html"), "w", encoding="utf-8") as f:
        f.write(html)
    # copy static css
    shutil.copy(os.path.join(TEMPLATE_DIR, "style.css"), os.path.join(out_dir, "style.css"))

def generate_portfolio_zip(parsed: dict, zip_path: str, template_id: str = "react-minimal"):
    tmpdir = zip_path + "_tmp"
    if os.path.exists(tmpdir):
        shutil.rmtree(tmpdir)
    
    # Logic for different templates
    if template_id == "react-minimal":
        # Copy the whole react template folder
        template_src = os.path.join(TEMPLATE_DIR, "react-minimal")
        if not os.path.exists(template_src):
             # Fallback or error
             raise ValueError(f"Template {template_id} not found at {template_src}")
        
        shutil.copytree(template_src, tmpdir)
        
        # Inject data
        import json
        data_path = os.path.join(tmpdir, "src", "portfolio-data.json")
        with open(data_path, "w", encoding="utf-8") as f:
            json.dump(parsed, f, indent=2, ensure_ascii=False)
            
    else:
        # Fallback to old static HTML method if needed, or error
        # extracting old logic into a sub function if we want to keep it
        os.makedirs(tmpdir, exist_ok=True)
        create_site(parsed, tmpdir)

    # create zip
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(tmpdir):
            for file in files:
                full = os.path.join(root, file)
                arcname = os.path.relpath(full, tmpdir)
                zf.write(full, arcname)
    shutil.rmtree(tmpdir)
