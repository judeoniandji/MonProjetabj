from flask import jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from werkzeug.utils import secure_filename
import os
from app.api import bp
from app.models import User, Event, EventParticipant
from app import db

@bp.route('/events', methods=['POST'])
@jwt_required()
def create_event():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    # Seuls les entreprises et les mentors peuvent créer des événements
    if user.user_type not in ['company', 'mentor']:
        return jsonify({'error': 'Not authorized to create events'}), 403
    
    # Handle file upload
    image = None
    if 'image' in request.files:
        file = request.files['image']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], 'events', filename))
            image = f'/static/uploads/events/{filename}'
    
    data = request.form
    
    try:
        start_time = datetime.fromisoformat(data['start_time'])
        end_time = datetime.fromisoformat(data['end_time'])
    except (ValueError, KeyError):
        return jsonify({'error': 'Invalid date format'}), 400
    
    if start_time >= end_time:
        return jsonify({'error': 'End time must be after start time'}), 400
    
    event = Event(
        title=data['title'],
        description=data.get('description', ''),
        start_time=start_time,
        end_time=end_time,
        event_type=data.get('event_type', 'webinar'),
        format=data.get('format'),
        location=data.get('location'),
        capacity=data.get('capacity', type=int),
        is_premium=data.get('is_premium', False),
        image_url=image,
        organizer_id=current_user_id
    )
    
    db.session.add(event)
    db.session.commit()
    
    return jsonify({
        'message': 'Event created successfully',
        'event_id': event.id
    }), 201

@bp.route('/events', methods=['GET'])
def get_events():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    event_type = request.args.get('type')
    is_premium = request.args.get('is_premium', type=bool)
    
    # Ne montrer que les événements à venir
    query = Event.query.filter(Event.start_time > datetime.utcnow())
    
    if event_type:
        query = query.filter_by(event_type=event_type)
    if is_premium is not None:
        query = query.filter_by(is_premium=is_premium)
    
    events = query.order_by(Event.start_time).paginate(page=page, per_page=per_page)
    
    return jsonify({
        'events': [{
            'id': event.id,
            'title': event.title,
            'description': event.description,
            'start_time': event.start_time.isoformat(),
            'end_time': event.end_time.isoformat(),
            'event_type': event.event_type,
            'format': event.format,
            'location': event.location,
            'organizer_id': event.organizer_id,
            'is_premium': event.is_premium,
            'image_url': event.image_url,
            'max_participants': event.max_participants,
            'current_participants': len(event.participants)
        } for event in events.items],
        'total': events.total,
        'pages': events.pages,
        'current_page': events.page
    })

@bp.route('/events/<int:event_id>', methods=['GET'])
def get_event(event_id):
    event = Event.query.get_or_404(event_id)
    
    return jsonify({
        'id': event.id,
        'title': event.title,
        'description': event.description,
        'start_time': event.start_time.isoformat(),
        'end_time': event.end_time.isoformat(),
        'event_type': event.event_type,
        'format': event.format,
        'location': event.location,
        'organizer_id': event.organizer_id,
        'is_premium': event.is_premium,
        'image_url': event.image_url,
        'max_participants': event.max_participants,
        'current_participants': len(event.participants),
        'organizer_name': event.organizer.profile.full_name
    })

@bp.route('/events/<int:event_id>/register', methods=['POST'])
@jwt_required()
def register_for_event(event_id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    event = Event.query.get_or_404(event_id)
    
    # Vérifier si l'événement est premium et si l'utilisateur est premium
    if event.is_premium and not user.is_premium:
        return jsonify({'error': 'This event requires a premium subscription'}), 403
    
    # Vérifier si l'événement est complet
    if event.max_participants and len(event.participants) >= event.max_participants:
        return jsonify({'error': 'Event is full'}), 400
    
    # Vérifier si l'utilisateur est déjà inscrit
    if EventParticipant.query.filter_by(
        event_id=event_id,
        user_id=current_user_id
    ).first():
        return jsonify({'error': 'Already registered for this event'}), 400
    
    participant = EventParticipant(
        event_id=event_id,
        user_id=current_user_id
    )
    
    db.session.add(participant)
    db.session.commit()
    
    return jsonify({'message': 'Successfully registered for event'})

@bp.route('/events/<int:event_id>/unregister', methods=['DELETE'])
@jwt_required()
def unregister_from_event(event_id):
    current_user_id = get_jwt_identity()
    participant = EventParticipant.query.filter_by(
        event_id=event_id,
        user_id=current_user_id
    ).first_or_404()
    
    db.session.delete(participant)
    db.session.commit()
    
    return jsonify({'message': 'Successfully unregistered from event'})

@bp.route('/events/<int:event_id>', methods=['PUT'])
@jwt_required()
def update_event(event_id):
    current_user_id = get_jwt_identity()
    event = Event.query.get_or_404(event_id)
    
    if event.organizer_id != current_user_id:
        return jsonify({'error': 'Not authorized to update this event'}), 403
    
    data = request.get_json()
    
    if 'title' in data:
        event.title = data['title']
    if 'description' in data:
        event.description = data['description']
    if 'start_time' in data:
        event.start_time = datetime.fromisoformat(data['start_time'])
    if 'end_time' in data:
        event.end_time = datetime.fromisoformat(data['end_time'])
    if 'event_type' in data:
        event.event_type = data['event_type']
    if 'format' in data:
        event.format = data['format']
    if 'location' in data:
        event.location = data['location']
    if 'is_premium' in data:
        event.is_premium = data['is_premium']
    if 'max_participants' in data:
        event.max_participants = data['max_participants']
    
    db.session.commit()
    return jsonify({'message': 'Event updated successfully'})

@bp.route('/events/<int:event_id>', methods=['DELETE'])
@jwt_required()
def delete_event(event_id):
    current_user_id = get_jwt_identity()
    event = Event.query.get_or_404(event_id)
    
    if event.organizer_id != current_user_id:
        return jsonify({'error': 'Not authorized to delete this event'}), 403
    
    db.session.delete(event)
    db.session.commit()
    
    return jsonify({'message': 'Event deleted successfully'})

@bp.route('/events/search', methods=['GET'])
def search_events():
    # Get filter parameters
    event_type = request.args.get('event_type')
    date_filter = request.args.get('date_filter')
    format = request.args.get('format')
    
    # Base query for upcoming events
    query = Event.query.filter(Event.start_time > datetime.utcnow())
    
    # Apply filters
    if event_type:
        query = query.filter_by(event_type=event_type)
    if format:
        query = query.filter_by(format=format)
        
    # Date filtering
    if date_filter:
        today = datetime.now().date()
        if date_filter == 'today':
            query = query.filter(
                db.func.date(Event.start_time) == today
            )
        elif date_filter == 'week':
            week_end = today + timedelta(days=7)
            query = query.filter(
                db.func.date(Event.start_time).between(today, week_end)
            )
        elif date_filter == 'month':
            month_end = today + timedelta(days=30)
            query = query.filter(
                db.func.date(Event.start_time).between(today, month_end)
            )
    
    # Execute query and format results
    events = query.order_by(Event.start_time).all()
    
    # Get current user for registration status
    current_user_id = get_jwt_identity() if request.headers.get('Authorization') else None
    
    return jsonify({
        'events': [{
            'id': event.id,
            'title': event.title,
            'description': event.description,
            'date': event.start_time.strftime('%d/%m/%Y %H:%M'),
            'event_type': event.event_type,
            'format': event.format,
            'location': event.location,
            'is_premium': event.is_premium,
            'image_url': event.image_url,
            'registered_count': len(event.participants),
            'is_registered': any(p.user_id == current_user_id for p in event.participants) if current_user_id else False
        } for event in events]
    })

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in {'png', 'jpg', 'jpeg', 'gif'}
