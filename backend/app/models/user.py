
from sqlalchemy import Column,Integer,String,Boolean
from sqlalchemy.orm import relationship
from app.db.base import Base

class User(Base):
    __tablename__="users"
    id=Column(Integer, primary_key=True,index=True)
    username=Column(String, unique=True, nullable=False)
    email=Column(String, unique=True, nullable=False)
    hashed_password=Column(String, nullable=False)
    role=Column(String, nullable=False, default="user")
    is_active=Column(Boolean, default=True)

    vessels=relationship("Vessel", back_populates="owner", cascade="all, delete-orphan")
    reports=relationship("Report", back_populates="creator")
