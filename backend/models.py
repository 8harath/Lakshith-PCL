from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'farmer', 'client', 'pharma'
    display_name = db.Column(db.String(100))
    location = db.Column(db.String(200))
    contact_info = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    listings = db.relationship('Listing', backref='farmer', lazy=True, cascade='all, delete-orphan')
    posts = db.relationship('QAPost', backref='author', lazy=True, cascade='all, delete-orphan')

    def to_dict(self, include_sensitive=False):
        data = {
            'id': self.id,
            'username': self.username,
            'role': self.role,
            'display_name': self.display_name,
            'location': self.location,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
        if include_sensitive:
            data['contact_info'] = self.contact_info
        return data


class Listing(db.Model):
    __tablename__ = 'listings'

    id = db.Column(db.Integer, primary_key=True)
    farmer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    crop_name = db.Column(db.String(100), nullable=False)
    variety = db.Column(db.String(100))
    quality = db.Column(db.String(50))
    price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Float, nullable=False)
    unit = db.Column(db.String(20), nullable=False)
    location = db.Column(db.String(200), nullable=False)
    harvest_date = db.Column(db.Date, nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self, include_contact=False):
        data = {
            'id': self.id,
            'farmer_id': self.farmer_id,
            'farmer_name': self.farmer.display_name or self.farmer.username,
            'crop_name': self.crop_name,
            'variety': self.variety,
            'quality': self.quality,
            'price': self.price,
            'quantity': self.quantity,
            'unit': self.unit,
            'location': self.location,
            'harvest_date': self.harvest_date.strftime('%d-%m-%Y') if self.harvest_date else None,
            'description': self.description,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
        if include_contact:
            data['contact_info'] = self.farmer.contact_info
        return data


class QAPost(db.Model):
    __tablename__ = 'qa_posts'

    id = db.Column(db.Integer, primary_key=True)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    body = db.Column(db.Text, nullable=False)
    tags = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'author_id': self.author_id,
            'author_name': self.author.display_name or self.author.username,
            'author_role': self.author.role,
            'title': self.title,
            'body': self.body,
            'tags': self.tags.split(',') if self.tags else [],
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
