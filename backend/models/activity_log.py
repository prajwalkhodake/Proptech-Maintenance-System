from database.db import db
from datetime import datetime

class ActivityLog(db.Model):
    __tablename__ = "activity_logs"

    id = db.Column(db.Integer, primary_key=True)
    request_id = db.Column(db.Integer)
    user_id = db.Column(db.Integer)
    action = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)