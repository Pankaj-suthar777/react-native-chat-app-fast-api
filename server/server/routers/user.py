from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from ..schemas import schema
from ..database import SessionLocal
from ..models import models
from starlette import status
from sqlalchemy.exc import IntegrityError
from datetime import timedelta, datetime, timezone
from .auth import get_current_user
from dotenv import load_dotenv
import os
from cloudinary.uploader import upload
import cloudinary

load_dotenv()

database_url = os.getenv("DATABASE_URL")
secret_key = os.getenv("SECRET_KEY")

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

router = APIRouter(
    prefix="/user",
    tags=['user']
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



@router.get('/get-search-users/', status_code=status.HTTP_200_OK)
async def get_search_users(search: str,db: Session = Depends(get_db)):
    if search == "":
        return {"users" : []}
    users = db.query(models.User).filter(models.User.username.ilike(f"%{search}%")).all()
    print("users",users)
    return {"users" : users}





@router.post('/upload-profile-picture', status_code=status.HTTP_200_OK)
async def upload_avatar(
image: UploadFile = File(...), 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)
):
    print(f"Received file: {image}")
    db_user = db.query(models.User).filter(models.User.id == current_user).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    try:
        upload_result = upload(image.file)
        file_url = upload_result.get('secure_url')

        if not file_url:
            raise HTTPException(status_code=500, detail="Failed to upload image")

        db_user.avatar = file_url
        db.commit()
        db.refresh(db_user)

        user_info = {
            "email": db_user.email,
            "id": db_user.id,
            "username": db_user.username,
            "avatar": db_user.avatar
        }

        return {"message": "Profile Photo Uploaded", "userInfo": user_info}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@router.put('/update-user', status_code=status.HTTP_200_OK)
async def update_username(
    update_data: schema.UpdateUsername, 
    db: Session = Depends(get_db), 
    current_user: int = Depends(get_current_user)):
    db_user = db.query(models.User).filter(models.User.id == current_user).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if update_data.username is not None:
        db_user.username = update_data.username
    
    if update_data.bio is not None:
        db_user.bio = update_data.bio


    db.commit()
    db.refresh(db_user)

    user_info = {
        "email": db_user.email,
        "id": db_user.id,
        "username": db_user.username,
        "avatar": db_user.avatar,
        "bio": db_user.bio

    }

    return {"message": "Username updated successfully", "userInfo": user_info}