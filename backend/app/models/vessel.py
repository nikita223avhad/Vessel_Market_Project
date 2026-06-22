
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class Vessel(Base):
    __tablename__="vessels"
    id=Column(Integer, primary_key=True,index=True)
    vessel_name=Column(String, nullable=False)
    vessel_type=Column(String, nullable=False)
    price=Column(Float, nullable=False)
    location=Column(String, nullable=False)
    description=Column(String)
    owner_id=Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at=Column(DateTime(timezone=True), server_default=func.now())
    updated_at=Column(DateTime(timezone=True), onupdate=func.now())
    owner=relationship("User", back_populates="vessels")
    reports = relationship(
    "Report",
    back_populates="vessel",
    cascade="all, delete-orphan"
)