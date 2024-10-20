from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..schemas import schema
from ..database import SessionLocal
from ..models import models
from starlette import status
from sqlalchemy.exc import IntegrityError
from datetime import timedelta, datetime, timezone
from .auth import get_current_user
from .websocket import send_message_to_client
import json

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
        db.commit()  
        db.refresh(chat)  

    # Send the message
    new_message = models.Message(content=messageInfo.content, chat_id=chat.id, sender_id=current_user)
    db.add(new_message)
    
    chat.total_unseen_message = chat.total_unseen_message + 1
    chat.last_message_send_by = str(current_user)
    chat.lastmessage = messageInfo.content

    
    db.commit()

    await send_message_to_client(messageInfo.receiver_id, json.dumps({
        "chat_id": chat.id,
        "content": messageInfo.content,
        "sender_id": current_user,
    }))

    return {"message": "Message sent successfully", "message_id" : new_message.id,"chat_id": chat.id , "newMessage" : new_message}