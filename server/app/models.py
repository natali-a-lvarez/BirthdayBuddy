from app import db

class User(db.Model):
    userId = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True)
    defaultMessage = db.Column(db.String(255), default="Happy Birthday!")
    buddies = db.relationship('Buddy', backref='user', lazy=True)

class Buddy(db.Model):
    buddyId = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey('user.userId'), nullable=False)
    name = db.Column(db.String(100))
    birthday = db.Column(db.Date)
    nickname = db.Column(db.String(100), nullable=True)
    customMessage = db.Column(db.String(255), nullable=True)
