from flask import Blueprint, request, jsonify
from app.models import User, Buddy
from app import db

user_bp = Blueprint('user_bp', __name__)

# Create user
@user_bp.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    user = User(
        name=data['name'],
        email=data['email'],
        defaultMessage="Happy Birthday!"  # Default message
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User created"}), 201

# Get all users with buddies
@user_bp.route('/users', methods=['GET'])
def get_all_users():
    users = User.query.all()
    return jsonify([{
        "userId": user.userId,
        "name": user.name,
        "email": user.email,
        "defaultMessage": user.defaultMessage,
        "buddies": [{"buddyId": buddy.buddyId, "name": buddy.name} for buddy in user.buddies]
    } for user in users])

# Get user by ID with buddies
@user_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user_by_id(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify({
        "userId": user.userId,
        "name": user.name,
        "email": user.email,
        "defaultMessage": user.defaultMessage,
        "buddies": [{"buddyId": buddy.buddyId, "name": buddy.name} for buddy in user.buddies]
    })

# Update user's default message
@user_bp.route('/users/<int:user_id>', methods=['PUT'])
def update_default_message(user_id):
    data = request.get_json()
    user = User.query.get_or_404(user_id)
    user.defaultMessage = data.get('defaultMessage', user.defaultMessage)
    db.session.commit()
    return jsonify({"message": "User default message updated"})
