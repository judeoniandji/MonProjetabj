from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.api import bp
from app.models import User, Message
from app import db, socketio
from datetime import datetime

@bp.route('/messages', methods=['POST'])
@jwt_required()
def send_message():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # Vérifier si le destinataire existe
    recipient = User.query.get(data.get('recipient_id'))
    if not recipient:
        return jsonify({'error': 'Recipient not found'}), 404
    
    message = Message(
        sender_id=current_user_id,
        recipient_id=data['recipient_id'],
        content=data['content']
    )
    
    db.session.add(message)
    db.session.commit()
    
    # Émettre un événement WebSocket pour la notification en temps réel
    socketio.emit(
        'new_message',
        {
            'message_id': message.id,
            'sender_id': message.sender_id,
            'sender_name': message.sender.profile.full_name,
            'content': message.content,
            'created_at': message.created_at.isoformat()
        },
        room=f'user_{data["recipient_id"]}'
    )
    
    return jsonify({
        'message': 'Message sent successfully',
        'message_id': message.id
    }), 201

@bp.route('/messages', methods=['GET'])
@jwt_required()
def get_messages():
    current_user_id = get_jwt_identity()
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    other_user_id = request.args.get('user_id', type=int)
    
    # Si un user_id est spécifié, obtenir la conversation avec cet utilisateur
    if other_user_id:
        messages = Message.query.filter(
            ((Message.sender_id == current_user_id) & (Message.recipient_id == other_user_id)) |
            ((Message.sender_id == other_user_id) & (Message.recipient_id == current_user_id))
        )
    else:
        # Sinon, obtenir toutes les conversations
        messages = Message.query.filter(
            (Message.sender_id == current_user_id) |
            (Message.recipient_id == current_user_id)
        )
    
    messages = messages.order_by(Message.created_at.desc()).paginate(
        page=page, per_page=per_page
    )
    
    return jsonify({
        'messages': [{
            'id': msg.id,
            'sender_id': msg.sender_id,
            'sender_name': msg.sender.profile.full_name,
            'recipient_id': msg.recipient_id,
            'recipient_name': msg.recipient.profile.full_name,
            'content': msg.content,
            'created_at': msg.created_at.isoformat(),
            'read': msg.read
        } for msg in messages.items],
        'total': messages.total,
        'pages': messages.pages,
        'current_page': messages.page
    })

@bp.route('/messages/unread', methods=['GET'])
@jwt_required()
def get_unread_messages():
    current_user_id = get_jwt_identity()
    
    unread_messages = Message.query.filter_by(
        recipient_id=current_user_id,
        read=False
    ).all()
    
    return jsonify({
        'unread_count': len(unread_messages),
        'messages': [{
            'id': msg.id,
            'sender_id': msg.sender_id,
            'sender_name': msg.sender.profile.full_name,
            'content': msg.content,
            'created_at': msg.created_at.isoformat()
        } for msg in unread_messages]
    })

@bp.route('/messages/<int:message_id>/read', methods=['PUT'])
@jwt_required()
def mark_message_as_read(message_id):
    current_user_id = get_jwt_identity()
    message = Message.query.get_or_404(message_id)
    
    if message.recipient_id != current_user_id:
        return jsonify({'error': 'Not authorized to mark this message as read'}), 403
    
    message.read = True
    db.session.commit()
    
    return jsonify({'message': 'Message marked as read'})

@bp.route('/messages/conversations', methods=['GET'])
@jwt_required()
def get_conversations():
    current_user_id = get_jwt_identity()
    
    # Sous-requête pour obtenir le dernier message de chaque conversation
    last_messages = db.session.query(
        Message,
        db.func.row_number().over(
            partition_by=db.case(
                (Message.sender_id == current_user_id, Message.recipient_id),
                else_=Message.sender_id
            ),
            order_by=Message.created_at.desc()
        ).label('rn')
    ).filter(
        (Message.sender_id == current_user_id) |
        (Message.recipient_id == current_user_id)
    ).subquery()
    
    conversations = db.session.query(Message).select_from(last_messages).filter(
        last_messages.c.rn == 1
    ).order_by(Message.created_at.desc()).all()
    
    return jsonify({
        'conversations': [{
            'user_id': msg.recipient_id if msg.sender_id == current_user_id else msg.sender_id,
            'user_name': msg.recipient.profile.full_name if msg.sender_id == current_user_id else msg.sender.profile.full_name,
            'last_message': {
                'content': msg.content,
                'created_at': msg.created_at.isoformat(),
                'is_sent_by_me': msg.sender_id == current_user_id,
                'read': msg.read
            }
        } for msg in conversations]
    })
