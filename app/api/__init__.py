from flask import Blueprint

bp = Blueprint('api', __name__)

from app.api import routes, admin, discussion_groups

# Enregistrer le blueprint d'administration
from app.api.admin import bp as admin_bp
bp.register_blueprint(admin_bp, url_prefix='/admin')

# Enregistrer le blueprint des groupes de discussion
from app.api.discussion_groups import discussion_groups as groups_bp
bp.register_blueprint(groups_bp, url_prefix='/groups')
