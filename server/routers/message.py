from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from ..schemas import schema
from ..database import SessionLocal
from ..models import models
from starlette import status
from datetime import timedelta, datetime, timezone
from .auth import get_current_user
from .websocket import send_message_to_client
import json
from sqlalchemy.orm import Session
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
    prefix="/message",
    tags=['message']
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post('/send-message', status_code=status.HTTP_200_OK)
async def send_message(
    receiver_id: int = Form(...),
    content: str = Form(...),
    image: UploadFile = File(None), 
    current_user: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    chat = db.query(models.Chat).filter(
        models.Chat.users.any(models.User.id == current_user)
    ).filter(
        models.Chat.users.any(models.User.id == receiver_id)
    ).first()

    if not chat:
        chat = models.Chat(lastmessage=content)
        current_user_obj = db.query(models.User).filter(models.User.id == current_user).first()
        receiver_obj = db.query(models.User).filter(models.User.id == receiver_id).first()

        if not current_user_obj or not receiver_obj:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="One or both users not found")

        chat.users.extend([current_user_obj, receiver_obj])
        db.add(chat)
        db.commit()
        db.refresh(chat)

    image_url = None
    if image:
        try:
            result = cloudinary.uploader.upload(image.file)
            image_url = result.get('secure_url')
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Image upload failed: {str(e)}")

    new_message = models.Message(content=content, chat_id=chat.id, sender_id=current_user, image_url=image_url)
    db.add(new_message)

    chat.total_unseen_message += 1
    chat.last_message_send_by = str(current_user)
    chat.lastmessage = content

    db.commit()

    await send_message_to_client(receiver_id, json.dumps({
        "chat_id": chat.id,
        "content": content,
        "sender_id": current_user,
        "image_url": image_url, 
    }))

    return {
        "message": "Message sent successfully",
        "message_id": new_message.id,
        "chat_id": chat.id,
        "newMessage": new_message,
        "image_url": image_url
    }