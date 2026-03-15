from flask_jwt_extended import jwt_required
from models.user import User

@jwt_required()
def get_technicians():

    technicians = User.query.filter_by(role="technician").all()

    result = []

    for t in technicians:
        result.append({
            "id": t.id,
            "name": t.name,
            "email": t.email
        })

    return {"technicians": result}