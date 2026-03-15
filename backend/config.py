import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL", 
        "postgresql://neondb_owner:npg_7DRXzjgM1JhF@ep-lingering-feather-a1pd6ulp-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False