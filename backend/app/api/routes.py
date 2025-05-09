from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.api import bp
from app.models import User, Profile, Job, Event, Message
from app import db
from datetime import datetime

# Routes pour les utilisateurs
@bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    query = User.query
    
    # Filtres
    search = request.args.get('search')
    
    if search:
        query = query.join(Profile).filter(
            (Profile.full_name.ilike(f'%{search}%')) |
            (User.email.ilike(f'%{search}%'))
        )
    
    users = query.paginate(page=page, per_page=per_page)
    
    return jsonify({
        'users': [{
            'id': user.id,
            'email': user.email,
            'profile': {
                'full_name': user.profile.full_name,
                'title': user.profile.title,
                'avatar_url': user.profile.avatar_url
            }
        } for user in users.items],
        'total': users.total,
        'pages': users.pages,
        'current_page': users.page
    })

@bp.route('/users/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    
    return jsonify({
        'user': {
            'id': user.id,
            'email': user.email if user.profile.show_email else None,
            'profile': {
                'full_name': user.profile.full_name,
                'title': user.profile.title,
                'bio': user.profile.bio,
                'avatar_url': user.profile.avatar_url,
                'skills': user.profile.skills,
                'experiences': user.profile.experiences,
                'education': user.profile.education,
                'badges': user.profile.badges,
                'linkedin_url': user.profile.linkedin_url,
                'github_url': user.profile.github_url,
                'portfolio_url': user.profile.portfolio_url
            }
        }
    })

# Routes pour les offres d'emploi
@bp.route('/jobs', methods=['POST'])
@jwt_required()
def create_job():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    job = Job(
        title=data['title'],
        company=data['company'],
        description=data['description'],
        type=data['type'],
        location=data['location'],
        salary=data.get('salary')
    )
    
    db.session.add(job)
    db.session.commit()
    
    return jsonify({
        'message': 'Offre d\'emploi créée avec succès',
        'job': {
            'id': job.id,
            'title': job.title,
            'company': job.company,
            'description': job.description,
            'type': job.type,
            'location': job.location,
            'salary': job.salary,
            'created_at': job.created_at.isoformat()
        }
    }), 201

@bp.route('/jobs/<int:job_id>', methods=['PUT'])
@jwt_required()
def update_job(job_id):
    job = Job.query.get_or_404(job_id)
    data = request.get_json()
    
    if 'title' in data:
        job.title = data['title']
    if 'company' in data:
        job.company = data['company']
    if 'description' in data:
        job.description = data['description']
    if 'type' in data:
        job.type = data['type']
    if 'location' in data:
        job.location = data['location']
    if 'salary' in data:
        job.salary = data['salary']
    
    db.session.commit()
    
    return jsonify({
        'message': 'Offre d\'emploi mise à jour avec succès',
        'job': {
            'id': job.id,
            'title': job.title,
            'company': job.company,
            'description': job.description,
            'type': job.type,
            'location': job.location,
            'salary': job.salary,
            'created_at': job.created_at.isoformat()
        }
    })

@bp.route('/jobs/<int:job_id>', methods=['DELETE'])
@jwt_required()
def delete_job(job_id):
    job = Job.query.get_or_404(job_id)
    
    db.session.delete(job)
    db.session.commit()
    
    return jsonify({'message': 'Offre d\'emploi supprimée avec succès'})

# Routes pour les événements
@bp.route('/events', methods=['POST'])
@jwt_required()
def create_event():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    event = Event(
        title=data['title'],
        description=data['description'],
        date=datetime.fromisoformat(data['date']),
        type=data['type'],
        format=data['format'],
        organizer_id=current_user_id
    )
    
    db.session.add(event)
    db.session.commit()
    
    return jsonify({
        'message': 'Événement créé avec succès',
        'event': {
            'id': event.id,
            'title': event.title,
            'description': event.description,
            'date': event.date.isoformat(),
            'type': event.type,
            'format': event.format,
            'organizer': {
                'id': event.organizer.id,
                'name': event.organizer.profile.full_name
            },
            'created_at': event.created_at.isoformat()
        }
    }), 201

@bp.route('/events/<int:event_id>', methods=['PUT'])
@jwt_required()
def update_event(event_id):
    event = Event.query.get_or_404(event_id)
    data = request.get_json()
    
    if 'title' in data:
        event.title = data['title']
    if 'description' in data:
        event.description = data['description']
    if 'date' in data:
        event.date = datetime.fromisoformat(data['date'])
    if 'type' in data:
        event.type = data['type']
    if 'format' in data:
        event.format = data['format']
    
    db.session.commit()
    
    return jsonify({
        'message': 'Événement mis à jour avec succès',
        'event': {
            'id': event.id,
            'title': event.title,
            'description': event.description,
            'date': event.date.isoformat(),
            'type': event.type,
            'format': event.format,
            'organizer': {
                'id': event.organizer.id,
                'name': event.organizer.profile.full_name
            },
            'created_at': event.created_at.isoformat()
        }
    })

@bp.route('/events/<int:event_id>', methods=['DELETE'])
@jwt_required()
def delete_event(event_id):
    event = Event.query.get_or_404(event_id)
    
    db.session.delete(event)
    db.session.commit()
    
    return jsonify({'message': 'Événement supprimé avec succès'}) 