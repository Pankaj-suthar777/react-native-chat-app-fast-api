from fastapi import FastAPI
from .routers import auth
from .database import SessionLocal, engine
from .models import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth.router)
# app.include_router(chat)
# app.include_router(message)
# app.include_router(user)