from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.main import bp
from app.models import Job, Event, Message, User, Profile
from app import db
from datetime import datetime

# Routes pour les offres d'emploi
@bp.route('/jobs', methods=['GET'])
@jwt_required()
def get_jobs():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    query = Job.query
    
    # Filtres
    search = request.args.get('search')
    job_type = request.args.get('type')
    location = request.args.get('location')
    
    if search:
        query = query.filter(
            (Job.title.ilike(f'%{search}%')) |
            (Job.company.ilike(f'%{search}%')) |
            (Job.description.ilike(f'%{search}%'))
        )
    if job_type:
        query = query.filter(Job.type == job_type)
    if location:
        query = query.filter(Job.location == location)
    
    jobs = query.order_by(Job.created_at.desc()).paginate(page=page, per_page=per_page)
    
    return jsonify({
        'jobs': [{
            'id': job.id,
            'title': job.title,
            'company': job.company,
            'description': job.description,
            'type': job.type,
            'location': job.location,
            'salary': job.salary,
            'created_at': job.created_at.isoformat()
        } for job in jobs.items],
        'total': jobs.total,
        'pages': jobs.pages,
        'current_page': jobs.page
    })

# Routes pour les événements
@bp.route('/events', methods=['GET'])
@jwt_required()
def get_events():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    query = Event.query
    
    # Filtres
    search = request.args.get('search')
    event_type = request.args.get('type')
    format = request.args.get('format')
    
    if search:
        query = query.filter(
            (Event.title.ilike(f'%{search}%')) |
            (Event.description.ilike(f'%{search}%'))
        )
    if event_type:
        query = query.filter(Event.type == event_type)
    if format:
        query = query.filter(Event.format == format)
    
    events = query.order_by(Event.date.desc()).paginate(page=page, per_page=per_page)
    
    return jsonify({
        'events': [{
            'id': event.id,
            'title': event.title,
            'description': event.description,
            'date': event.date.isoformat(),
            'type': event.type,
            'format': event.format,
            'organizer': {
                'id': event.organizer.id,
                'name': event.organizer.profile.full_name
            } if event.organizer else None,
            'created_at': event.created_at.isoformat()
        } for event in events.items],
        'total': events.total,
        'pages': events.pages,
        'current_page': events.page
    })

# Routes pour les messages
@bp.route('/messages', methods=['GET'])
@jwt_required()
def get_messages():
    current_user_id = get_jwt_identity()
    
    # Récupérer toutes les conversations
    conversations = Message.query.filter(
        (Message.sender_id == current_user_id) |
        (Message.recipient_id == current_user_id)
    ).order_by(Message.created_at.desc()).all()
    
    # Grouper les messages par conversation
    conversation_dict = {}
    for message in conversations:
        other_user_id = message.recipient_id if message.sender_id == current_user_id else message.sender_id
        if other_user_id not in conversation_dict:
            conversation_dict[other_user_id] = []
        conversation_dict[other_user_id].append({
            'id': message.id,
            'content': message.content,
            'created_at': message.created_at.isoformat(),
            'is_sender': message.sender_id == current_user_id
        })
    
    # Formater la réponse
    conversations_list = []
    for other_user_id, messages in conversation_dict.items():
        other_user = User.query.get(other_user_id)
        conversations_list.append({
            'user': {
                'id': other_user.id,
                'name': other_user.profile.full_name,
                'avatar_url': other_user.profile.avatar_url
            },
            'messages': messages,
            'last_message': messages[0]
        })
    
    return jsonify({'conversations': conversations_list})

@bp.route('/messages/<int:recipient_id>', methods=['POST'])
@jwt_required()
def send_message(recipient_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    message = Message(
        sender_id=current_user_id,
        recipient_id=recipient_id,
        content=data['content']
    )
    
    db.session.add(message)
    db.session.commit()
    
    return jsonify({
        'message': {
            'id': message.id,
            'content': message.content,
            'created_at': message.created_at.isoformat(),
            'is_sender': True
        }
    }), 201

# Routes pour les paramètres
@bp.route('/settings/notifications', methods=['PUT'])
@jwt_required()
def update_notifications():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'Utilisateur non trouvé'}), 404
    
    data = request.get_json()
    
    if 'email_notifications' in data:
        user.profile.email_notifications = data['email_notifications']
    if 'job_alerts' in data:
        user.profile.job_alerts = data['job_alerts']
    if 'event_reminders' in data:
        user.profile.event_reminders = data['event_reminders']
    
    db.session.commit()
    
    return jsonify({
        'message': 'Paramètres de notifications mis à jour',
        'settings': {
            'email_notifications': user.profile.email_notifications,
            'job_alerts': user.profile.job_alerts,
            'event_reminders': user.profile.event_reminders
        }
    })

@bp.route('/settings/privacy', methods=['PUT'])
@jwt_required()
def update_privacy():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'Utilisateur non trouvé'}), 404
    
    data = request.get_json()
    
    if 'profile_visibility' in data:
        user.profile.profile_visibility = data['profile_visibility']
    if 'show_email' in data:
        user.profile.show_email = data['show_email']
    if 'show_connections' in data:
        user.profile.show_connections = data['show_connections']
    
    db.session.commit()
    
    return jsonify({
        'message': 'Paramètres de confidentialité mis à jour',
        'settings': {
            'profile_visibility': user.profile.profile_visibility,
            'show_email': user.profile.show_email,
            'show_connections': user.profile.show_connections
        }
    }) 