
from sqlalchemy.orm import Session
from app.models.market_data import MarketData
from app.schemas.market_data import MarketDataCreate

def create(db:Session,data:MarketDataCreate):
    obj=MarketData(**data.model_dump()); db.add(obj); db.commit(); db.refresh(obj); return obj
def get_all(db): return db.query(MarketData).all()
def get_one(db,id): return db.query(MarketData).filter(MarketData.id==id).first()
def delete(db,id):
    obj=get_one(db,id)
    if obj: db.delete(obj); db.commit()
    return obj
