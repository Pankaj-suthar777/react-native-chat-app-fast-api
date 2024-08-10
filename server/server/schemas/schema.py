from pydantic import BaseModel


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


    