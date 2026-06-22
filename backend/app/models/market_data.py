
from sqlalchemy import Column,Integer,String,Float,Date
from app.db.base import Base
from sqlalchemy.orm import relationship

class MarketData(Base):
    __tablename__="market_data"
    id=Column(Integer, primary_key=True,index=True)
    region=Column(String, nullable=False)
    vessel_type=Column(String, nullable=False)
    average_price=Column(Float, nullable=False)
    demand_index=Column(Float, nullable=False)
    report_date=Column(Date, nullable=False)
    reports = relationship(
    "Report",
    back_populates="market_data",
    cascade="all, delete-orphan"
)