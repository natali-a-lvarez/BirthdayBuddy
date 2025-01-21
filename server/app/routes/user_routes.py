from flask import Blueprint, request, jsonify
from app.models import User, Buddy
from app import db

user_bp = Blueprint('user_bp', __name__)

# Create a new user
@user_bp.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()

    # Check if user exists by email
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({"message": "User already exists"}), 200

    # Create a new user
    user = User(
        name=data['name'],
        email=data['email'],
        defaultMessage="Happy Birthday!"
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

# Get user by email with buddies
@user_bp.route('/users/<string:user_email>', methods=['GET'])
def get_user_by_email(user_email):
    user = User.query.filter_by(email=user_email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "userId": user.userId,
        "name": user.name,
        "email": user.email,
        "defaultMessage": user.defaultMessage,
        "buddies": [{"buddyId": buddy.buddyId, "name": buddy.name} for buddy in user.buddies]
    })

# Update user's default message by email
@user_bp.route('/users/<string:user_email>', methods=['PUT'])
def update_default_message_by_email(user_email):
    data = request.get_json()
    user = User.query.filter_by(email=user_email).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    # Update default message
    user.defaultMessage = data.get('defaultMessage', user.defaultMessage)
    db.session.commit()

    return jsonify({"message": "User default message updated"})


# Delete user by ID
@user_bp.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)

    # Optionally, delete all associated buddies
    for buddy in user.buddies:
        db.session.delete(buddy)

    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": f"User with ID {user_id} and their associated buddies have been deleted."})
