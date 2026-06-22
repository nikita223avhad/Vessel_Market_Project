
from app.db.base import Base
from app.db.session import engine
from app.models.user import User
from app.models.vessel import Vessel
from app.models.market_data import MarketData
from app.models.report import Report

def init():
    Base.metadata.create_all(bind=engine)

if __name__=="__main__":
    init()
