from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.api import bp
from app.models import User, Job
from app import db

@bp.route('/jobs', methods=['POST'])
@jwt_required()
def create_job():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if user.user_type != 'company':
        return jsonify({'error': 'Only companies can post jobs'}), 403
    
    data = request.get_json()
    job = Job(
        company_id=current_user_id,
        title=data['title'],
        description=data['description'],
        requirements=data.get('requirements', ''),
        location=data.get('location', ''),
        job_type=data.get('job_type', 'full-time')
    )
    
    db.session.add(job)
    db.session.commit()
    
    return jsonify({
        'message': 'Job posted successfully',
        'job_id': job.id
    }), 201

@bp.route('/jobs', methods=['GET'])
def get_jobs():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    job_type = request.args.get('type')
    location = request.args.get('location')
    
    query = Job.query
    
    if job_type:
        query = query.filter_by(job_type=job_type)
    if location:
        query = query.filter_by(location=location)
    
    jobs = query.order_by(Job.created_at.desc()).paginate(page=page, per_page=per_page)
    
    return jsonify({
        'jobs': [{
            'id': job.id,
            'title': job.title,
            'company_id': job.company_id,
            'description': job.description,
            'requirements': job.requirements,
            'location': job.location,
            'job_type': job.job_type,
            'created_at': job.created_at.isoformat()
        } for job in jobs.items],
        'total': jobs.total,
        'pages': jobs.pages,
        'current_page': jobs.page
    })

@bp.route('/jobs/<int:job_id>', methods=['GET'])
def get_job(job_id):
    job = Job.query.get_or_404(job_id)
    
    return jsonify({
        'id': job.id,
        'title': job.title,
        'company_id': job.company_id,
        'description': job.description,
        'requirements': job.requirements,
        'location': job.location,
        'job_type': job.job_type,
        'created_at': job.created_at.isoformat()
    })

@bp.route('/jobs/<int:job_id>', methods=['PUT'])
@jwt_required()
def update_job(job_id):
    current_user_id = get_jwt_identity()
    job = Job.query.get_or_404(job_id)
    
    if job.company_id != current_user_id:
        return jsonify({'error': 'Not authorized to update this job'}), 403
    
    data = request.get_json()
    
    if 'title' in data:
        job.title = data['title']
    if 'description' in data:
        job.description = data['description']
    if 'requirements' in data:
        job.requirements = data['requirements']
    if 'location' in data:
        job.location = data['location']
    if 'job_type' in data:
        job.job_type = data['job_type']
    
    db.session.commit()
    return jsonify({'message': 'Job updated successfully'})

@bp.route('/jobs/<int:job_id>', methods=['DELETE'])
@jwt_required()
def delete_job(job_id):
    current_user_id = get_jwt_identity()
    job = Job.query.get_or_404(job_id)
    
    if job.company_id != current_user_id:
        return jsonify({'error': 'Not authorized to delete this job'}), 403
    
    db.session.delete(job)
    db.session.commit()
    return jsonify({'message': 'Job deleted successfully'})
