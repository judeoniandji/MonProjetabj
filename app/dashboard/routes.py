from flask import Blueprint, render_template, jsonify, request, current_app
from flask_login import login_required, current_user
from datetime import datetime, timedelta
from ..models import Job, Application, Event, Message, User, Profile, Skill
from .. import db

bp = Blueprint('dashboard', __name__)

@bp.route('/')
@login_required
def index():
    stats = {}
    recent_activities = []
    recommended_jobs = []

    # Get statistics based on user type
    if current_user.user_type == 'student':
        stats['applications_count'] = Application.query.filter_by(student_id=current_user.id).count()
        stats['pending_applications'] = Application.query.filter_by(
            student_id=current_user.id, 
            status='pending'
        ).count()
        
        # Get recommended jobs based on skills
        user_skills = {skill.name.lower() for skill in current_user.skills}
        all_jobs = Job.query.filter_by(status='active').all()
        
        for job in all_jobs:
            job_skills = {skill.lower() for skill in job.required_skills}
            match_score = len(user_skills & job_skills) / len(job_skills) * 100 if job_skills else 0
            if match_score >= 50:  # Only show jobs with >50% match
                recommended_jobs.append({
                    'id': job.id,
                    'title': job.title,
                    'company_name': job.company.name,
                    'description': job.description,
                    'match_score': round(match_score)
                })
        recommended_jobs.sort(key=lambda x: x['match_score'], reverse=True)
        recommended_jobs = recommended_jobs[:4]  # Show top 4 matches

    elif current_user.user_type == 'company':
        stats['active_jobs_count'] = Job.query.filter_by(
            company_id=current_user.id,
            status='active'
        ).count()
        stats['total_applications'] = Application.query.join(Job).filter(
            Job.company_id == current_user.id
        ).count()

    # Common statistics
    stats['upcoming_events_count'] = Event.query.filter(
        Event.date >= datetime.now()
    ).count()
    
    next_event = Event.query.filter(
        Event.date >= datetime.now()
    ).order_by(Event.date).first()
    
    if next_event:
        days = (next_event.date - datetime.now()).days
        stats['next_event_days'] = days
    else:
        stats['next_event_days'] = 0

    stats['unread_messages_count'] = Message.query.filter_by(
        recipient_id=current_user.id,
        read=False
    ).count()
    
    stats['total_conversations'] = db.session.query(
        db.func.count(db.distinct(Message.conversation_id))
    ).filter(
        (Message.sender_id == current_user.id) | 
        (Message.recipient_id == current_user.id)
    ).scalar()

    # Get recent activities
    activities = []
    
    # Applications
    if current_user.user_type == 'student':
        recent_applications = Application.query.filter_by(
            student_id=current_user.id
        ).order_by(Application.created_at.desc()).limit(5).all()
        
        for app in recent_applications:
            activities.append({
                'type': 'application',
                'title': f'Candidature pour {app.job.title}',
                'description': f'Status: {app.status}',
                'time': app.created_at,
                'link': f'/jobs/{app.job_id}'
            })
    
    # Job posts for companies
    elif current_user.user_type == 'company':
        recent_jobs = Job.query.filter_by(
            company_id=current_user.id
        ).order_by(Job.created_at.desc()).limit(5).all()
        
        for job in recent_jobs:
            activities.append({
                'type': 'job_post',
                'title': f'Offre publiée: {job.title}',
                'description': f'{job.applications.count()} candidature(s)',
                'time': job.created_at,
                'link': f'/jobs/{job.id}'
            })

    # Events
    recent_events = Event.query.filter(
        Event.registrations.any(user_id=current_user.id)
    ).order_by(Event.date.desc()).limit(5).all()
    
    for event in recent_events:
        activities.append({
            'type': 'event',
            'title': f'Inscription à {event.title}',
            'description': f'Le {event.date.strftime("%d/%m/%Y")}',
            'time': event.created_at,
            'link': f'/events/{event.id}'
        })

    # Sort activities by time and format them
    activities.sort(key=lambda x: x['time'], reverse=True)
    for activity in activities:
        time_diff = datetime.now() - activity['time']
        if time_diff < timedelta(hours=24):
            time_ago = f"Il y a {time_diff.seconds // 3600} heures"
        else:
            time_ago = f"Il y a {time_diff.days} jours"
        recent_activities.append({
            'title': activity['title'],
            'description': activity['description'],
            'time_ago': time_ago,
            'link': activity['link']
        })

    return render_template('dashboard/index.html',
                         stats=stats,
                         recent_activities=recent_activities,
                         recommended_jobs=recommended_jobs)

@bp.route('/profile')
@login_required
def profile():
    stats = {
        'profile_views': current_user.profile.view_count,
        'connections': len(current_user.connections),
    }
    
    if current_user.user_type == 'student':
        stats['applications_count'] = Application.query.filter_by(
            student_id=current_user.id
        ).count()
        stats['events_attended'] = Event.query.filter(
            Event.registrations.any(user_id=current_user.id)
        ).count()
    elif current_user.user_type == 'company':
        stats['active_jobs'] = Job.query.filter_by(
            company_id=current_user.id,
            status='active'
        ).count()
        stats['total_applications'] = Application.query.join(Job).filter(
            Job.company_id == current_user.id
        ).count()

    # Get recent activities
    activities = []
    
    # Profile views
    recent_views = current_user.profile.recent_views.order_by(
        Profile.viewed_at.desc()
    ).limit(5).all()
    
    for view in recent_views:
        activities.append({
            'icon': 'fas fa-eye',
            'description': f'{view.viewer.full_name} a consulté votre profil',
            'time': view.viewed_at
        })

    # Skills and endorsements
    recent_endorsements = current_user.received_endorsements.order_by(
        Skill.endorsed_at.desc()
    ).limit(5).all()
    
    for endorsement in recent_endorsements:
        activities.append({
            'icon': 'fas fa-thumbs-up',
            'description': f'{endorsement.endorser.full_name} a recommandé votre compétence en {endorsement.skill.name}',
            'time': endorsement.endorsed_at
        })

    # Format activity times
    for activity in activities:
        time_diff = datetime.now() - activity['time']
        if time_diff < timedelta(hours=24):
            activity['time_ago'] = f"Il y a {time_diff.seconds // 3600} heures"
        else:
            activity['time_ago'] = f"Il y a {time_diff.days} jours"

    # Sort activities by time
    activities.sort(key=lambda x: x['time'], reverse=True)

    # Get education history for students
    educations = []
    if current_user.user_type == 'student':
        educations = current_user.educations.order_by(
            Education.end_year.desc()
        ).all()

    return render_template('dashboard/profile.html',
                         stats=stats,
                         activities=activities,
                         educations=educations)

@bp.route('/profile/update', methods=['POST'])
@login_required
def update_profile():
    try:
        if 'avatar' in request.files:
            file = request.files['avatar']
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
                current_user.profile.avatar_url = filename

        current_user.profile.full_name = request.form.get('full_name')
        current_user.profile.bio = request.form.get('bio')
        current_user.profile.linkedin_url = request.form.get('linkedin_url')
        
        db.session.commit()
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@bp.route('/profile/add_skill', methods=['POST'])
@login_required
def add_skill():
    try:
        skill = Skill(
            name=request.form.get('name'),
            level=int(request.form.get('level')),
            user_id=current_user.id
        )
        db.session.add(skill)
        db.session.commit()
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in {'png', 'jpg', 'jpeg', 'gif'}
