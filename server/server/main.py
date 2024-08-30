from fastapi import FastAPI
from .routers import auth, user, chat, message, websocket
from .database import SessionLocal, engine
from .models import models
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(chat.router)
app.include_router(message.router)
app.include_router(user.router)
app.include_router(websocket.router)