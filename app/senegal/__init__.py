from flask import Blueprint

bp = Blueprint('senegal', __name__)

from app.senegal import routes
