import docx
from PyPDF2 import PdfReader

def process_file(file):
    if file.filename.endswith(".docx"):
        return analyze_docx(file)
    elif file.filename.endswith(".pdf"):
        return analyze_pdf(file)
    else:
        return {"error": "Unsupported file type. Please upload a .docx or .pdf file."}
    
def analyze_docx(file):
    doc = docx.Document(file)
    text = ""
    for para in doc.paragraphs:
        text += para.text + "\n"
    return analyze_text(text)

def analyze_pdf(file):
    reader = PdfReader(file)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return analyze_text(text)

def analyze_text(text):
    # Simple placeholder logic for analyzing text against DEI criteria
    feedback = {
        "issues": [],
        "suggestions": []
    }

    # Example analysis: Check for exclusive language (very basic example)
    exclusive_terms = ["he", "she", "man", "woman"]
    for term in exclusive_terms:
        if term in text.lower():
            feedback["issues"].append(f"Consider using more inclusive language for '{term}'.")

    # Return the feedback
    return feedback