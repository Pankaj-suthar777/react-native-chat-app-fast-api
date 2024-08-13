from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..schemas import schema
from ..database import SessionLocal
from ..models import models
from starlette import status
from sqlalchemy.exc import IntegrityError
from datetime import timedelta, datetime, timezone

router = APIRouter(
    prefix="/user",
    tags=['user']
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



@router.get('/get-search-users/', status_code=status.HTTP_200_OK)
async def get_search_users(search: str,db: Session = Depends(get_db)):
    if search == "":
        return {"users" : []}
    users = db.query(models.User).filter(models.User.username.ilike(f"%{search}%")).all()
    print("users",users)
    return {"users" : users}
