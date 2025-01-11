import docx
from PyPDF2 import PdfReader
import re
import sqlite3

def process_file(file):
    if file.filename.endswith(".docx"):
        return analyze_docx(file)
    elif file.filename.endswith(".pdf"):
        return analyze_pdf(file)
    else:
        return {"error": "Unsupported file type. Please upload a .docx or .pdf file."}
    
def analyze_docx(file):             # PREPARES UPLOADED DOCX FOR ANALYSIS AND PASSES IT TO THE ANALYZE_TEXT FUNCTION, RETURNING THE ANALYSIS AS OUTPUT
    doc = docx.Document(file)       # creates a Document object from the uploaded file for processing and stores the object in the variable 'doc'
    text = ""                       # initialises an empty string to store the text that will be extracted from the Document object
    for para in doc.paragraphs:     # iterates through each paragraph in the Document object
        text += para.text + "\n"    # appends the text from the current paragraph to 'text', adding a newline to preserve paragraph breaks
    return analyze_text(text)       # passes the combined text to the analyze_text function and returns its output

def analyze_pdf(file):
    reader = PdfReader(file)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return analyze_text(text)

# start here
def analyze_text(text):                                 # ANALYSES TEXT AND RETURN THE SOURCE TEXT WITH EXCLUSIVE TERMS HIGHLIGHTED, ALONG WITH FEEDBACK ON EACH TERM
    highlighted_text = text                             # stores text in variable 'highlighted_text'
    exclusive_terms = get_exclusive_terms()               # UPDATE -> fetches the list of exclusive terms from the database to be checked in the analysis
    
    feedback = {                                    # initialises a dictionary called 'feedback'
        "highlighted_text": highlighted_text,       # creates a key/value pair for 'highlighted_text', initialised with the original text
        "issues": [],                               # creates a key/value pair for 'issues', starting as an empty list
        "suggestions": []                           # NOT CURRENTLY BEING USED # creates a key/value pair for 'suggestions', starting as an empty list. 
    }

    for term in exclusive_terms.keys():        # UPDATE -> iterates through each term in 'exclusive_terms'. for each term:
        highlighted_text = re.sub(      # updates 'highlighted_text' with the result of re.sub(), replacing each term with a highlighted version
            rf"\b({term})\b",           # denotes word boundaries using \b to match the exact term and not capture parts of longer words
            r"<mark>\1</mark>",         # replaces the term with itself (\1) and wraps the term in <mark> tags for highlighting
            highlighted_text,           # searches for the term and replaces it within the current state of 'highlighted_text' 
            flags=re.IGNORECASE         # ignores case while searching and matching
        )

        # Check if term exists in the modified highlighted text (after re.sub applied)
        if re.search(rf"\b{term}\b", highlighted_text, flags=re.IGNORECASE):
            feedback["issues"].append({"term": term, "feedback": exclusive_terms[term]})  # Append a dictionary with term and feedback

    feedback["highlighted_text"] = highlighted_text

    return feedback  # Return the feedback with highlighted text and identified issues

def get_db_connection():
    conn = sqlite3.connect("terms.db")
    conn.row_factory = sqlite3.Row      # enables dictionary-like access to rows
    return conn

def get_exclusive_terms():
    conn = get_db_connection()
    terms = conn.execute("SELECT term, feedback FROM terms").fetchall()
    conn.close()
    return {row["term"]: row["feedback"] for row in terms}
