from sqlalchemy import Column, Integer, String, Table, ForeignKey
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

user_chat_association = Table(
    'user_chat_association', Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('chat_id', Integer, ForeignKey('chats.id'))
)

class Chat(Base):
    __tablename__ = "chats"

    id = Column(Integer, primary_key=True)
    lastmessage = Column(String)
    users = relationship("User", secondary=user_chat_association, back_populates="chats")
    messages = relationship("Message", back_populates="chat")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, index=True)
    password = Column(String)
    chats = relationship("Chat", secondary=user_chat_association, back_populates="users")

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True)
    content = Column(String)
    chat_id = Column(Integer, ForeignKey('chats.id'))
    sender_id = Column(Integer, ForeignKey('users.id'))

    chat = relationship("Chat", back_populates="messages")
    sender = relationship("User")