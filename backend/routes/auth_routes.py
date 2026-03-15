from flask import request
from database.db import db
from models.user import User
from utils.auth_utils import hash_password
from flask_jwt_extended import create_access_token
from utils.auth_utils import verify_password

def login():

    data = request.json

    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user:
        return {"error": "Invalid email or password"}, 401

    if not verify_password(password, user.password_hash):
        return {"error": "Invalid email or password"}, 401

    token = create_access_token(identity=str(user.id))

    return {
        "message": "Login successful",
        "token": token,
        "role": user.role
    }

def register():

    data = request.json

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    if role not in ["tenant", "manager", "technician"]:
        return {"error": "Invalid role"}, 400

    hashed = hash_password(password)

    new_user = User(
        name=name,
        email=email,
        password_hash=hashed,
        role=role
    )

    from sqlalchemy.exc import IntegrityError
    
    try:
        db.session.add(new_user)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return {"error": "Email already exists"}, 400

    return {"message": "User registered successfully"}