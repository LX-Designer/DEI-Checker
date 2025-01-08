from flask import Flask

# Create the Flask app
app = Flask(__name__)

# Import routes to register them
from app import routes