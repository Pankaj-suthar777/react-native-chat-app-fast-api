from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..schemas import schema
from ..database import SessionLocal
from ..models import models
from starlette import status
from sqlalchemy.exc import IntegrityError
from datetime import timedelta, datetime, timezone
from .auth import get_current_user

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
    messageInfo: schema.MessageInfo, 
    current_user: int = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    # Check if there is an existing chat between the current user and the receiver
    chat = db.query(models.Chat).filter(
        models.Chat.users.any(models.User.id == current_user)
    ).filter(
        models.Chat.users.any(models.User.id == messageInfo.receiver_id)
    ).first()

    # If no chat exists, create a new chat
    if not chat:
        chat = models.Chat(lastmessage=messageInfo.content)
        current_user_obj = db.query(models.User).filter(models.User.id == current_user).first()
        receiver_obj = db.query(models.User).filter(models.User.id == messageInfo.receiver_id).first()
        
        if not current_user_obj or not receiver_obj:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="One or both users not found")

        chat.users.extend([current_user_obj, receiver_obj])
        db.add(chat)
        db.commit()  # Commit to save the chat before adding the message
        db.refresh(chat)  # Refresh the chat object to get the latest data, including the chat.id

    # Send the message
    new_message = models.Message(content=messageInfo.content, chat_id=chat.id, sender_id=current_user)
    db.add(new_message)
    
    # Update the last message in the chat
    chat.lastmessage = messageInfo.content
    
    db.commit()

    return {"message": "Message sent successfully", "chat_id": chat.id}