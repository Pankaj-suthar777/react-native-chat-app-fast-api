from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from ..schemas import schema
from ..database import SessionLocal
from ..models import models
from starlette import status
from .auth import get_current_user
from dotenv import load_dotenv
import os
from cloudinary.uploader import upload
import cloudinary

load_dotenv('../.env')

database_url = os.getenv("DATABASE_URL")
secret_key = os.getenv("SECRET_KEY")

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

router = APIRouter(
    prefix="/story",
    tags=['story']
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post('/add-story',status_code=status.HTTP_200_OK)
async def add_story(storyInfo: schema.StoryInfo, 
    current_user: int = Depends(get_current_user), 
    db: Session = Depends(get_db)):
    if current_user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Please Login Again")
    
    try:
        upload_result = upload(storyInfo.image)
        file_url = upload_result.get('secure_url')

        if not file_url:
            raise HTTPException(status_code=500, detail="Failed to upload image")

        new_story = models.Story(text=storyInfo.text,image=file_url,user_id=current_user)
        db.add(new_story)
        db.commit()

       
        return {"message": "Story Uploaded"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@router.get('/get-my-story', status_code=status.HTTP_200_OK)
async def get_my_story(current_user: str = Depends(get_current_user),db: Session = Depends(get_db)):
    if current_user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Please Login Again")
    
    db_user = db.query(models.User).filter(models.User.id == current_user).first()

    if db_user is None:
       raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    user_info = {
        "email" : db_user.email,
        "id" : db_user.id,
        "username" : db_user.username,
        "avatar" : db_user.avatar
 
    }

    return { "profile" : user_info}



@router.get('/get-all-story', status_code=status.HTTP_200_OK)
async def get_all_story(current_user: str = Depends(get_current_user),db: Session = Depends(get_db)):
    if current_user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Please Login Again")
    
    db_user = db.query(models.User).filter(models.User.id == current_user).first()

    if db_user is None:
       raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    user_info = {
        "email" : db_user.email,
        "id" : db_user.id,
        "username" : db_user.username,
        "avatar" : db_user.avatar
 
    }

    return { "profile" : user_info}
