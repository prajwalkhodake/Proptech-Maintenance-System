from flask import Flask
from config import Config
from database.db import db
from sqlalchemy import text
from models.user import User
from routes.auth_routes import register
from flask_jwt_extended import JWTManager
from routes.auth_routes import login
from models.request import Request
from routes.request_routes import create_request
from routes.request_routes import get_requests
from routes.request_routes import assign_technician
from routes.request_routes import update_request_status
from flask import send_from_directory
from routes.user_routes import get_technicians
from flask_cors import CORS

app = Flask(__name__)
# Enable CORS for all domains so the frontend can communicate
CORS(app)

app.config.from_object(Config)
app.config["UPLOAD_FOLDER"] = "uploads"

app.config["JWT_SECRET_KEY"] = "super-secret-key"
db.init_app(app)
jwt = JWTManager(app)

app.add_url_rule("/login",
    "login",
    login, 
    methods=["POST"]
)

@app.route("/")
def home():
    return {"message": "PropTech Backend Running"}

app.add_url_rule("/register", "register", register, methods=["POST"])

@app.route("/db-test")
def test_db():
    try:
        db.session.execute(text("SELECT 1"))
        return {"message": "Database connected successfully"}
    except Exception as e:
        return {"error": str(e)}
    
@app.route("/test")
def test():
    return "working"

app.add_url_rule("/requests", "create_request", create_request, methods=["POST"])

app.add_url_rule("/requests", "get_requests", get_requests, methods=["GET"])

app.add_url_rule(
    "/requests/<int:request_id>/assign",
    "assign_technician",
    assign_technician,
    methods=["PUT"]
)
app.add_url_rule(
    "/requests/<int:request_id>/status",
    "update_request_status",
    update_request_status,
    methods=["PUT"]
)

app.add_url_rule("/technicians", view_func=get_technicians, methods=["GET"])

@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory("uploads", filename)
    
if __name__ == "__main__":
    # Explicitly run on port 5001 to avoid macOS control center conflict
    app.run(debug=True, port=5001)


    