from flask import Blueprint, request, jsonify
from app.models import Buddy, User
from app import db
from datetime import datetime


buddy_bp = Blueprint('buddy_bp', __name__)

# Create buddy for a user by email
@buddy_bp.route('/users/<string:user_email>/buddies', methods=['POST'])
def create_buddy(user_email):
    data = request.get_json()
    user = User.query.filter_by(email=user_email).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    try:
        # Convert the birthday string to a Python date object
        birthday = datetime.strptime(data['birthday'], "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400

    buddy = Buddy(
        userId=user.userId,
        name=data['name'],
        birthday=birthday,  
        nickname=data.get('nickname'),
        customMessage=data.get('customMessage')
    )
    db.session.add(buddy)
    db.session.commit()

    return jsonify({"message": "Buddy created"}), 201

# Get all buddies for a user by user email
@buddy_bp.route('/users/<string:user_email>/buddies', methods=['GET'])
def get_all_buddies(user_email):
    user = User.query.filter_by(email=user_email).first()
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
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
@buddy_bp.route("/buddies/<int:buddy_id>", methods=["PUT"])
def update_buddy(buddy_id):
    buddy = Buddy.query.get(buddy_id)

    if buddy:
        data = request.get_json()
        buddy.name = data.get("name", buddy.name)
        buddy.nickname = data.get("nickname", buddy.nickname)
        buddy.customMessage = data.get("customMessage", buddy.customMessage)
        
        birthday_str = data.get("birthday")
        if birthday_str:
            buddy.birthday = datetime.strptime(birthday_str, "%Y-%m-%d").date()

        db.session.commit()
        return jsonify({"message": "Buddy updated successfully!"}), 200
    else:
        return jsonify({"message": "Buddy not found!"}), 404

# Delete buddy
@buddy_bp.route('/buddies/<int:buddy_id>', methods=['DELETE'])
def delete_buddy(buddy_id):
    buddy = Buddy.query.get_or_404(buddy_id)
    db.session.delete(buddy)
    db.session.commit()
    return jsonify({"message": "Buddy deleted"})
