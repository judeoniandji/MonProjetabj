from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.api import bp
from app.models import User, Job, Application
from app import db

@bp.route('/jobs/<int:job_id>/apply', methods=['POST'])
@jwt_required()
def apply_for_job(job_id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if user.user_type != 'student':
        return jsonify({'error': 'Only students can apply for jobs'}), 403
    
    job = Job.query.get_or_404(job_id)
    
    # Vérifier si l'étudiant a déjà postulé
    existing_application = Application.query.filter_by(
        job_id=job_id,
        student_id=current_user_id
    ).first()
    
    if existing_application:
        return jsonify({'error': 'You have already applied for this job'}), 400
    
    application = Application(
        job_id=job_id,
        student_id=current_user_id,
        status='pending'
    )
    
    db.session.add(application)
    db.session.commit()
    
    return jsonify({
        'message': 'Application submitted successfully',
        'application_id': application.id
    }), 201

@bp.route('/applications', methods=['GET'])
@jwt_required()
def get_applications():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    if user.user_type == 'student':
        # Pour les étudiants, montrer leurs candidatures
        applications = Application.query.filter_by(student_id=current_user_id)
    elif user.user_type == 'company':
        # Pour les entreprises, montrer les candidatures à leurs offres
        applications = Application.query.join(Job).filter(Job.company_id == current_user_id)
    else:
        return jsonify({'error': 'Unauthorized access'}), 403
    
    applications = applications.order_by(Application.created_at.desc()).paginate(
        page=page, per_page=per_page
    )
    
    return jsonify({
        'applications': [{
            'id': app.id,
            'job_id': app.job_id,
            'job_title': app.job.title,
            'student_id': app.student_id,
            'student_name': app.student.profile.full_name,
            'status': app.status,
            'created_at': app.created_at.isoformat()
        } for app in applications.items],
        'total': applications.total,
        'pages': applications.pages,
        'current_page': applications.page
    })

@bp.route('/applications/<int:application_id>', methods=['GET'])
@jwt_required()
def get_application(application_id):
    current_user_id = get_jwt_identity()
    application = Application.query.get_or_404(application_id)
    
    # Vérifier que l'utilisateur a le droit de voir cette candidature
    if not (application.student_id == current_user_id or 
            application.job.company_id == current_user_id):
        return jsonify({'error': 'Not authorized to view this application'}), 403
    
    return jsonify({
        'id': application.id,
        'job_id': application.job_id,
        'job_title': application.job.title,
        'student_id': application.student_id,
        'student_name': application.student.profile.full_name,
        'status': application.status,
        'created_at': application.created_at.isoformat()
    })

@bp.route('/applications/<int:application_id>/status', methods=['PUT'])
@jwt_required()
def update_application_status(application_id):
    current_user_id = get_jwt_identity()
    application = Application.query.get_or_404(application_id)
    
    # Seule l'entreprise peut mettre à jour le statut
    if application.job.company_id != current_user_id:
        return jsonify({'error': 'Not authorized to update this application'}), 403
    
    data = request.get_json()
    new_status = data.get('status')
    
    if new_status not in ['pending', 'accepted', 'rejected']:
        return jsonify({'error': 'Invalid status'}), 400
    
    application.status = new_status
    db.session.commit()
    
    return jsonify({
        'message': 'Application status updated successfully',
        'new_status': new_status
    })

@bp.route('/applications/<int:application_id>', methods=['DELETE'])
@jwt_required()
def withdraw_application(application_id):
    current_user_id = get_jwt_identity()
    application = Application.query.get_or_404(application_id)
    
    # Seul l'étudiant peut retirer sa candidature
    if application.student_id != current_user_id:
        return jsonify({'error': 'Not authorized to withdraw this application'}), 403
    
    db.session.delete(application)
    db.session.commit()
    
    return jsonify({'message': 'Application withdrawn successfully'})
