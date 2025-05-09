from flask import render_template, redirect, url_for, flash, request, current_app, Blueprint
from flask_login import current_user, login_required
from app import db
from app.models.job import Job
from app.models.event import Event
from app.models.message import Message
from app.models.user import User
from app.models.profile import Profile
from app.models.application import Application
from datetime import datetime

bp = Blueprint('main', __name__)

@bp.route('/')
def index():
    if not current_user.is_authenticated:
        return render_template('main/index.html')
    
    # Statistiques générales
    stats = {
        'jobs_count': Job.query.count(),
        'events_count': Event.query.count(),
        'users_count': User.query.count()
    }
    
    # Derniers jobs
    recent_jobs = Job.query.order_by(Job.created_at.desc()).limit(5).all()
    
    # Prochains événements
    upcoming_events = Event.query.filter(
        Event.start_time > datetime.utcnow(),
        Event.status == 'published'
    ).order_by(Event.start_time).limit(5).all()
    
    return render_template('main/dashboard.html',
                         stats=stats,
                         recent_jobs=recent_jobs,
                         upcoming_events=upcoming_events)

@bp.route('/jobs')
def jobs():
    page = request.args.get('page', 1, type=int)
    search = request.args.get('search', '')
    category = request.args.get('category', '')
    
    query = Job.query
    
    if search:
        query = query.filter(Job.title.ilike(f'%{search}%'))
    if category:
        query = query.filter(Job.category == category)
        
    jobs = query.order_by(Job.created_at.desc()).paginate(
        page=page, per_page=12, error_out=False
    )
    
    return render_template('main/jobs.html', jobs=jobs)

@bp.route('/events')
def events():
    page = request.args.get('page', 1, type=int)
    category = request.args.get('category', '')
    
    query = Event.query.filter_by(status='published')
    
    if category:
        query = query.filter(Event.category == category)
        
    events = query.order_by(Event.start_time).paginate(
        page=page, per_page=9, error_out=False
    )
    
    return render_template('main/events.html', events=events)

@bp.route('/profile/<int:user_id>')
def profile(user_id):
    user = User.query.get_or_404(user_id)
    return render_template('main/profile.html', user=user)

@bp.route('/about')
def about():
    return render_template('main/about.html')

@bp.route('/contact')
def contact():
    return render_template('main/contact.html')

@bp.route('/terms')
def terms():
    return render_template('main/terms.html')

@bp.route('/privacy')
def privacy():
    return render_template('main/privacy.html')

# Routes pour les étudiants
@bp.route('/student/dashboard')
@login_required
def student_dashboard():
    if current_user.user_type != 'student':
        return redirect(url_for('main.index'))
    
    # Récupération dynamique des données
    data = {
        'applications_count': Application.query.filter_by(student_id=current_user.id).count(),
        'mentoring_sessions_count': MentoringSession.query.filter_by(student_id=current_user.id).count(),
        'events_count': Event.query.join(EventRegistration).filter(
            EventRegistration.student_id == current_user.id
        ).count(),
        'unread_messages_count': Message.query.filter_by(
            recipient_id=current_user.id,
            read=False
        ).count(),
        'recent_jobs': Job.query.order_by(Job.created_at.desc()).limit(5).all(),
        'upcoming_events': Event.query.filter(
            Event.start_time > datetime.utcnow()
        ).order_by(Event.start_time.asc()).limit(5).all()
    }
    
    return render_template('main/student/dashboard.html', **data)

# Routes pour les entreprises
@bp.route('/company/dashboard')
@login_required
def company_dashboard():
    if current_user.user_type != 'company':
        return redirect(url_for('main.index'))
    
    # Récupération dynamique des données
    data = {
        'job_offers_count': Job.query.filter_by(company_id=current_user.company.id).count(),
        'applications_count': Application.query.join(Job).filter(
            Job.company_id == current_user.company.id
        ).count(),
        'current_interns_count': User.query.filter_by(
            company_id=current_user.company.id,
            is_active=True,
            user_type='student'
        ).count(),
        'unread_messages_count': Message.query.filter_by(
            recipient_id=current_user.id,
            read=False
        ).count(),
        'recent_applications': Application.query.join(Job).filter(
            Job.company_id == current_user.company.id
        ).order_by(Application.created_at.desc()).limit(5).all(),
        'current_interns': User.query.filter_by(
            company_id=current_user.company.id,
            is_active=True,
            user_type='student'
        ).limit(5).all()
    }
    
    return render_template('main/company/dashboard.html', **data)

# Routes pour les mentors
@bp.route('/mentor/dashboard')
@login_required
def mentor_dashboard():
    if current_user.user_type != 'mentor':
        return redirect(url_for('main.index'))
    
    # Récupération dynamique des données
    data = {
        'students_count': User.query.filter_by(mentor_id=current_user.id).count(),
        'sessions_count': MentoringSession.query.filter_by(mentor_id=current_user.id).count(),
        'upcoming_sessions_count': MentoringSession.query.filter(
            MentoringSession.mentor_id == current_user.id,
            MentoringSession.start_time > datetime.utcnow()
        ).count(),
        'unread_messages_count': Message.query.filter_by(
            recipient_id=current_user.id,
            read=False
        ).count(),
        'upcoming_sessions': MentoringSession.query.filter(
            MentoringSession.mentor_id == current_user.id,
            MentoringSession.start_time > datetime.utcnow()
        ).order_by(MentoringSession.start_time.asc()).limit(5).all(),
        'recent_students': User.query.filter_by(
            mentor_id=current_user.id
        ).order_by(User.created_at.desc()).limit(5).all()
    }
    
    return render_template('main/mentor/dashboard.html', **data)

# Routes pour les établissements
@bp.route('/school/dashboard')
@login_required
def school_dashboard():
    if current_user.user_type != 'school':
        return redirect(url_for('main.index'))
    
    # Récupération dynamique des données
    data = {
        'students_count': User.query.filter_by(school_id=current_user.school.id).count(),
        'current_internships_count': Internship.query.filter(
            Internship.student.has(school_id=current_user.school.id),
            Internship.status == 'active'
        ).count(),
        'partners_count': Company.query.join(Internship).filter(
            Internship.student.has(school_id=current_user.school.id)
        ).distinct().count(),
        'unread_messages_count': Message.query.filter_by(
            recipient_id=current_user.id,
            read=False
        ).count(),
        'recent_students': User.query.filter_by(
            school_id=current_user.school.id
        ).order_by(User.created_at.desc()).limit(5).all(),
        'current_internships': Internship.query.filter(
            Internship.student.has(school_id=current_user.school.id),
            Internship.status == 'active'
        ).order_by(Internship.start_date.desc()).limit(5).all()
    }
    
    return render_template('main/school/dashboard.html', **data)

# Routes communes
@bp.route('/messages')
@login_required
def messages():
    messages = Message.query.filter_by(recipient_id=current_user.id).order_by(Message.created_at.desc()).all()
    return render_template('main/messages.html', messages=messages)

@bp.route('/settings', methods=['GET', 'POST'])
@login_required
def settings():
    if request.method == 'POST':
        # Mise à jour dynamique des paramètres
        for key, value in request.form.items():
            if hasattr(current_user.profile, key):
                setattr(current_user.profile, key, value)
        
        db.session.commit()
        flash('Paramètres mis à jour avec succès', 'success')
        return redirect(url_for('main.settings'))
        
    return render_template('main/settings.html')

# Fonctions utilitaires
def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
