from pydantic import BaseModel
from typing import Optional
from fastapi import UploadFile


class UserCreate(BaseModel):
    password: str
    email: str
    username: str

class UserLogin(BaseModel):
    password: str
    email: str

class Chat(BaseModel):
    password: str
    lastMessage: str
    # users: list[User] = []

class User(BaseModel):
    password: str
    email: str
    username: str
    chats: list[Chat] = []


class MessageInfo(BaseModel):
    receiver_id: int
    content: str

class UpdateUsername(BaseModel):
    username:Optional[str]
    bio:Optional[str] 

