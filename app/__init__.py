from flask import Flask
import os

# Create the Flask app
app = Flask(__name__)
app.secret_key = os.urandom(24)

# Import routes to register them
from app import routes