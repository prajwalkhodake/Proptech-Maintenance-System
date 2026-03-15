from database.db import db
from datetime import datetime

class Request(db.Model):
    __tablename__ = "requests"

    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)

    image = db.Column(db.String(255))
    status = db.Column(db.String(20), default="Open")

    priority = db.Column(db.String(20), default="Medium")
    tenant_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    technician_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)