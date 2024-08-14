from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..schemas import schema
from ..database import SessionLocal
from ..models import models
from starlette import status
from sqlalchemy.exc import IntegrityError
from datetime import timedelta, datetime, timezone
from auth import get_current_user

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



@router.post('/upload-profile-picture',status_code=status.HTTP_200_OK)
async def upload_avatar(avatar: schema.ProfileUpload, db: Session = Depends(get_db), current_user: int = Depends(get_current_user)):
        db_user = db.query(models.User).filter(models.User.email == current_user.email).first()

        if not db_user:
          return {"error": "User not found"}

        db_user.avatar = avatar

        db.commit()
        db.refresh(db_user)

        user_info = {
        "email": db_user.email,
        "id": db_user.id,
        "username": db_user.username,
        "avatar": db_user.avatar
        }

        return {"message": "Profile Photo Uploaded" ,"userInfo" : user_info}



@router.put('/update-username', status_code=status.HTTP_200_OK)
async def update_username(
    update_data: schema.UpdateUsername, 
    db: Session = Depends(get_db), 
    current_user: int = Depends(get_current_user)):
    db_user = db.query(models.User).filter(models.User.email == current_user.email).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    db_user.username = update_data.username

    db.commit()
    db.refresh(db_user)

    user_info = {
        "email": db_user.email,
        "id": db_user.id,
        "username": db_user.username,
        "avatar": db_user.avatar
    }

    return {"message": "Username updated successfully", "userInfo": user_info}