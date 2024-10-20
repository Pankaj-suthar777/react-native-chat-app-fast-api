from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
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



@router.post('/add-story', status_code=200)
async def add_story(
    text: str = Form(...),  
    image: UploadFile = File(...), 
    current_user: int = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    if current_user is None:
        raise HTTPException(status_code=401, detail="Please Login Again")

    try:
        contents = await image.read()  

        print(f"Debug - Received image: {image.filename}, size: {len(contents)}, type: {image.content_type}")
        print(f"Debug - Received text: {text}")

        upload_result = upload(contents, resource_type="image", public_id=image.filename)
        
        file_url = upload_result.get('secure_url')
        print(f"Debug - File URL: {file_url}")

        if not file_url:
            raise HTTPException(status_code=500, detail="Failed to upload image")

        new_story = models.Story(text=text, image=file_url, user_id=current_user)
        db.add(new_story)
        db.commit()

        return {"message": "Story Uploaded"}

    except Exception as e:
        print(f"Debug - Exception occurred: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# @router.post('/add-story',status_code=status.HTTP_200_OK)
# async def add_story( 
#     text: str = Form(...),  
#     image: UploadFile = File(...), 
#     current_user: int = Depends(get_current_user), 
#     db: Session = Depends(get_db)):


#     try:
#         print(f"Debug - Received image: {image.filename}, size: {image.size}, type: {image.content_type}")
#         print(f"Debug - Received text: {text}")
#         upload_result = await upload(image)
#         print(f"Debug - Upload result: {upload_result}")

#         file_url = upload_result.get('secure_url')
#         print(f"Debug - File URL: {file_url}")

#         if not file_url:
#             raise HTTPException(status_code=500, detail="Failed to upload image")

#         new_story = models.Story(text=text, image=file_url, user_id=current_user)
#         db.add(new_story)
#         db.commit()
#         return {"message": "Story Uploaded"}

#     except Exception as e:
#         print(f"Debug - Exception occurred: {e}")
#         raise HTTPException(status_code=500, detail=str(e))



@router.get('/get-my-story', status_code=status.HTTP_200_OK)
async def get_my_story(current_user: str = Depends(get_current_user),db: Session = Depends(get_db)):
   
    db_story = db.query(models.Story).filter(models.User.id == current_user).all()

    if db_story is None or len(db_story) == 0:
       return {
           "message": "no story",
           "stories": []
       }

    return { "stories" : db_story}



@router.get('/get-friends-story', status_code=status.HTTP_200_OK)
async def get_all_story(current_user: str = Depends(get_current_user),db: Session = Depends(get_db)):
    if current_user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Please Login Again")
    
    db_user = db.query(models.User).filter(models.User.id == current_user).first()

    if db_user is None:
       raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    friends_ids = db.query(models.User.id).join(models.user_chat_association, models.User.id == models.user_chat_association.c.user_id)\
        .join(models.Chat, models.Chat.id == models.user_chat_association.c.chat_id)\
        .filter(models.user_chat_association.c.user_id == current_user).all()
    
    friends_stories = db.query(models.Story).filter(models.Story.user_id.in_([friend_id[0] for friend_id in friends_ids])).all()

    result = []
    for story in friends_stories:
        user_info = {
            "user_id": story.user_id,
            "username": story.user.username,
            "avatar": story.user.avatar,
            "story_id": story.id,
            "image": story.image,
            "text": story.text,
            "created_at": story.created_at
        }
        result.append(user_info)


    return { "stories" : result}
