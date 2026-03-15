from database.db import db

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(100), nullable=False)

    email = db.Column(db.String(100), unique=True, nullable=False)

    password_hash = db.Column(db.Text, nullable=False)

    role = db.Column(db.String(20), nullable=False)

    created_at = db.Column(db.DateTime)


    tenant_requests = db.relationship(
        "Request",
        foreign_keys="Request.tenant_id",
        backref="tenant",
        lazy=True
    )

    technician_requests = db.relationship(
        "Request",
        foreign_keys="Request.technician_id",
        backref="technician",
        lazy=True
    )