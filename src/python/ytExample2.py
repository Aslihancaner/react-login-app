# database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# MySQL bağlantı bilgileri
DB_USER = "root"
DB_PASS = "1234"
DB_HOST = "localhost"
DB_PORT = "3306"
DB_NAME = "market"

# SQLAlchemy bağlantı URL'si
DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}?charset=utf8mb4"

# Engine ve Session ayarları
engine = create_engine(DATABASE_URL, echo=False, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

Base = declarative_base()

# FastAPI'de kullanılacak DB bağımlılığı
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# models.py
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)

    roles = relationship("UserRole", back_populates="user")

class Role(Base):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True, index=True)
    role_name = Column(String(255), unique=True, nullable=False)

    users = relationship("UserRole", back_populates="role")

class UserRole(Base):
    __tablename__ = "user_roles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    role_id = Column(Integer, ForeignKey("roles.id"))

    user = relationship("User", back_populates="roles")
    role = relationship("Role", back_populates="users")

# auth.py
import jwt
import datetime
import uuid
from fastapi import HTTPException, status
from passlib.hash import bcrypt

SECRET_KEY = "mysecretkey"  # Production’da .env'den okumak gerekir
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 120


# Şifre doğrulama
def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.verify(plain_password, hashed_password)
    except Exception:
        # Eğer hash yoksa, eski veriler için plain eşleşme kontrolü
        return plain_password == hashed_password


# JWT token oluşturma
def create_access_token(data: dict, expires_delta: int | None = None):
    to_encode = data.copy()
    now = datetime.datetime.utcnow()
    to_encode.update({"iat": now, "jti": str(uuid.uuid4())})
    if expires_delta:
        exp = now + datetime.timedelta(seconds=expires_delta)
    else:
        exp = now + datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": exp})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


# Token doğrulama
def verify_token(token: str):
    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return decoded
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token süresi dolmuş")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Geçersiz token")

# schemas.py
from pydantic import BaseModel
from typing import List

class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    username: str
    roles: List[str]


# main.py
from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db, engine
import models, auth, schemas

# (isteğe bağlı) modelleri veritabanında oluşturur (varsa dokunmaz)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="FastAPI Login with Roles")

@app.post("/login", response_model=schemas.TokenResponse)
def login(req: schemas.LoginRequest, db: Session = Depends(get_db)):
    # Kullanıcıyı bul
    user = db.query(models.User).filter(models.User.username == req.username).first()

    if not user:
        raise HTTPException(status_code=401, detail="Kullanıcı bulunamadı veya hatalı şifre")

    if not auth.verify_password(req.password, user.password):
        raise HTTPException(status_code=401, detail="Kullanıcı bulunamadı veya hatalı şifre")

    # Kullanıcının rollerini getir
    user_roles = (
        db.query(models.Role.role_name)
        .join(models.UserRole, models.Role.id == models.UserRole.role_id)
        .filter(models.UserRole.user_id == user.id)
        .all()
    )
    roles = [r.role_name for r in user_roles]

    # Token oluştur
    token = auth.create_access_token({
        "sub": user.username,
        "uid": user.id,
        "roles": roles
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "username": user.username,
        "roles": roles
    }


@app.get("/protected")
def protected_route(token: str):
    """Token doğrulama testi"""
    decoded = auth.verify_token(token)
    return {"message": "Token geçerli", "decoded": decoded}
