#db
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "mysql+pymysql://root:1234@localhost:3306/market"

engine = create_engine(DATABASE_URL, echo=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

#models
from sqlalchemy import Column, Integer, String, Text
from app.database import Base

class Kitap(Base):
    __tablename__ = "kitap"

    id = Column(Integer, primary_key=True, index=True)
    kitap_adi = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)

#schemas

from pydantic import BaseModel

class KitapBase(BaseModel):
    kitap_adi: str
    description: str | None = None

class KitapCreate(KitapBase):
    pass

class KitapUpdate(BaseModel):
    kitap_adi: str | None = None
    description: str | None = None

class KitapResponse(KitapBase):
    id: int

    class Config:
        orm_mode = True

#crud
from sqlalchemy.orm import Session
from app.models.kitap_model import Kitap
from app.schemas.kitap_schema import KitapCreate, KitapUpdate

def get_all_kitaplar(db: Session):
    return db.query(Kitap).all()

def get_kitap_by_id(db: Session, kitap_id: int):
    return db.query(Kitap).filter(Kitap.id == kitap_id).first()

def create_kitap(db: Session, kitap: KitapCreate):
    db_kitap = Kitap(**kitap.dict())
    db.add(db_kitap)
    db.commit()
    db.refresh(db_kitap)
    return db_kitap

def update_kitap(db: Session, kitap_id: int, kitap_update: KitapUpdate):
    kitap = db.query(Kitap).filter(Kitap.id == kitap_id).first()
    if not kitap:
        return None
    for key, value in kitap_update.dict(exclude_unset=True).items():
        setattr(kitap, key, value)
    db.commit()
    db.refresh(kitap)
    return kitap

def delete_kitap(db: Session, kitap_id: int):
    kitap = db.query(Kitap).filter(Kitap.id == kitap_id).first()
    if kitap:
        db.delete(kitap)
        db.commit()
    return kitap

#routers

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas.kitap_schema import KitapCreate, KitapUpdate, KitapResponse
from app.crud import kitap_crud

router = APIRouter(prefix="/kitap", tags=["Kitap"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=list[KitapResponse])
def list_kitaplar(db: Session = Depends(get_db)):
    return kitap_crud.get_all_kitaplar(db)

@router.get("/{kitap_id}", response_model=KitapResponse)
def get_kitap(kitap_id: int, db: Session = Depends(get_db)):
    kitap = kitap_crud.get_kitap_by_id(db, kitap_id)
    if not kitap:
        raise HTTPException(status_code=404, detail="Kitap bulunamadı")
    return kitap

@router.post("/", response_model=KitapResponse, status_code=status.HTTP_201_CREATED)
def create_kitap(kitap: KitapCreate, db: Session = Depends(get_db)):
    return kitap_crud.create_kitap(db, kitap)

@router.put("/{kitap_id}", response_model=KitapResponse)
def update_kitap(kitap_id: int, kitap_update: KitapUpdate, db: Session = Depends(get_db)):
    kitap = kitap_crud.update_kitap(db, kitap_id, kitap_update)
    if not kitap:
        raise HTTPException(status_code=404, detail="Kitap bulunamadı")
    return kitap

@router.delete("/{kitap_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_kitap(kitap_id: int, db: Session = Depends(get_db)):
    kitap = kitap_crud.delete_kitap(db, kitap_id)
    if not kitap:
        raise HTTPException(status_code=404, detail="Kitap bulunamadı")


#main

from fastapi import FastAPI
from app.database import Base, engine
from app.routers import kitap_router

app = FastAPI(title="Market API - Kitap CRUD")

# Veritabanını oluştur
Base.metadata.create_all(bind=engine)

# Router’ları ekle
app.include_router(kitap_router.router)



