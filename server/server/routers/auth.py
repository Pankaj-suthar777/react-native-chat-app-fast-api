from fastapi import APIRouter, Depends, HTTPException
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from ..schemas import schema
from ..database import SessionLocal
from ..models import models
from starlette import status
from sqlalchemy.exc import IntegrityError
import logging
from jose import JWTError, jwt
from datetime import timedelta, datetime, timezone

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

router = APIRouter(
    prefix="/auth",
    tags=['auth']
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(username: str, user_id: int, expires_delta: timedelta):
    encode = {'sub': username, 'id': user_id}
    expires = datetime.now(timezone.utc) + expires_delta
    encode.update({'exp': expires})
    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)


@router.post('/register',status_code=status.HTTP_201_CREATED)
async def register_user(user: schema.UserCreate, db: Session = Depends(get_db) ):

    db_user = db.query(models.User).filter(models.User.email == user.email).first()
 

    if db_user:
       logging.error("IntegrityError: User with this email or username already exists")
       raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="User with this email or username already exists"
        )


    hashed_password = get_password_hash(user.password)

    create_user_model = models.User(
    email = user.email,
    username = user.username,
    password = hashed_password
    )
    try:
        db.add(create_user_model)
        db.commit()
        db.refresh(create_user_model)

        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

        access_token = create_access_token(
        username=create_user_model.username,user_id=create_user_model.id, expires_delta=access_token_expires
        )

        
        user_info = {
          "email" : create_user_model.email,
          "id" : create_user_model.id,
          "username" : create_user_model.username 
        }

        return {"access_token": access_token, "token_type": "bearer" ,"message": "User register successfull" , "profile" : user_info}    
        
    except IntegrityError:
        db.rollback()
        logging.error("IntegrityError: User with this email or username already exists")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User with this email or username already exists")


@router.post('/login',status_code=status.HTTP_200_OK)
async def login(user: schema.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()

    if db_user is None or not verify_password(user.password,db_user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        username=db_user.username,
        user_id=db_user.id,
        expires_delta=access_token_expires
    )

    user_info = {
        "email" : db_user.email,
        "id" : db_user.id,
        "username" : db_user.username 
    }

    return {"access_token": access_token, "token_type": "bearer","message": "User Login successfull" , "profile" : user_info}

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("id")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication credentials")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication credentials")

    return user_id


@router.get('/is-auth', status_code=status.HTTP_200_OK)
async def is_auth(current_user: str = Depends(get_current_user),db: Session = Depends(get_db)):
    if current_user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Please Login Again")
    
    db_user = db.query(models.User).filter(models.User.id == current_user).first()

    if db_user is None:
       raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    user_info = {
        "email" : db_user.email,
        "id" : db_user.id,
        "username" : db_user.username 
    }

    return { "profile" : user_info}
