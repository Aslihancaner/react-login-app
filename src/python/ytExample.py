#pip install fastapi uvicorn sqlalchemy pymysql PyJWT passlib[bcrypt]

# database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

DB_USER = os.getenv("DB_USER", "root")
DB_PASS = os.getenv("DB_PASS", "password")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_NAME = os.getenv("DB_NAME", "market")

DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASS}@{DB_HOST}/{DB_NAME}?charset=utf8mb4"

engine = create_engine(DATABASE_URL, echo=False, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

# models.py
from sqlalchemy import Column, Integer, String
from database import Base

class User(Base):
    __tablename__ = "user"  #gercekte de user mıu gidince bak
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)  # hashed password gelmesi lazım


    # auth.py
import os
import datetime
import uuid
import jwt  # PyJWT
from passlib.hash import bcrypt

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "change-me-to-a-secure-random-value")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60  # ihtiyaç halinde değiştir

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Eğer DB'de hash yoksa (düz metin) bu fonksiyona fallback ekleyebilirsin,
    # ama kesinlikle düz metin saklamamalısın.
    try:
        return bcrypt.verify(plain_password, hashed_password)
    except Exception:
        # fallback: düz text karşılaştırma (tehlikeli — üretimde kullanma)
        return plain_password == hashed_password

def create_access_token(data: dict, expires_delta: int | None = None):
    to_encode = data.copy()
    now = datetime.datetime.utcnow()
    to_encode.update({"iat": now})
    # unique id: jti, böylece token içeriği aynı olsa bile farklı jti ile token farklı olur
    to_encode.update({"jti": str(uuid.uuid4())})
    if expires_delta:
        exp = now + datetime.timedelta(seconds=expires_delta)
    else:
        exp = now + datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": exp})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


# main.py
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models, auth

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

class LoginRequest(BaseModel):
    username: str
    password: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == req.username).first()
    if not user:
        raise HTTPException(status_code=401, detail="Kullanıcı bulunamadı veya hatalı şifre")
    if not auth.verify_password(req.password, user.password):
        raise HTTPException(status_code=401, detail="Kullanıcı bulunamadı veya hatalı şifre")
    token = auth.create_access_token({"sub": user.username, "uid": user.id})
    return {"access_token": token, "token_type": "bearer"}
