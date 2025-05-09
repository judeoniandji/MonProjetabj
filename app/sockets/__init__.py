from flask_socketio import emit, join_room, leave_room
from flask_jwt_extended import decode_token
from app import socketio

@socketio.on('connect')
def handle_connect():
    auth_token = socketio.server.environ[socketio.server.request_id]['HTTP_AUTHORIZATION'].split(' ')[1]
    try:
        decoded_token = decode_token(auth_token)
        user_id = decoded_token['sub']
        join_room(f'user_{user_id}')
    except Exception as e:
        return False

@socketio.on('disconnect')
def handle_disconnect():
    auth_token = socketio.server.environ[socketio.server.request_id]['HTTP_AUTHORIZATION'].split(' ')[1]
    try:
        decoded_token = decode_token(auth_token)
        user_id = decoded_token['sub']
        leave_room(f'user_{user_id}')
    except Exception:
        pass
