from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.api import bp
from app.models.badges import Badge, UserBadge, Skill, UserSkill, Endorsement
from app.models import User
from app import db

@bp.route('/badges', methods=['GET'])
@jwt_required()
def get_user_badges():
    current_user_id = get_jwt_identity()
    user_badges = UserBadge.query.filter_by(user_id=current_user_id).all()
    
    return jsonify({
        'badges': [{
            'id': ub.badge.id,
            'name': ub.badge.name,
            'description': ub.badge.description,
            'icon_url': ub.badge.icon_url,
            'awarded_at': ub.awarded_at.isoformat()
        } for ub in user_badges]
    })

@bp.route('/skills', methods=['POST'])
@jwt_required()
def add_skill():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # Vérifier si la compétence existe, sinon la créer
    skill = Skill.query.filter_by(name=data['name'].lower()).first()
    if not skill:
        skill = Skill(
            name=data['name'].lower(),
            category=data.get('category', 'technical')
        )
        db.session.add(skill)
    
    # Ajouter la compétence à l'utilisateur
    user_skill = UserSkill.query.filter_by(
        user_id=current_user_id,
        skill_id=skill.id
    ).first()
    
    if user_skill:
        return jsonify({'error': 'Skill already added'}), 400
    
    user_skill = UserSkill(
        user_id=current_user_id,
        skill_id=skill.id,
        level=data.get('level', 1)
    )
    
    db.session.add(user_skill)
    db.session.commit()
    
    return jsonify({
        'message': 'Skill added successfully',
        'skill': {
            'id': skill.id,
            'name': skill.name,
            'category': skill.category,
            'level': user_skill.level
        }
    }), 201

@bp.route('/skills/<int:skill_id>/endorse', methods=['POST'])
@jwt_required()
def endorse_skill(skill_id):
    current_user_id = get_jwt_identity()
    user_id = request.json.get('user_id')
    
    user_skill = UserSkill.query.filter_by(
        user_id=user_id,
        skill_id=skill_id
    ).first_or_404()
    
    # Vérifier si l'utilisateur n'a pas déjà approuvé cette compétence
    existing_endorsement = Endorsement.query.filter_by(
        user_skill_id=user_skill.id,
        endorser_id=current_user_id
    ).first()
    
    if existing_endorsement:
        return jsonify({'error': 'Already endorsed this skill'}), 400
    
    endorsement = Endorsement(
        user_skill_id=user_skill.id,
        endorser_id=current_user_id
    )
    
    user_skill.endorsements_count += 1
    
    db.session.add(endorsement)
    db.session.commit()
    
    return jsonify({
        'message': 'Skill endorsed successfully',
        'endorsements_count': user_skill.endorsements_count
    })

@bp.route('/recommendations/jobs', methods=['GET'])
@jwt_required()
def get_job_recommendations():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    # Obtenir les compétences de l'utilisateur
    user_skills = [us.skill.name for us in user.skills]
    
    # Trouver les offres correspondant aux compétences
    from app.models import Job
    recommended_jobs = Job.query.filter(
        Job.requirements.contains(any_(user_skills))
    ).limit(10).all()
    
    return jsonify({
        'recommendations': [{
            'id': job.id,
            'title': job.title,
            'company_name': job.company.profile.full_name,
            'description': job.description,
            'match_score': calculate_match_score(user_skills, job.requirements)
        } for job in recommended_jobs]
    })

@bp.route('/recommendations/connections', methods=['GET'])
@jwt_required()
def get_connection_recommendations():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    # Trouver des utilisateurs avec des compétences similaires
    user_skills = [us.skill.name for us in user.skills]
    
    recommended_users = User.query.join(UserSkill).join(Skill).filter(
        User.id != current_user_id,
        Skill.name.in_(user_skills)
    ).distinct().limit(10).all()
    
    return jsonify({
        'recommendations': [{
            'id': rec_user.id,
            'name': rec_user.profile.full_name,
            'title': rec_user.profile.title,
            'common_skills': get_common_skills(user_skills, rec_user)
        } for rec_user in recommended_users]
    })

def calculate_match_score(user_skills, job_requirements):
    # Logique simple de correspondance basée sur les compétences communes
    job_skills = set(job_requirements.lower().split(','))
    common_skills = set(user_skills) & job_skills
    return len(common_skills) / len(job_skills) * 100 if job_skills else 0

def get_common_skills(user_skills, other_user):
    other_skills = [us.skill.name for us in other_user.skills]
    return list(set(user_skills) & set(other_skills))
