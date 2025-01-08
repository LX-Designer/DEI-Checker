from flask import request, jsonify
from app import app
from app.helpers import process_file

@app.route('/upload', methods=['POST'])
def upload_file():
    """
    Handle file upload via POST request.

    Returns:
        JSON response with feedback or error message.
    """

    if "file" not in request.files:
        return jsonify({"error": "No file detected"}), 400

    file = request.files["file"]

    if not file.filename:
        return jsonify({"error": "No file detected"}), 400

    try:
        feedback = process_file(file)
        return jsonify(feedback), 200
    except Exception:
        return jsonify({"error": "An unexpected error occured"}), 500
