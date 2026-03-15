import os
import uuid
from werkzeug.utils import secure_filename
from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from database.db import db
from models.request import Request
from models.user import User
from models.activity_log import ActivityLog

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@jwt_required()
def get_requests():

    user_id = int(get_jwt_identity())

    user = User.query.get(user_id)

    if user.role == "tenant":

        requests = Request.query.filter_by(tenant_id=user_id).all()

    elif user.role == "technician":

        requests = Request.query.filter_by(technician_id=user_id).all()

    elif user.role in ["manager", "admin"]:

        requests = Request.query.all()

    else:

        return {"error": "Invalid role"}, 403

    result = []

    for r in requests:
        result.append({
            "id": r.id,
            "title": r.title,
            "description": r.description,
            "status": r.status,
            "priority": r.priority,
            "tenant_id": r.tenant_id,
            "technician_id": r.technician_id
        })

    return {"requests": result}

@jwt_required()
def create_request():

    user_id = int(get_jwt_identity())

    title = request.form.get("title")
    description = request.form.get("description")
    priority = request.form.get("priority", "Medium")

    image_file = request.files.get("image")

    image_path = None
    if not title or not description:
        return {"error": "Title and description are required"}, 400

    if image_file:

        if not allowed_file(image_file.filename):
            return {"error": "Only jpg, jpeg, png images allowed"}, 400

        ext = image_file.filename.rsplit(".", 1)[1].lower()
        unique_filename = f"{uuid.uuid4()}.{ext}"

        upload_folder = "uploads"

        filepath = os.path.join(upload_folder, unique_filename)
        image_file.save(filepath)
        image_path = filepath

    new_request = Request(
        title=title,
        description=description,
        tenant_id=user_id,
        image=image_path,
        priority=priority
    )

    db.session.add(new_request)
    db.session.commit()

    log = ActivityLog(
        request_id=new_request.id,
        user_id=user_id,
        action="Request created"
    )

    db.session.add(log)
    db.session.commit()

    return {"message": "Request created successfully"}


@jwt_required()
def assign_technician(request_id):

    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)

    if user.role not in ["manager", "admin"]:
        return {"error": "Only manager can assign technicians"}, 403

    data = request.json
    technician_id = data.get("technician_id")

    #Validation
    tech = User.query.get(technician_id)

    if not tech or tech.role != "technician":
        return {"error": "Invalid technician"}, 400

    req = Request.query.get(request_id)

    if not req:
        return {"error": "Request not found"}, 404

    req.technician_id = technician_id
    req.status = "Assigned"

    db.session.commit()

    log = ActivityLog(
        request_id=req.id,
        user_id=user_id,
        action=f"Technician {technician_id} assigned"
    )

    db.session.add(log)
    db.session.commit()

    return {"message": "Technician assigned successfully"}

@jwt_required()
def update_request_status(request_id):

    user_id = int(get_jwt_identity())

    user = User.query.get(user_id)

    if user.role != "technician":
        return {"error": "Only technician can update request status"}, 403

    data = request.json
    new_status = data.get("status")

    req = Request.query.get(request_id)

    valid_transitions = {
        "Open": ["Assigned"],
        "Assigned": ["In Progress"],
        "In Progress": ["Done"]
    }

    if new_status not in valid_transitions.get(req.status, []):
        return {"error": "Invalid status transition"}, 400

    if not req:
        return {"error": "Request not found"}, 404

    if req.technician_id != user_id:
        return {"error": "You are not assigned to this request"}, 403

    req.status = new_status
    db.session.commit()

    log = ActivityLog(
        request_id=req.id,
        user_id=user_id,
        action=f"Status changed to {new_status}"
    )

    db.session.add(log)
    db.session.commit()

    return {"message": "Status updated successfully"}