from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base import Base


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)

    vessel_id = Column(
        Integer,
        ForeignKey("vessels.id"),
        nullable=False
    )

    market_data_id = Column(
        Integer,
        ForeignKey("market_data.id"),
        nullable=False
    )

    title = Column(String(255), nullable=False)

    summary = Column(Text, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    created_by = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )
    vessel = relationship(
        "Vessel",
        back_populates="reports"
    )

    market_data = relationship(
        "MarketData",
        back_populates="reports"
    )

    creator = relationship(
        "User",
        back_populates="reports"
    )