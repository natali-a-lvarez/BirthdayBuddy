from flask import Blueprint, request, jsonify
from app.models import Buddy, User
from app import db

buddy_bp = Blueprint('buddy_bp', __name__)

# Create buddy for a user by user ID
@buddy_bp.route('/users/<int:user_id>/buddies', methods=['POST'])
def create_buddy(user_id):
    data = request.get_json()
    user = User.query.get_or_404(user_id)
    buddy = Buddy(
        userId=user.userId,
        name=data['name'],
        birthday=data['birthday'],
        nickname=data.get('nickname'),
        customMessage=data.get('customMessage')
    )
    db.session.add(buddy)
    db.session.commit()
    return jsonify({"message": "Buddy created"}), 201

# Get all buddies for a user by user ID
@buddy_bp.route('/users/<int:user_id>/buddies', methods=['GET'])
def get_all_buddies(user_id):
    user = User.query.get_or_404(user_id)
    buddies = Buddy.query.filter_by(userId=user.userId).all()
    return jsonify([{
        "buddyId": buddy.buddyId,
        "name": buddy.name,
        "birthday": buddy.birthday,
        "nickname": buddy.nickname,
        "customMessage": buddy.customMessage
    } for buddy in buddies])

# Get buddy by ID
@buddy_bp.route('/buddies/<int:buddy_id>', methods=['GET'])
def get_buddy_by_id(buddy_id):
    buddy = Buddy.query.get_or_404(buddy_id)
    return jsonify({
        "buddyId": buddy.buddyId,
        "name": buddy.name,
        "birthday": buddy.birthday,
        "nickname": buddy.nickname,
        "customMessage": buddy.customMessage
    })

# Update buddy information
@buddy_bp.route('/buddies/<int:buddy_id>', methods=['PUT'])
def update_buddy(buddy_id):
    data = request.get_json()
    buddy = Buddy.query.get_or_404(buddy_id)
    buddy.name = data.get('name', buddy.name)
    buddy.birthday = data.get('birthday', buddy.birthday)
    buddy.nickname = data.get('nickname', buddy.nickname)
    buddy.customMessage = data.get('customMessage', buddy.customMessage)
    db.session.commit()
    return jsonify({"message": "Buddy updated"})

# Delete buddy
@buddy_bp.route('/buddies/<int:buddy_id>', methods=['DELETE'])
def delete_buddy(buddy_id):
    buddy = Buddy.query.get_or_404(buddy_id)
    db.session.delete(buddy)
    db.session.commit()
    return jsonify({"message": "Buddy deleted"})
