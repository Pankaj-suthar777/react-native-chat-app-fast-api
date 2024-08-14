from pydantic import BaseModel, Field


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

class ProfileUpload(BaseModel):
    avatar: str
    
class UpdateUsername(BaseModel):
    username:str = Field(min_length=3,max_length=24)