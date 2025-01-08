from app import app  # Import the app instance from app/__init__.py
from flask import render_template

@app.route('/')
def index():
    return render_template("upload.html")

if __name__ == '__main__':
    app.run(debug=True)