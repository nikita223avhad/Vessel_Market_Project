
from pydantic import BaseModel
from datetime import date

class MarketDataCreate(BaseModel):
    region:str
    vessel_type:str
    average_price:float
    demand_index:float
    report_date:date

class MarketDataResponse(MarketDataCreate):
    id:int
    class Config: from_attributes=True
