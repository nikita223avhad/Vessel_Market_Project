
from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.market_data import MarketDataCreate,MarketDataResponse
from app.services import market_data_service
from app.core.dependencies import require_admin

router=APIRouter(prefix="/market-data", tags=["Market Data"])

@router.post("/", response_model=MarketDataResponse)
def create(data:MarketDataCreate, db:Session=Depends(get_db), user=Depends(require_admin)):
    return market_data_service.create(db,data)

@router.get("/", response_model=list[MarketDataResponse])
def all(db:Session=Depends(get_db)): return market_data_service.get_all(db)
