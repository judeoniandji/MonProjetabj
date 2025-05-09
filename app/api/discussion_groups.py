from flask import Blueprint, request, jsonify, current_app
from flask_login import login_required, current_user
from app import db
from app.models import DiscussionGroup, GroupMessage, MessageReaction, User
from datetime import datetime
import uuid

discussion_groups = Blueprint('discussion_groups', __name__)

@discussion_groups.route('/groups', methods=['GET'])
@login_required
def get_groups():
    """Récupère la liste des groupes de discussion."""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    topic = request.args.get('topic')
    search = request.args.get('search')
    
    # Filtrer par sujet et/ou recherche
    query = DiscussionGroup.query
    
    if topic:
        query = query.filter(DiscussionGroup.topic == topic)
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (DiscussionGroup.name.ilike(search_term)) | 
            (DiscussionGroup.description.ilike(search_term))
        )
    
    # Exclure les groupes privés auxquels l'utilisateur n'appartient pas
    query = query.filter(
        (DiscussionGroup.is_private == False) | 
        (DiscussionGroup.members.any(id=current_user.id))
    )
    
    # Paginer les résultats
    groups = query.order_by(DiscussionGroup.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )
    
    return jsonify({
        'groups': [group.to_dict() for group in groups.items],
        'total': groups.total,
        'pages': groups.pages,
        'current_page': groups.page
    }), 200

@discussion_groups.route('/groups/<int:group_id>', methods=['GET'])
@login_required
def get_group(group_id):
    """Récupère les détails d'un groupe de discussion."""
    group = DiscussionGroup.query.get_or_404(group_id)
    
    # Vérifier si l'utilisateur a le droit d'accéder au groupe
    if group.is_private and not group.is_member(current_user.id):
        return jsonify({'error': 'Vous n\'avez pas accès à ce groupe privé'}), 403
    
    return jsonify(group.to_dict()), 200

@discussion_groups.route('/groups', methods=['POST'])
@login_required
def create_group():
    """Crée un nouveau groupe de discussion."""
    data = request.json
    
    # Validation des données
    if not data.get('name') or not data.get('topic'):
        return jsonify({'error': 'Le nom et le sujet du groupe sont requis'}), 400
    
    # Créer le groupe
    group = DiscussionGroup(
        name=data.get('name'),
        description=data.get('description', ''),
        topic=data.get('topic'),
        created_by_id=current_user.id,
        is_private=data.get('is_private', False),
        banner_image_url=data.get('banner_image_url'),
        icon_url=data.get('icon_url'),
        max_members=data.get('max_members', 500)
    )
    
    # Générer un code d'accès pour les groupes privés
    if group.is_private:
        group.access_code = str(uuid.uuid4())[:8].upper()
    
    db.session.add(group)
    db.session.commit()
    
    # Ajouter le créateur comme membre et administrateur
    group.add_member(current_user.id, is_admin=True)
    
    return jsonify(group.to_dict()), 201

@discussion_groups.route('/groups/<int:group_id>', methods=['PUT'])
@login_required
def update_group(group_id):
    """Met à jour un groupe de discussion."""
    group = DiscussionGroup.query.get_or_404(group_id)
    
    # Vérifier si l'utilisateur est administrateur du groupe
    if not group.is_admin(current_user.id):
        return jsonify({'error': 'Vous n\'avez pas les droits pour modifier ce groupe'}), 403
    
    data = request.json
    
    # Mettre à jour les champs
    if 'name' in data:
        group.name = data['name']
    if 'description' in data:
        group.description = data['description']
    if 'topic' in data:
        group.topic = data['topic']
    if 'is_private' in data:
        group.is_private = data['is_private']
        if group.is_private and not group.access_code:
            group.access_code = str(uuid.uuid4())[:8].upper()
    if 'banner_image_url' in data:
        group.banner_image_url = data['banner_image_url']
    if 'icon_url' in data:
        group.icon_url = data['icon_url']
    if 'max_members' in data:
        group.max_members = data['max_members']
    
    db.session.commit()
    
    return jsonify(group.to_dict()), 200

@discussion_groups.route('/groups/<int:group_id>', methods=['DELETE'])
@login_required
def delete_group(group_id):
    """Supprime un groupe de discussion."""
    group = DiscussionGroup.query.get_or_404(group_id)
    
    # Vérifier si l'utilisateur est administrateur du groupe
    if not group.is_admin(current_user.id):
        return jsonify({'error': 'Vous n\'avez pas les droits pour supprimer ce groupe'}), 403
    
    db.session.delete(group)
    db.session.commit()
    
    return jsonify({'message': 'Groupe supprimé avec succès'}), 200

@discussion_groups.route('/groups/<int:group_id>/join', methods=['POST'])
@login_required
def join_group(group_id):
    """Rejoindre un groupe de discussion."""
    group = DiscussionGroup.query.get_or_404(group_id)
    
    # Vérifier si le groupe est privé
    if group.is_private:
        access_code = request.json.get('access_code')
        if not access_code or access_code != group.access_code:
            return jsonify({'error': 'Code d\'accès invalide'}), 403
    
    # Vérifier si l'utilisateur est déjà membre
    if group.is_member(current_user.id):
        return jsonify({'message': 'Vous êtes déjà membre de ce groupe'}), 200
    
    # Vérifier si le groupe a atteint sa capacité maximale
    if group.get_members_count() >= group.max_members:
        return jsonify({'error': 'Ce groupe a atteint sa capacité maximale'}), 400
    
    # Ajouter l'utilisateur au groupe
    group.add_member(current_user.id)
    
    return jsonify({'message': 'Vous avez rejoint le groupe avec succès'}), 200

@discussion_groups.route('/groups/<int:group_id>/leave', methods=['POST'])
@login_required
def leave_group(group_id):
    """Quitter un groupe de discussion."""
    group = DiscussionGroup.query.get_or_404(group_id)
    
    # Vérifier si l'utilisateur est membre
    if not group.is_member(current_user.id):
        return jsonify({'error': 'Vous n\'êtes pas membre de ce groupe'}), 400
    
    # Vérifier si l'utilisateur est le seul administrateur
    if group.is_admin(current_user.id):
        admin_count = db.session.query(group_members).filter_by(
            group_id=group.id, is_admin=True).count()
        
        if admin_count == 1:
            # Trouver un autre membre pour le promouvoir administrateur
            other_member = db.session.query(group_members).filter(
                group_members.c.group_id == group.id,
                group_members.c.user_id != current_user.id
            ).first()
            
            if other_member:
                # Promouvoir un autre membre
                db.session.execute(
                    group_members.update().where(
                        (group_members.c.user_id == other_member.user_id) &
                        (group_members.c.group_id == group.id)
                    ).values(is_admin=True)
                )
            else:
                # Si l'utilisateur est le seul membre, supprimer le groupe
                db.session.delete(group)
                db.session.commit()
                return jsonify({'message': 'Groupe supprimé car vous étiez le dernier membre'}), 200
    
    # Retirer l'utilisateur du groupe
    group.remove_member(current_user.id)
    
    return jsonify({'message': 'Vous avez quitté le groupe avec succès'}), 200

@discussion_groups.route('/groups/<int:group_id>/members', methods=['GET'])
@login_required
def get_group_members(group_id):
    """Récupère la liste des membres d'un groupe."""
    group = DiscussionGroup.query.get_or_404(group_id)
    
    # Vérifier si l'utilisateur a accès au groupe
    if group.is_private and not group.is_member(current_user.id):
        return jsonify({'error': 'Vous n\'avez pas accès à ce groupe privé'}), 403
    
    # Récupérer les membres avec leur statut d'administrateur
    members_query = db.session.query(
        User, group_members.c.is_admin, group_members.c.joined_at
    ).join(
        group_members, User.id == group_members.c.user_id
    ).filter(
        group_members.c.group_id == group.id
    )
    
    members = []
    for user, is_admin, joined_at in members_query:
        member_info = {
            'id': user.id,
            'name': user.profile.full_name if user.profile else f"Utilisateur {user.id}",
            'email': user.email,
            'is_admin': is_admin,
            'joined_at': joined_at.isoformat() if joined_at else None,
            'avatar_url': user.profile.avatar_url if user.profile else None
        }
        members.append(member_info)
    
    return jsonify({'members': members}), 200

@discussion_groups.route('/groups/<int:group_id>/messages', methods=['GET'])
@login_required
def get_group_messages(group_id):
    """Récupère les messages d'un groupe de discussion."""
    group = DiscussionGroup.query.get_or_404(group_id)
    
    # Vérifier si l'utilisateur est membre du groupe
    if not group.is_member(current_user.id):
        return jsonify({'error': 'Vous n\'êtes pas membre de ce groupe'}), 403
    
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    # Récupérer les messages paginés
    messages = GroupMessage.query.filter_by(group_id=group.id).order_by(
        GroupMessage.created_at.desc()
    ).paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'messages': [message.to_dict() for message in messages.items],
        'total': messages.total,
        'pages': messages.pages,
        'current_page': messages.page
    }), 200

@discussion_groups.route('/groups/<int:group_id>/messages', methods=['POST'])
@login_required
def create_message(group_id):
    """Envoie un message dans un groupe de discussion."""
    group = DiscussionGroup.query.get_or_404(group_id)
    
    # Vérifier si l'utilisateur est membre du groupe
    if not group.is_member(current_user.id):
        return jsonify({'error': 'Vous n\'êtes pas membre de ce groupe'}), 403
    
    data = request.json
    
    # Validation des données
    if not data.get('content'):
        return jsonify({'error': 'Le contenu du message est requis'}), 400
    
    # Créer le message
    message = GroupMessage(
        group_id=group.id,
        sender_id=current_user.id,
        content=data.get('content'),
        attachment_url=data.get('attachment_url'),
        is_announcement=data.get('is_announcement', False) and group.is_admin(current_user.id)
    )
    
    db.session.add(message)
    db.session.commit()
    
    return jsonify(message.to_dict()), 201

@discussion_groups.route('/groups/<int:group_id>/messages/<int:message_id>', methods=['PUT'])
@login_required
def update_message(group_id, message_id):
    """Modifie un message dans un groupe de discussion."""
    message = GroupMessage.query.get_or_404(message_id)
    
    # Vérifier si le message appartient au groupe
    if message.group_id != group_id:
        return jsonify({'error': 'Message non trouvé dans ce groupe'}), 404
    
    # Vérifier si l'utilisateur est l'auteur du message ou un administrateur
    group = DiscussionGroup.query.get_or_404(group_id)
    if message.sender_id != current_user.id and not group.is_admin(current_user.id):
        return jsonify({'error': 'Vous n\'avez pas les droits pour modifier ce message'}), 403
    
    data = request.json
    
    # Mettre à jour le contenu
    if 'content' in data:
        message.content = data['content']
        message.edited_at = datetime.utcnow()
    
    # Mettre à jour le statut d'épinglage (admin uniquement)
    if 'is_pinned' in data and group.is_admin(current_user.id):
        message.is_pinned = data['is_pinned']
    
    db.session.commit()
    
    return jsonify(message.to_dict()), 200

@discussion_groups.route('/groups/<int:group_id>/messages/<int:message_id>', methods=['DELETE'])
@login_required
def delete_message(group_id, message_id):
    """Supprime un message dans un groupe de discussion."""
    message = GroupMessage.query.get_or_404(message_id)
    
    # Vérifier si le message appartient au groupe
    if message.group_id != group_id:
        return jsonify({'error': 'Message non trouvé dans ce groupe'}), 404
    
    # Vérifier si l'utilisateur est l'auteur du message ou un administrateur
    group = DiscussionGroup.query.get_or_404(group_id)
    if message.sender_id != current_user.id and not group.is_admin(current_user.id):
        return jsonify({'error': 'Vous n\'avez pas les droits pour supprimer ce message'}), 403
    
    db.session.delete(message)
    db.session.commit()
    
    return jsonify({'message': 'Message supprimé avec succès'}), 200

@discussion_groups.route('/groups/<int:group_id>/messages/<int:message_id>/reactions', methods=['POST'])
@login_required
def add_reaction(group_id, message_id):
    """Ajoute une réaction à un message."""
    message = GroupMessage.query.get_or_404(message_id)
    
    # Vérifier si le message appartient au groupe
    if message.group_id != group_id:
        return jsonify({'error': 'Message non trouvé dans ce groupe'}), 404
    
    # Vérifier si l'utilisateur est membre du groupe
    group = DiscussionGroup.query.get_or_404(group_id)
    if not group.is_member(current_user.id):
        return jsonify({'error': 'Vous n\'êtes pas membre de ce groupe'}), 403
    
    data = request.json
    reaction_type = data.get('reaction_type')
    
    # Validation des données
    valid_reactions = ['like', 'love', 'laugh', 'wow', 'sad', 'angry']
    if not reaction_type or reaction_type not in valid_reactions:
        return jsonify({'error': 'Type de réaction invalide'}), 400
    
    # Ajouter la réaction
    message.add_reaction(current_user.id, reaction_type)
    
    return jsonify({'message': 'Réaction ajoutée avec succès'}), 200

@discussion_groups.route('/groups/<int:group_id>/messages/<int:message_id>/reactions', methods=['DELETE'])
@login_required
def remove_reaction(group_id, message_id):
    """Supprime une réaction d'un message."""
    message = GroupMessage.query.get_or_404(message_id)
    
    # Vérifier si le message appartient au groupe
    if message.group_id != group_id:
        return jsonify({'error': 'Message non trouvé dans ce groupe'}), 404
    
    # Vérifier si l'utilisateur est membre du groupe
    group = DiscussionGroup.query.get_or_404(group_id)
    if not group.is_member(current_user.id):
        return jsonify({'error': 'Vous n\'êtes pas membre de ce groupe'}), 403
    
    # Supprimer la réaction
    result = message.remove_reaction(current_user.id)
    
    if result:
        return jsonify({'message': 'Réaction supprimée avec succès'}), 200
    else:
        return jsonify({'message': 'Aucune réaction à supprimer'}), 200

@discussion_groups.route('/topics', methods=['GET'])
@login_required
def get_topics():
    """Récupère la liste des sujets disponibles."""
    # Récupérer tous les sujets distincts des groupes
    topics = db.session.query(DiscussionGroup.topic).distinct().all()
    topics_list = [topic[0] for topic in topics]
    
    return jsonify({'topics': topics_list}), 200
