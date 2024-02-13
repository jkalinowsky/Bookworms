from server import db
from datetime import datetime


class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    author = db.Column(db.String(100), nullable=False)
    image_url = db.Column(db.String(255))
    description = db.Column(db.String(500), nullable=False)
    reviews = db.relationship('Review', backref='book', lazy=True)

    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'author': self.author,
            'image_url': self.image_url,
            'description': self.description
        }


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    description = db.Column(db.String(400))
    image_url = db.Column(db.String(400))
    reviews = db.relationship('Review', backref='user', lazy=True)

    def serialize(self):
        return {
            'id': self.id,
            'username': self.username,
            'password_hash': self.password_hash,
            'description': self.description,
            'image_url': self.image_url,
            'reviews': self.reviews
        }


class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.String(500))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def serialize(self):
        return {
            'id': self.id,
            'rating': self.rating,
            'comment': self.comment,
            'user_id': self.user_id,
            'book_id': self.book_id,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S')
        }
