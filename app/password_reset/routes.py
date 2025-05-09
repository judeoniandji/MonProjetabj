from flask import render_template, redirect, url_for, flash, request, jsonify
from flask_login import current_user
from app import db
from app.password_reset import bp
from app.models.user import User
from app.auth.forms import ResetPasswordRequestForm, ResetPasswordForm
from app.auth.email import send_password_reset_email
import re

@bp.route('/reset_password_request', methods=['GET', 'POST'])
def reset_password_request():
    if current_user.is_authenticated:
        return redirect(url_for('main.index'))
    form = ResetPasswordRequestForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user:
            send_password_reset_email(user)
        flash('Un email avec les instructions pour réinitialiser votre mot de passe vous a été envoyé.', 'info')
        return redirect(url_for('auth.login'))
    return render_template('auth/reset_password_request.html', title='Réinitialiser le mot de passe', form=form)

@bp.route('/reset_password/<token>', methods=['GET', 'POST'])
def reset_password(token):
    if current_user.is_authenticated:
        return redirect(url_for('main.index'))
    user = User.verify_reset_password_token(token)
    if not user:
        flash('Le lien de réinitialisation est invalide ou a expiré.', 'danger')
        return redirect(url_for('auth.login'))
    form = ResetPasswordForm()
    if form.validate_on_submit():
        user.set_password(form.password.data)
        db.session.commit()
        flash('Votre mot de passe a été réinitialisé avec succès.', 'success')
        return redirect(url_for('auth.login'))
    return render_template('auth/reset_password.html', title='Réinitialiser le mot de passe', form=form)

# API routes for password reset
@bp.route('/api/reset_password_request', methods=['POST'])
def api_reset_password_request():
    data = request.get_json()
    if not data or 'email' not in data:
        return jsonify({'error': 'Email requis'}), 400
    
    # Validation du format email
    if not re.match(r'^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$', data['email']):
        return jsonify({'error': 'Format d\'email invalide'}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    if user:
        send_password_reset_email(user)
    
    # Pour des raisons de sécurité, nous retournons toujours un succès
    # même si l'email n'existe pas dans la base de données
    return jsonify({'message': 'Si votre email existe dans notre système, vous recevrez un lien de réinitialisation.'}), 200

@bp.route('/api/reset_password/<token>', methods=['POST'])
def api_reset_password(token):
    data = request.get_json()
    if not data or 'password' not in data:
        return jsonify({'error': 'Mot de passe requis'}), 400
    
    # Validation du mot de passe
    if len(data['password']) < 8:
        return jsonify({'error': 'Le mot de passe doit contenir au moins 8 caractères'}), 400
    
    user = User.verify_reset_password_token(token)
    if not user:
        return jsonify({'error': 'Le lien de réinitialisation est invalide ou a expiré'}), 400
    
    user.set_password(data['password'])
    db.session.commit()
    
    return jsonify({'message': 'Votre mot de passe a été réinitialisé avec succès'}), 200