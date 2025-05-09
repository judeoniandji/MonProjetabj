from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app.models.job import Job
from app.models.event import Event
from app.models.application import Application
from app.models.message import Message
from app import db
from datetime import datetime

bp = Blueprint('api', __name__)

# API Documentation route
@bp.route('/')
def api_docs():
    return jsonify({
        'version': '1.0',
        'endpoints': {
            'jobs': '/api/jobs',
            'events': '/api/events',
            'applications': '/api/applications',
            'messages': '/api/messages',
            'profile': '/api/profile'
        }
    })

# Jobs API
@bp.route('/jobs')
def get_jobs():
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 10, type=int), 50)
    search = request.args.get('search', '')
    category = request.args.get('category', '')
    
    query = Job.query
    
    if search:
        query = query.filter(Job.title.ilike(f'%{search}%'))
    if category:
        query = query.filter(Job.category == category)
        
    jobs = query.order_by(Job.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )
    
    return jsonify({
        'jobs': [job.to_dict() for job in jobs.items],
        'total': jobs.total,
        'pages': jobs.pages,
        'current_page': jobs.page
    })

@bp.route('/jobs/<int:job_id>')
def get_job(job_id):
    job = Job.query.get_or_404(job_id)
    return jsonify(job.to_dict())

@bp.route('/jobs', methods=['POST'])
@jwt_required()
def create_job():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No input data provided'}), 400
        
    required_fields = ['title', 'description', 'company_id']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
        
    job = Job(**data)
    db.session.add(job)
    db.session.commit()
    
    return jsonify(job.to_dict()), 201

# Events API
@bp.route('/events')
def get_events():
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 10, type=int), 50)
    category = request.args.get('category', '')
    
    query = Event.query.filter_by(status='published')
    
    if category:
        query = query.filter(Event.category == category)
        
    events = query.order_by(Event.start_time).paginate(
        page=page, per_page=per_page, error_out=False
    )
    
    return jsonify({
        'events': [event.to_dict() for event in events.items],
        'total': events.total,
        'pages': events.pages,
        'current_page': events.page
    })

@bp.route('/events/<int:event_id>')
def get_event(event_id):
    event = Event.query.get_or_404(event_id)
    return jsonify(event.to_dict())

@bp.route('/events', methods=['POST'])
@jwt_required()
def create_event():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No input data provided'}), 400
        
    required_fields = ['title', 'description', 'start_time', 'end_time']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
        
    event = Event(**data)
    db.session.add(event)
    db.session.commit()
    
    return jsonify(event.to_dict()), 201

# Applications API
@bp.route('/applications')
@jwt_required()
def get_applications():
    user_id = get_jwt_identity()
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 10, type=int), 50)
    
    applications = Application.query.filter_by(user_id=user_id).paginate(
        page=page, per_page=per_page, error_out=False
    )
    
    return jsonify({
        'applications': [app.to_dict() for app in applications.items],
        'total': applications.total,
        'pages': applications.pages,
        'current_page': applications.page
    })

@bp.route('/applications/<int:application_id>')
@jwt_required()
def get_application(application_id):
    user_id = get_jwt_identity()
    application = Application.query.filter_by(
        id=application_id, user_id=user_id
    ).first_or_404()
    
    return jsonify(application.to_dict())

@bp.route('/jobs/<int:job_id>/apply', methods=['POST'])
@jwt_required()
def apply_for_job(job_id):
    user_id = get_jwt_identity()
    data = request.get_json() or {}
    
    # Vérifier si l'utilisateur a déjà postulé
    existing_application = Application.query.filter_by(
        job_id=job_id, user_id=user_id
    ).first()
    
    if existing_application:
        return jsonify({'error': 'You have already applied for this job'}), 400
        
    application = Application(
        job_id=job_id,
        user_id=user_id,
        cover_letter=data.get('cover_letter', ''),
        status='pending'
    )
    
    db.session.add(application)
    db.session.commit()
    
    return jsonify(application.to_dict()), 201

# Messages API
@bp.route('/messages')
@jwt_required()
def get_messages():
    user_id = get_jwt_identity()
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 10, type=int), 50)
    
    messages = Message.query.filter(
        (Message.recipient_id == user_id) | (Message.sender_id == user_id)
    ).order_by(Message.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )
    
    return jsonify({
        'messages': [msg.to_dict() for msg in messages.items],
        'total': messages.total,
        'pages': messages.pages,
        'current_page': messages.page
    })

@bp.route('/messages/<int:message_id>')
@jwt_required()
def get_message(message_id):
    user_id = get_jwt_identity()
    message = Message.query.filter(
        (Message.id == message_id) &
        ((Message.recipient_id == user_id) | (Message.sender_id == user_id))
    ).first_or_404()
    
    if message.recipient_id == user_id and not message.read:
        message.read = True
        message.read_at = datetime.utcnow()
        db.session.commit()
    
    return jsonify(message.to_dict())

@bp.route('/messages', methods=['POST'])
@jwt_required()
def send_message():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or not data.get('recipient_id') or not data.get('content'):
        return jsonify({'error': 'Missing recipient_id or content'}), 400
        
    message = Message(
        sender_id=user_id,
        recipient_id=data['recipient_id'],
        content=data['content']
    )
    
    db.session.add(message)
    db.session.commit()
    
    return jsonify(message.to_dict()), 201

# Profile API
@bp.route('/profile')
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict(include_profile=True))

@bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No input data provided'}), 400
        
    if 'email' in data and data['email'] != user.email:
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400
        user.email = data['email']
        
    if 'profile' in data:
        user.profile.update(data['profile'])
        
    db.session.commit()
    
    return jsonify(user.to_dict(include_profile=True))
