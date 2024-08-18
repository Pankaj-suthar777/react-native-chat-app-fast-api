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
    prefix="/chat",
    tags=['chat']
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get('/my-chats', status_code=status.HTTP_200_OK)
async def get_my_chats(db: Session = Depends(get_db), current_user: int = Depends(get_current_user)):
    chats = db.query(models.Chat).filter(
        models.Chat.users.any(models.User.id == current_user)
    ).all()

    #    chats = db.query(models.Chat).filter(
    #     models.Chat.users.any(models.User.id == current_user)
    # ).order_by(models.Chat.id.asc()).all()

    chat_list = []
    for chat in chats:
        other_user = next(user for user in chat.users if user.id != current_user)

        chat_list.append({
            "chat_id": chat.id,
            "last_message": chat.lastmessage,
            "other_user": {
                "id": other_user.id,
                "username": other_user.username,
                "email": other_user.email,
                "avatar" : other_user.avatar
            }
        })

    return {"chats": chat_list}



@router.get('/get-chat/{chat_id}', status_code=status.HTTP_200_OK)
async def get_chat_details(chat_id: int, db: Session = Depends(get_db), current_user: int = Depends(get_current_user)):

    chat = db.query(models.Chat).filter(models.Chat.id == chat_id).first()

    if not chat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chat not found")

    messages = db.query(models.Message).filter(models.Message.chat_id == chat_id).all()

    users = chat.users

    # friend info
    friend = users[0] if users[0].id != current_user else users[1]

    message_list = [{"id": msg.id, "content": msg.content, "sender_id": msg.sender_id} for msg in messages]

    response = {
        "chat_id": chat.id,
        "chat_info": {
            "last_message": chat.lastmessage,
        },
        "friend_info": {
            "id": friend.id,
            "username": friend.username,
            "email": friend.email
        },
        "messages": message_list
    }

    return response



@router.get('/user-details/{user_id}', status_code=status.HTTP_200_OK)
async def get_chat_details(user_id: int, db: Session = Depends(get_db), current_user: int = Depends(get_current_user)):
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="user not found")



    response = {
        "user": {
            "avatar" : user.avatar,
            "bio" : user.bio,
            "email" : user.email,
            "id" : user.id,
            "username" : user.username
        },
    }

    return response
